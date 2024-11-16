import { createWalletClient, createPublicClient, custom, formatEther, parseUnits, encodeFunctionData, parseEther } from 'viem'
import { mainnet, polygonAmoy, sepolia } from 'viem/chains'
import type { IProvider } from "@web3auth/base";
import { usdcTokenAbi, usdcTokenAddress, contractAddress_escrow, contractABI_escrow } from '../components/constants';
import { Console } from 'console';

import * as elliptic from 'elliptic';
import { Hex, hexToBytes } from 'viem';
import { RingSignature, Curve, CurveName, Point } from '@cypher-laboratory/alicesring-lsag';

const getViewChain = (provider: IProvider) => {
    switch (provider.chainId) {
        case "1":
            return mainnet;
        case "0x13882":
            return polygonAmoy;
        case "0xaa36a7":
            return sepolia;
        default:
            return mainnet;
    }
}

const curve = new Curve(CurveName.SECP256K1);

export const getDepositPublicKey = async (
    provider: IProvider
): Promise<string[]> => {
    try {
        // Créer un client public pour lire les données de la blockchain
        const publicClient = createPublicClient({
            chain: getViewChain(provider),
            transport: custom(provider),
        });

        type EscrowData = [string[], string[]]

        // Lire les données du contrat via Viem
        const data = await publicClient.readContract({
            abi: contractABI_escrow,
            address: contractAddress_escrow,
            functionName: 'getDeposits10',
        })  as EscrowData; 

        console.log('Deposits fetched:', data);

        // Retourner directement les clés publiques
        return data[1];
    } catch (error) {
        console.error('Error fetching deposit public keys:', error);
        throw error;
    }
};

const createMessage = (marketId: number, voteId: number, amountUsdc: number, claimed: number): string => {
    const messageObject = {
        market_id: marketId,
        vote_id: voteId,
        amount_usdc: amountUsdc,
        claimed: claimed,
    };
    return JSON.stringify(messageObject);
};

const uint8ArrayToBigInt = (arr: Uint8Array): bigint => {
    return BigInt('0x' + Array.from(arr).map(byte => byte.toString(16).padStart(2, '0')).join(''));
};

export const interactionAMM = async (
    provider: IProvider,
    marketId: number,
    voteId: number,
    amountUsdc: number,
    claimed: number
) => {
    try {
        // Appeler `getDepositPublicKey` pour récupérer les clés publiques
        const publicKeys = await getDepositPublicKey(provider);

        // Supprimer le préfixe `0x` des clés publiques
        const publicKeysWithoutPrefix = publicKeys.map(key => key.replace(/^0x/, ''));

        console.log('Public Keys Without Prefix:', publicKeysWithoutPrefix);

        // Désérialiser les clés publiques pour créer le ring
        const ring: Point[] = publicKeysWithoutPrefix
            .map(compressed => Point.deserialize(compressed))
            .sort((a, b) => {
                const xA = a.x; // bigint
                const xB = b.x; // bigint
                return xA < xB ? -1 : xA > xB ? 1 : 0;
            });

        console.log('Ring:', ring);

        // Générer le message à signer
        const message = createMessage(marketId, voteId, amountUsdc, claimed);
        console.log('Message:', message);

        // Récupérer la clé privée stockée dans le localStorage
        const storedPrivateKey = localStorage.getItem('privateKey');
        if (!storedPrivateKey) {
            throw new Error('Private key not found in localStorage.');
        }

        const signerPrivateKey = hexToBytes(storedPrivateKey as Hex);
        const signerPrivateKeyBigInt = uint8ArrayToBigInt(signerPrivateKey);

        const linkabilityFlag = contractAddress_escrow;

        console.log('Signer Private Key:', signerPrivateKeyBigInt);
        console.log('Linkability Flag:', linkabilityFlag);

        // Signer avec les clés
        const signature = RingSignature.sign(
            ring,
            signerPrivateKeyBigInt,
            message,
            curve,
            linkabilityFlag
        );

        console.log('Signature:', signature);

        return { ring, signature, message };
    } catch (error) {
        console.error('Error in interactionAMM:', error);
        throw error;
    }
};
