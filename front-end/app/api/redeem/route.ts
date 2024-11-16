import { createPublicClient, createWalletClient, http, encodeFunctionData, Address } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKey, rpcUrl } from '@/environment/blockchain';
import { contractAddress_AMM, contractABI_AMM, contractAddress_Oracle, contractABI_Oracle, contractAddress_escrow, contractABI_escrow } from '../../../components/constants';
import { privateKeyToAccount } from 'viem/accounts';
import { HermesClient } from "@pythnetwork/hermes-client";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { marketId, outcome, keyImage, recipient } = body;

        const publicClient = createPublicClient({
            chain: sepolia,
            transport: http(rpcUrl),
        });

        const walletClient = createWalletClient({
            chain: sepolia,
            transport: http(rpcUrl),
        });

        const account = privateKeyToAccount(privateKey as Address);

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
            args: [outcome, keyImage, marketId],
        }) as BigInt;

        console.log("userGain", userGain);

        if (userGain === BigInt(0)) {
            return new Response(
                JSON.stringify({ error: 'No gains available for the provided outcome.' }),
                { status: 400 }
            );
        }

        // Créer une preuve signée
        const message = encodeFunctionData({
            abi: [
                { type: 'function', name: 'keccak256', inputs: ['address', 'uint256'] },
            ],
            functionName: 'keccak256',
            args: [recipient, userGain],
        });

        const signedMessage = await walletClient.signMessage({
            message,
            account,
        });

        console.log("signedMessage", signedMessage);

        // Récupérer l'USDC via le contrat escrow
        const redeemData = encodeFunctionData({
            abi: contractABI_escrow,
            functionName: 'redeem',
            args: [signedMessage, recipient, userGain],
        });

        const redeemTxHash = await walletClient.sendTransaction({
            to: contractAddress_escrow,
            data: redeemData,
            account,
        });

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