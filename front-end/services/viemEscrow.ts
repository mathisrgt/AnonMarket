import { createWalletClient, createPublicClient, custom, formatEther, parseUnits } from 'viem'
import { mainnet, polygonAmoy, sepolia } from 'viem/chains'
import type { IProvider } from "@web3auth/base";
import { usdcTokenAbi, usdcTokenAddress, contractAddress_escrow } from '../components/constant';
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

/////////////////////////////////////////
export async function test(provider: IProvider): Promise<any> {
    const value = parseUnits('10', 6);
    console.log('Parsed units:', value);

    console.log('USDC Token Address:', usdcTokenAddress);
    console.log('Escrow Contract Address:', contractAddress_escrow);

    const publicClient = createPublicClient({
        chain: getViewChain(provider),
        transport: custom(provider)
    });

    const walletClient = createWalletClient({
        chain: getViewChain(provider),
        transport: custom(provider)
    });

    const account = await walletClient.getAddresses();
    console.log("XXXXXXXaccount", account);

    const chainId = await walletClient.getChainId()
    console.log(chainId.toString());

}

export async function approveToken(provider: IProvider): Promise<any> {
    console.log("Provider");
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

        // Simulation de l'appel du contrat
        const { request } = await publicClient.simulateContract({
            account: account[0], // Adresse de l'utilisateur
            address: usdcTokenAddress, 
            abi: usdcTokenAbi, 
            functionName: 'approve',
            args: [contractAddress_escrow, parseUnits('1', 6)] // Approve 1 USDC
        });

        console.log("Simulation successful, sending transaction...", request );

        // Exécution de la transaction après simulation réussie
        const hash = await walletClient.writeContract(request);

        console.log('Transaction hash:', hash);

        // Attente de la confirmation de la transaction
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


export default { approveToken, test };