"use client";

// ui
import { Button } from "@nextui-org/react";
import { useWeb3Auth } from "@web3auth/no-modal-react-hooks";

// viem
import { approveToken, test } from "@/services/viemEscrow";

export default function Market() {
    const {
        provider
    } = useWeb3Auth();

    return (
        <main>
            <Button
                color='primary'
                onClick={() => {
                    if (!provider) throw Error('Error: Provider is not initialized.');
                    approveToken(provider)
                        .then(response => {
                            console.log('Approval successful:', response);
                        })
                        .catch(error => {
                            console.error('Approval failed:', error);
                        });
                }}
            >
                Approve USDC
            </Button>
        </main>
    );
}
