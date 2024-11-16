import { createPublicClient, createWalletClient, http, encodeFunctionData, Address } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKey, rpcUrl } from '@/environment/blockchain';
import { contractAddress_AMM, contractABI_AMM } from '../../../components/constants';
import { RingSignature, Curve, CurveName, Point } from '@cypher-laboratory/alicesring-lsag';
import { privateKeyToAccount } from 'viem/accounts';

// Initialisation de la courbe elliptique
const curve = new Curve(CurveName.SECP256K1);

export async function POST(request: Request) {
    try {
        // Parse le corps JSON de la requête
        const body = await request.json();

        const { message, signature, inputAmount, outcome, marketId } = body;

        console.log('rpcURL:', rpcUrl);

        // Création du client public pour interagir avec le réseau Sepolia
        const publicClient = createPublicClient({
            chain: sepolia,
            transport: http(rpcUrl),
        });

        // Création du wallet client avec la clé privée
        const walletClient = createWalletClient({
            chain: sepolia,
            transport: http(rpcUrl),
        });
        const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
        const account = privateKeyToAccount(privateKey as Address);

        // const account = await walletClient.getAddresses();
        // console.log('Account:', account);

        // Conversion de la signature en format utilisable
        const parsedSignature = RingSignature.fromBase64(signature);
        const point = new Point(curve, [parsedSignature.getKeyImage().x, parsedSignature.getKeyImage().y]);
        const keyImage = point.toEthAddress();

        console.log('Key Image:', keyImage);

        const bytes32KeyImage = `0x${keyImage.slice(2).padStart(64, '0')}`; // Conversion pour bytes32

        console.log('Bytes32 Key Image:', bytes32KeyImage);

        const data = encodeFunctionData({
            abi: contractABI_AMM,
            functionName: 'swap',
            args: [
                BigInt(inputAmount), // Conversion en BigInt pour Viem
                outcome,
                message,
                parsedSignature,
                bytes32KeyImage,
                marketId,
            ],
        });
        console.log('Approve Transaction Data:', data);

        const hash = await walletClient.sendTransaction({
            to: contractAddress_AMM,
            data: data,
            value: BigInt(0),
            account,
        });

        console.log('Approve Transaction Hash:', hash);

        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        // Retourner une réponse réussie avec le hash de la transaction
        return new Response(
            JSON.stringify({
                message: 'Transaction successful',
                transactionHash: hash,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error while processing the swap:', error);

        // Vérification du type pour accéder à error.message
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return new Response(
            JSON.stringify({ error: 'Internal server error', details: errorMessage }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
