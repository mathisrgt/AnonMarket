// use this when there is no `"type": "module"` in your package.json, i.e. you're using commonjs

import { SDK, HashLock, PrivateKeyProviderConnector, NetworkEnum } from "@1inch/cross-chain-sdk";
import { solidityPackedKeccak256, randomBytes, Contract, Wallet } from 'ethers';
import { createWalletClient, createPublicClient, custom, formatEther, parseUnits, encodeFunctionData, parseEther } from 'viem'
import { usdcTokenAbi, usdcTokenAddress, contractAddress_escrow, contractABI_escrow } from '../components/constants';
import Web3 from 'web3';
import { RingSignature, Curve, CurveName, Point } from '@cypher-laboratory/alicesring-lsag';
import { getViewChain } from "./viemEscrow";

const curve = new Curve(CurveName.SECP256K1);

export default async function handleSwap(provider) {
    const publicClient = createPublicClient({
        chain: getViewChain(provider),
        transport: custom(provider),
    });

    const walletClient = createWalletClient({
        chain: getViewChain(provider),
        transport: custom(provider),
    });

    const account = await walletClient.getAddresses();
    console.log(account)
    const data = encodeFunctionData({
        abi: usdcTokenAbi,
        functionName: 'approve',
        args: ["0x111111125421ca6dc452d289314280a0f8842a65", (100000000000000)], // Approuve infite for aggregation router v6
    });

    console.log('Approve Transaction Data:', data);

    const hash = await walletClient.sendTransaction({
        to: usdcTokenAddress,
        data: data,
        value: BigInt(0),
        account: account[0],
    });

    console.log('Approve Transaction Hash:', hash);

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    console.log('Approve Transaction Receipt:', receipt);

    // TODO write formal bug for this function being inaccessible
    function getRandomBytes32() {
        // for some reason the cross-chain-sdk expects a leading 0x and can't handle a 32 byte long hex string
        return '0x' + Buffer.from(randomBytes(32)).toString('hex');
    }

    const makerPrivateKey = process.env.NEXT_PUBLIC_WALLET_KEY;
    const makerAddress = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
    const nodeUrl = process.env.NEXT_PUBLIC_RPC_URL_ETHEREUM; // suggested for ethereum https://eth.llamarpc.com
    const devPortalApiKey = process.env.NEXT_PUBLIC_DEV_PORTAL_KEY

    // Validate environment variables
    if (!makerPrivateKey || !makerAddress || !nodeUrl || !devPortalApiKey) {
        throw new Error("Missing required environment variables. Please check your .env file.");
    }
    const web3Instance = new Web3(nodeUrl);

    const blockchainProvider = new PrivateKeyProviderConnector(makerPrivateKey, web3Instance);

    const sdk = new SDK({
        url: 'https://api.1inch.dev/fusion-plus',
        authKey: devPortalApiKey,
        blockchainProvider
    });
    let srcChainId = NetworkEnum.COINBASE;
    let dstChainId = NetworkEnum.ARBITRUM;
    let srcTokenAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
    let dstTokenAddress = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';

    const invert = true;

    if (invert) {
        const temp = srcChainId;
        srcChainId = dstChainId;
        dstChainId = temp;

        const tempAddress = srcTokenAddress;
        srcTokenAddress = dstTokenAddress;
        dstTokenAddress = tempAddress;

    }

    const params = {
        srcChainId,
        dstChainId,
        srcTokenAddress,
        dstTokenAddress,
        amount: '1000000',
        enableEstimate: true,
        walletAddress: makerAddress
    };

    sdk.getQuote(params).then(quote => {
        const secretsCount = quote.getPreset().secretsCount;

        const secrets = Array.from({ length: secretsCount }).map(() => getRandomBytes32());
        const secretHashes = secrets.map(x => HashLock.hashSecret(x));

        const hashLock = secretsCount === 1
            ? HashLock.forSingleFill(secrets[0])
            : HashLock.forMultipleFills(
                secretHashes.map((secretHash, i) =>
                    solidityPackedKeccak256(['uint64', 'bytes32'], [i, secretHash.toString()])
                )
            );

        console.log("Received Fusion+ quote from 1inch API")

        sdk.placeOrder(quote, {
            walletAddress: makerAddress,
            hashLock,
            secretHashes
        }).then(quoteResponse => {

            const orderHash = quoteResponse.orderHash;

            console.log(`Order successfully placed`);

            const intervalId = setInterval(() => {
                console.log(`Polling for fills until order status is set to "executed"...`);
                sdk.getOrderStatus(orderHash).then(order => {
                    if (order.status === 'executed') {
                        console.log(`Order is complete. Exiting.`);
                        clearInterval(intervalId);
                    }
                }
                ).catch(error =>
                    console.error(`Error: ${JSON.stringify(error, null, 2)}`)
                );

                sdk.getReadyToAcceptSecretFills(orderHash)
                    .then((fillsObject) => {
                        if (fillsObject.fills.length > 0) {
                            fillsObject.fills.forEach(fill => {
                                sdk.submitSecret(orderHash, secrets[fill.idx])
                                    .then(() => {
                                        console.log(`Fill order found! Secret submitted: ${JSON.stringify(secretHashes[fill.idx], null, 2)}`);
                                    })
                                    .catch((error) => {
                                        console.error(`Error submitting secret: ${JSON.stringify(error, null, 2)}`);
                                    });
                            });
                        }
                    })
                    .catch((error) => {
                        console.error(`Error getting ready to accept secret fills: ${error}`);
                    });
            }, 5000);
        }).catch((error) => {
            console.dir(error, { depth: null });
        });
    }).catch((error) => {
        console.dir(error, { depth: null });
    });
}