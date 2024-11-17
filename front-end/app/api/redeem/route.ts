import { createPublicClient, createWalletClient, http, encodeFunctionData, Address } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKey, rpcUrl } from '@/environment/blockchain';
import { contractAddress_AMM, contractABI_AMM, contractAddress_Oracle, contractABI_Oracle, contractAddress_escrow, contractABI_escrow } from '../../../components/constants';
import { HermesClient } from "@pythnetwork/hermes-client";
import { RingSignature, Curve, CurveName, Point } from '@cypher-laboratory/alicesring-lsag';
import { privateKeyToAccount } from 'viem/accounts';

import { keccak256, toBytes } from 'viem';

// Initialisation de la courbe elliptique
const curve = new Curve(CurveName.SECP256K1);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { marketId, outcome, signature, recipient } = body;
        console.log("marketId", marketId, outcome);

        const publicClient = createPublicClient({
            chain: sepolia,
            transport: http(rpcUrl),
        });

        const walletClient = createWalletClient({
            chain: sepolia,
            transport: http(rpcUrl),
        });

        const account = privateKeyToAccount(privateKey as Address);

        // Conversion de la signature en format utilisable
        const parsedSignature = RingSignature.fromBase64(signature);
        const point = new Point(curve, [parsedSignature.getKeyImage().x, parsedSignature.getKeyImage().y]);
        const keyImage = point.toEthAddress();

        console.log('Key Image:', keyImage);

        const bytes32KeyImage = `0x${keyImage.slice(2).padStart(64, '0')}`; // Conversion pour bytes32

        console.log('Bytes32 Key Image:', bytes32KeyImage);

        ////////////////////////////////////

        // Vérifiez si le marché est résolu
        const isMarketResolved = await publicClient.readContract({
            address: contractAddress_Oracle,
            abi: contractABI_Oracle,
            functionName: 'isMarketFinished',
            args: [marketId],
        });

        console.log("isMarketResolved", isMarketResolved);

        if (!isMarketResolved) {
            // Récupérer les dernières mises à jour de prix via Pyth
            const connection = new HermesClient("https://hermes.pyth.network", {});
            const priceIds = [
                "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD
                "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // BTC/USD
            ];

            const priceUpdates = await connection.getLatestPriceUpdates(priceIds);
            const priceUpdateData = priceUpdates.binary.data.map((data) => `0x${data}`);
            console.log("priceUpdateData", priceUpdateData);

            const resolveMarketData = encodeFunctionData({
                abi: contractABI_Oracle,
                functionName: 'resolveMarket',
                args: [marketId, priceUpdateData],
            });

            const txHash = await walletClient.sendTransaction({
                to: contractAddress_Oracle,
                data: resolveMarketData,
                value: BigInt(0),
                account,
            });

            console.log("Transaction hash:", txHash);
            await publicClient.waitForTransactionReceipt({ hash: txHash });
            console.log("Transaction confirmed");
        }

        // Lire le résultat du marché
        const marketResult = await publicClient.readContract({
            address: contractAddress_Oracle,
            abi: contractABI_Oracle,
            functionName: 'readMarketResult',
            args: [marketId],
        });

        console.log("marketResult", marketResult);
        console.log("outcome", outcome);

        if (marketResult !== BigInt(outcome)) {
            return new Response(
                JSON.stringify({ error: 'Market outcome does not match provided outcome.' }),
                { status: 400 }
            );
        }

        // Calculer le gain de l'utilisateur
        const userGain = await publicClient.readContract({
            address: contractAddress_AMM,
            abi: contractABI_AMM,
            functionName: 'calculateUserGain',
            args: [outcome, bytes32KeyImage, marketId],
        }) as BigInt;

        console.log("userGain", userGain);

        if (userGain === BigInt(0)) {
            return new Response(
                JSON.stringify({ error: 'No gains available for the provided outcome.' }),
                { status: 400 }
            );
        }

        // Étape 1 : Préparer les données
        // const messageBytes = toBytes(recipient + userGain.toString());
        // const messageHash = keccak256(messageBytes); // Hash du message

        // console.log('Message Hash:', messageHash);

        // // Étape 2 : Générer le préfixe Ethereum Signed Message
        // const ethSignedMessageHash = keccak256(
        //     toBytes(`\x19Ethereum Signed Message:\n32${messageHash}`)
        // );

        // console.log('Ethereum Signed Message Hash:', ethSignedMessageHash);

        // // Étape 3 : Signer le message
        // const signedMessage = await walletClient.signMessage({
        //     message: ethSignedMessageHash,
        //     account,
        // });

        // console.log("Signed Message:", signedMessage);

        // Maintenant, `signedMessage` peut être utilisé pour appeler la fonction `redeem` de votre contrat

        const redeemData = encodeFunctionData({
            abi: contractABI_escrow,
            functionName: 'redeem',
            args: [bytes32KeyImage, recipient, userGain],
        });
        
        const redeemTxHash = await walletClient.sendTransaction({
            to: contractAddress_escrow,
            data: redeemData,
            value: BigInt(0),
            account,
        });
        
        console.log('Redeem Transaction Hash:', redeemTxHash);

        const receipt = await publicClient.waitForTransactionReceipt({ hash: redeemTxHash });

        console.log("receipt", receipt);

        return new Response(
            JSON.stringify({
                message: 'Redeem successful',
                transactionHash: receipt.transactionHash,
                amountRedeemed: userGain.toString(),
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in /redeem route:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return new Response(
            JSON.stringify({ error: 'Redemption failed', details: errorMessage }),
            { status: 500 }
        );
    }
}