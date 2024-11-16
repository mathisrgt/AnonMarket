"use client";

// ui
import { Button } from "@nextui-org/react";
import { useWeb3Auth } from "@web3auth/no-modal-react-hooks";

// viem
import { betOnChain } from "@/services/viemRPC";

export default function Market() {
    const {
        provider
    } = useWeb3Auth();

    return (
        <main>
            <Button color='primary' onClick={() => {
                if (!provider) throw Error('Error: Provider is not initialized.')
                betOnChain(provider)
            }}>
                Bet
            </Button>
        </main>
    );
}
