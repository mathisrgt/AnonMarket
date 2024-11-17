import { createWalletClient, createPublicClient, custom, formatEther, parseUnits, encodeFunctionData, parseEther } from 'viem'
import { mainnet, polygonAmoy, sepolia } from 'viem/chains'
import type { IProvider } from "@web3auth/base";
import { contractAddress_AMM, contractABI_AMM, contractAddress_escrow, contractABI_escrow } from '../components/constants';
import { Console } from 'console';
import { mark } from 'framer-motion/client';

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

export const getPriceAMM = async (
    provider: IProvider, voteId: number, marketid: number
): Promise<string> => {
    try {
        // Créer un client public pour lire les données de la blockchain
        const publicClient = createPublicClient({
            chain: getViewChain(provider),
            transport: custom(provider),
        });

        // Lire les données du contrat via Viem
        const data = await publicClient.readContract({
            abi: contractABI_AMM,
            address: contractAddress_AMM,
            functionName: 'priceForOutcome',
            args: [voteId, marketid],
        });

        console.log('data', data);

        const rawValue = data as BigInt;
        const formattedValue = Number(rawValue) / 10 ** 18; // Convertir de wei à ether

        console.log(`Formatted value: ${formattedValue}`);

        // Retourner sous forme de chaîne de caractères pour respecter l'interface
        return formattedValue.toFixed(5); // Exemple : "0.52"
    } catch (error) {
        console.error('Error fetching deposit public keys:', error);
        throw error;
    }
};