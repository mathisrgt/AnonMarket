"use client";

// react
import { useRouter } from "next/navigation";

// web3auth
import { WALLET_ADAPTERS } from "@web3auth/base";
import { useWeb3Auth } from "@web3auth/no-modal-react-hooks";

// ui
import { Button } from "@nextui-org/react";

// env
import { auth0_domain } from "@/environment/blockchain";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import NavBar from "@/components/NavBar";

export default function Home() {
  const {
    connectTo,
    isConnected,
    isInitialized
  } = useWeb3Auth();
  const router = useRouter();

  useEffect(() => {
    if (isConnected && isInitialized) {
      router.push('/home');
    }
  }, [isConnected, isInitialized, router]);

  return (
    <>
      <main className="min-h-screen flex flex-col justify-between p-6">
        <div className="flex flex-1 flex-col justify-center">
          <h1 className='text-5xl'>Welcome <br /> to <br /> AnonMarket</h1>
        </div>
        <Button
          className="bg-black text-white h-[60px] text-lg"
          size="lg"
          isDisabled={isConnected}
          onClick={() =>
            connectTo(WALLET_ADAPTERS.AUTH, {
              loginProvider: "jwt",
              extraLoginOptions: {
                domain: auth0_domain,
                verifierIdField: "sub",
                connection: "worldcoin",
              },
            })
          }>
          <ArrowRight />Start
        </Button>
      </main>
    </>
  );
}
