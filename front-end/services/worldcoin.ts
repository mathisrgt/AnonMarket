"use client";

import { useState, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { parseUnits, parseEther, Hex, Abi } from "viem";
import { usdcTokenAbi, usdcTokenAddress, contractAddress_escrow, contractABI_escrow } from "@/components/constants";
import { world_app_id } from "@/environment/blockchain";

export async function sendTransactionWithWorldcoin(contractAbi: Abi, contractAddress: Hex, spenderAddress: Hex, recipientAddress: Hex): Promise<any> {
    try {
        const permitTransfer = {
            permitted: {
                token: "0xYourTokenAddress",
                amount: "10000",
            },
            nonce: Date.now().toString(),
            deadline: Math.floor((Date.now() + 30 * 60 * 1000) / 1000).toString(),
        };

        const transferDetails = {
            to: recipientAddress,
            requestedAmount: "10000",
        };

        const payload = MiniKit.commands.sendTransaction({
            transaction: [
                {
                    address: contractAddress,
                    abi: contractAbi,
                    functionName: "signatureTransfer",
                    args: [
                        [
                            permitTransfer.permitted.token,
                            permitTransfer.permitted.amount,
                            permitTransfer.nonce,
                            permitTransfer.deadline,
                        ],
                        [transferDetails.to, transferDetails.requestedAmount],
                        "PERMIT2_SIGNATURE_PLACEHOLDER_0",
                    ],
                },
            ],
            permit2: [
                {
                    ...permitTransfer,
                    spender: spenderAddress,
                },
            ],
        });

        console.log("Payload crafted:", payload);
        return payload;
    } catch (error) {
        console.error("Error sending transaction with Worldcoin:", error);
        throw error;
    }
}

export function useWorldcoinTransaction(transactionId: string) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const { isLoading: isWaiting, isSuccess: isCompleted, error: receiptError } =
        useWaitForTransactionReceipt({
            client: undefined,
            appConfig: { app_id: world_app_id },
            transactionId,
        });

    useEffect(() => {
        setIsLoading(isWaiting);
        setIsSuccess(isCompleted);
        if (receiptError) setError(receiptError);
    }, [isWaiting, isCompleted, receiptError]);

    return { isLoading, isSuccess, error };
}

// --- Approve Action ---
export async function handleApproveWithWorldcoin(): Promise<any> {
    try {
        const permitTransfer = {
            permitted: {
                token: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003", // WLD
                amount: parseUnits("1", 6).toString(),
            },
            nonce: Date.now().toString(),
            deadline: Math.floor((Date.now() + 30 * 60 * 1000) / 1000).toString(),
        };

        const payload = MiniKit.commands.sendTransaction({
            transaction: [
                {
                    address: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003", // WLD
                    abi: usdcTokenAbi,
                    functionName: "approve",
                    args: [permitTransfer.permitted.token, permitTransfer.permitted.amount],
                },
            ],
            permit2: [
                {
                    ...permitTransfer,
                    spender: "0xYourEscrowContractAddress",
                },
            ],
        });

        console.log("Approve payload crafted:", payload);
        return payload;
    } catch (error) {
        console.error("Error in handleApproveWithWorldcoin:", error);
        throw error;
    }
}

// --- Deposit Action ---
export async function handleDepositWithWorldcoin(): Promise<any> {
    try {
        const publicKey = "0xYourGeneratedPublicKey"; // Replace with the public key generated

        const payload = MiniKit.commands.sendTransaction({
            transaction: [
                {
                    address: contractAddress_escrow,
                    abi: contractABI_escrow,
                    functionName: "deposit10",
                    args: [publicKey],
                },
            ],
        });

        console.log("Deposit payload crafted:", payload);
        return payload;
    } catch (error) {
        console.error("Error in handleDepositWithWorldcoin:", error);
        throw error;
    }
}

// useEffect(() => {
//     if (!MiniKit.isInstalled()) return;

//     MiniKit.subscribe(
//         "MiniAppSendTransaction",
//         async (payload: any) => {
//             if (payload.status === "error") {
//                 console.error("Error sending transaction", payload);
//             } else {
//                 setTransactionId(payload.transaction_id);
//             }
//         }
//     );

//     return () => {
//         MiniKit.unsubscribe("MiniAppSendTransaction");
//     };
// }, []);
