import { createWalletClient, createPublicClient, custom, formatEther, parseUnits, encodeFunctionData, parseEther } from 'viem'
import { mainnet, polygonAmoy, sepolia } from 'viem/chains'
import type { IProvider } from "@web3auth/base";
import { usdcTokenAbi, usdcTokenAddress, contractAddress_escrow } from '../components/constants';
import { Console } from 'console';

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

export async function approveToken(provider: IProvider): Promise<any> {
    try {
        const publicClient = createPublicClient({
            chain: getViewChain(provider),
            transport: custom(provider)
        });

        const walletClient = createWalletClient({
            chain: getViewChain(provider),
            transport: custom(provider)
        });

        const account = await walletClient.getAddresses();
        console.log("account", account);
        console.log("account1", account[1]);

        const data = encodeFunctionData({ 
            abi: usdcTokenAbi, 
            functionName: 'approve', 
            args: [contractAddress_escrow, BigInt(parseUnits('1', 6))] 
        });

        console.log('Send Transaction:', data);

        const hash = await walletClient.sendTransaction({ 
            to: usdcTokenAddress, 
            data: data, 
            value: BigInt(0), 
            account: account[0] });

        console.log('Transaction hash:', hash);

        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        console.log('Transaction receipt:', receipt);

        return JSON.stringify(receipt, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        );
    } catch (error) {
        console.error('Error in approveToken:', error);
        return error;
    }
}