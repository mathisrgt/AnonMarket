import { createWalletClient, createPublicClient, custom, formatEther, parseUnits, encodeFunctionData, parseEther } from 'viem'
import { mainnet, polygonAmoy, sepolia, baseSepolia } from 'viem/chains'
import type { IProvider } from "@web3auth/base";
import { usdcTokenAbi, usdcTokenAddress, contractAddress_escrow, contractABI_escrow } from '../components/constants';
import { Console } from 'console';

import * as elliptic from 'elliptic';
import { Hex, hexToBytes } from 'viem';
import { RingSignature, Curve, CurveName, Point } from '@cypher-laboratory/alicesring-lsag';

export const getViewChain = (provider: IProvider) => {
    switch (provider.chainId) {
        case "1":
            return mainnet;
        case "0x13882":
            return polygonAmoy;
        case "0xaa36a7":
            return sepolia;
        case "0x14A34":
            return baseSepolia;
        default:
            return mainnet;
    }
}

const curve = new Curve(CurveName.SECP256K1);

export async function handleAction(provider: IProvider, isApproved: boolean): Promise<any> {
    try {
        const publicClient = createPublicClient({
            chain: getViewChain(provider),
            transport: custom(provider),
        });

        const walletClient = createWalletClient({
            chain: getViewChain(provider),
            transport: custom(provider),
        });

        const account = await walletClient.getAddresses();

        if (!isApproved) {
            // Étape 1 : Approve
            const data = encodeFunctionData({
                abi: usdcTokenAbi,
                functionName: 'approve',
                args: [contractAddress_escrow, BigInt(parseUnits('1', 6))], // Approuve 1 USDC
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

            return { receipt, isApproved: true }; // Passe à l'étape suivante
        } else {
            // Étape 2 : Deposit
            /// Generate private key
            const ec = new elliptic.ec('secp256k1');
            const keyPair = ec.genKeyPair();
            const privateKeyHex = keyPair.getPrivate('hex');
            const publicKeyHex = keyPair.getPublic(true, 'hex');

            localStorage.setItem('privateKey', privateKeyHex);
            localStorage.setItem('publicKey', publicKeyHex);

            console.log('Generated Private Key:', privateKeyHex);
            console.log('Generated Public Key not Hex:', publicKeyHex);

            const publicKey = `0x${publicKeyHex}`;

            const data = encodeFunctionData({
                abi: contractABI_escrow,
                functionName: 'deposit10',
                args: [publicKey],
            });

            console.log('Deposit Transaction Data:', data);

            const hash = await walletClient.sendTransaction({
                to: contractAddress_escrow,
                data: data,
                value: BigInt(0),
                account: account[0],
            });

            console.log('Deposit Transaction Hash:', hash);

            const receipt = await publicClient.waitForTransactionReceipt({ hash });

            console.log('Deposit Transaction Receipt:', receipt);

            return receipt;
        }
    } catch (error) {
        console.error('Error in handleAction:', error);
        throw error;
    }
}