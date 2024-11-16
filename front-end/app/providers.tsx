"use client";

// Next and React
import { FC, useEffect } from "react";

// web3auth
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { Web3AuthProvider, useWeb3Auth } from "@web3auth/no-modal-react-hooks";
import { WALLET_ADAPTERS, CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK, UX_MODE } from "@web3auth/base";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { AccountAbstractionProvider, BiconomySmartAccount } from "@web3auth/account-abstraction-provider";

// viem
import RPC from "@/services/viemRPC";
import { createWalletClient, WalletClient, custom } from "viem";

// ui
import { NextUIProvider } from "@nextui-org/react";

// env
import { auth0_clientId, auth0_domain, chainId, pimlicoApiKey, verifier_name, web3auth_clientId } from "@/environment/blockchain";

const Providers: FC<any> = ({ children }) => {
  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x14A34", // hex of 84532
    rpcTarget: "https://rpc.ankr.com/base_sepolia",
    displayName: "Base Sepolia",
    blockExplorerUrl: "https://sepolia-explorer.base.org",
    ticker: "ETH",
    tickerName: "ETH",
    logo: "https://github.com/base-org/brand-kit/blob/main/logo/symbol/Base_Symbol_Blue.svg",
  };

  const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

  const authAdapter = new AuthAdapter({
    loginSettings: {
      mfaLevel: "default",
    },
    adapterSettings: {
      uxMode: UX_MODE.REDIRECT,
      loginConfig: {
        jwt: {
          verifier: verifier_name,
          typeOfLogin: "jwt",
          clientId: auth0_clientId,
        },
      },
    },
  });

  const accountAbstractionProvider = new AccountAbstractionProvider({
    config: {
      chainConfig,
      smartAccountInit: new BiconomySmartAccount(),
      bundlerConfig: {
        url: `https://api.pimlico.io/v2/${chainId}/rpc?apikey=${pimlicoApiKey}`,
      },
      paymasterConfig: {
        url: `https://api.pimlico.io/v2/${chainId}/rpc?apikey=${pimlicoApiKey}`,
      },
    },
  });

  // if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  return (
    <NextUIProvider>
      <Web3AuthProvider config={{
        web3AuthOptions: {
          clientId: web3auth_clientId,
          privateKeyProvider,
          accountAbstractionProvider,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          useAAWithExternalWallet: false,
        },
        adapters: [authAdapter]
      }}>{children}</Web3AuthProvider></NextUIProvider>
  );
  // }
};

export default Providers;
