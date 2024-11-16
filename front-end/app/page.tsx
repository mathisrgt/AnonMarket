"use client";

// web3auth
import { WALLET_ADAPTERS } from "@web3auth/base";
import { useWeb3Auth } from "@web3auth/no-modal-react-hooks";

// viem
import RPC from "@/services/viemRPC";
import { createWalletClient, WalletClient, custom } from "viem";

// ui
import { Button } from "@nextui-org/react";

// env
import { auth0_clientId, auth0_domain, chainId, pimlicoApiKey, verifier_name, web3auth_clientId } from "@/environment/blockchain";

export default function Home() {
  const {
    connectTo,
    logout,
    isConnected,
    addAndSwitchChain,
    authenticateUser,
    addChain,
    switchChain,
    userInfo,
    provider
  } = useWeb3Auth();

  const signMessage = async () => {
    if (!provider) throw Error("Error: Impossible to sign a message. Provider is not initialized.");

    const signedMessage = await RPC.signMessage(provider);
    console.log(signedMessage);
  };

  const sendTransaction = async () => {
    if (!provider) throw Error("Error: Impossible to sign a message. Provider is not initialized.");

    console.log("Sending Transaction...");
    const transactionReceipt = await RPC.sendTransaction(provider);
    console.log(transactionReceipt);
  };

  return (
    <main>
      <h1>Welcome to AnonMarket</h1>

      <div>
        {isConnected ? (
          <>
            <Button onClick={() => switchChain({ chainId: "0x89" })}>Switch Chain</Button>
            <Button
              onClick={() =>
                addAndSwitchChain({
                  chainNamespace: "eip155",
                  chainId: "0x89",
                  rpcTarget: "https://rpc.ankr.com/polygon",
                  displayName: "Polygon Ecosystem Token",
                  tickerName: "POL",
                })
              }
            >
              Add and Switch Chain
            </Button>
            <Button onClick={authenticateUser}>Authenticate User</Button>
            <Button color='primary' onClick={() => { console.log('User info', userInfo) }}>
              User info
            </Button>

            <Button color='primary' onClick={() => { logout() }}>
              Log out
            </Button>

            <Button color='primary' onClick={() => { signMessage() }}>
              Sign message
            </Button>

            <Button color='primary' onClick={() => { sendTransaction() }}>
              Send transaction
            </Button>
            <Button
              onClick={() =>
                addChain({
                  chainNamespace: "eip155",
                  chainId: "0x89",
                  rpcTarget: "https://rpc.ankr.com/polygon",
                  displayName: "Polygon Mainnet",
                  ticker: "MATIC",
                })
              }
            >
              Add Chain
            </Button>
            <Button onClick={() => logout()}>Logout</Button>
          </>
        ) : (
          <Button
            onClick={() =>
              connectTo(WALLET_ADAPTERS.AUTH, {
                loginProvider: "jwt",
                extraLoginOptions: {
                  domain: auth0_domain,
                  verifierIdField: "sub",
                  connection: "worldcoin",
                },
              })
            }>Login
          </Button>
        )}
      </div>
    </main>
  );
}
