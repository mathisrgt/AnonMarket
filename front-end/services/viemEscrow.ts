import { createWalletClient, createPublicClient, custom, formatEther, parseUnits, encodeFunctionData, parseEther, PublicClient, WalletClient } from 'viem'

import type { IProvider } from "@web3auth/base";
import { usdcTokenAbi, usdcTokenAddress, contractAddress_escrow, contractABI_escrow } from '../components/constants';
import { Console } from 'console';

import * as elliptic from 'elliptic';
import { Hex, hexToBytes } from 'viem';
import { RingSignature, Curve, CurveName, Point } from '@cypher-laboratory/alicesring-lsag';
import { chainId } from '@/environment/blockchain';

const curve = new Curve(CurveName.SECP256K1);

export async function handleApproveAction(provider: IProvider, publicClient: PublicClient, walletClient: WalletClient): Promise<any> {
    try {
        const account = await walletClient.getAddresses();

        // Étape 1 : Approve
        const data = encodeFunctionData({
            abi: usdcTokenAbi,
            functionName: 'approve',
            args: [contractAddress_escrow, BigInt(parseUnits('1', 6))], // Approuve 1 USDC
        });

        console.log('Approve Transaction Data:', data);

        const hash = await walletClient.sendTransaction({
            chain: undefined, // TODO
            to: usdcTokenAddress,
            data: data,
            value: BigInt(0),
            account: account[0],
        });

        console.log('Approve Transaction Hash:', hash);

        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        console.log('Approve Transaction Receipt:', receipt);
        return receipt;
    } catch (error) {
        console.error('Error in handleAction:', error);
        throw error;
    }
}
export async function handleDepositAction(provider: IProvider, publicClient: PublicClient, walletClient: WalletClient): Promise<any> {
    try {
        const account = await walletClient.getAddresses();

        // Passe à l'étape suivante
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

        const dataDeposit = encodeFunctionData({
            abi: contractABI_escrow,
            functionName: 'deposit10',
            args: [publicKey],
        });

        console.log('Deposit Transaction Data:', dataDeposit);

        const hash = await walletClient.sendTransaction({
            chain: undefined, // TODO
            to: contractAddress_escrow,
            data: dataDeposit,
            value: BigInt(0),
            account: account[0],
        });

        console.log('Deposit Transaction Hash:', hash);

        const receiptDeposit = await publicClient.waitForTransactionReceipt({ hash });

        console.log('Deposit Transaction Receipt:', receiptDeposit);

        return receiptDeposit;
    } catch (error) {
        console.error('Error in handleAction:', error);
        throw error;
    }
}