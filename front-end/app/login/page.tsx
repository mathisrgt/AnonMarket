"use client";

// Next and React
import { useEffect, useState } from "react";

// web3auth
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { WALLET_ADAPTERS, CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK, UX_MODE } from "@web3auth/base";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { AccountAbstractionProvider, BiconomySmartAccount } from "@web3auth/account-abstraction-provider";

// viem
import RPC from "@/services/viemRPC";
import { createWalletClient, WalletClient, custom } from "viem";

// ui
import { Button } from "@nextui-org/react";

// env
import { auth0_clientId, auth0_domain, chainId, pimlicoApiKey, verifier_name, web3auth_clientId } from "@/environment/blockchain";

export default function Login() {
    const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
    const [provider, setProvider] = useState<IProvider | null>(null);
    const [wallet, setWallet] = useState<WalletClient | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const chainConfig = {
                    chainNamespace: CHAIN_NAMESPACES.EIP155,
                    chainId: "0xaa36a7",
                    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
                    displayName: "Ethereum Sepolia Testnet",
                    blockExplorerUrl: "https://sepolia.etherscan.io",
                    ticker: "ETH",
                    tickerName: "Ethereum",
                    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
                };

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

                const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

                const web3auth = new Web3AuthNoModal({
                    clientId: web3auth_clientId,
                    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
                    privateKeyProvider,
                    accountAbstractionProvider,
                    useAAWithExternalWallet: false,
                });

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

                web3auth.configureAdapter(authAdapter);
                setWeb3auth(web3auth);

                await web3auth.init();
                const newProvider = web3auth.provider;
                setProvider(web3auth.provider);

                if (!newProvider) {
                    throw Error('provider not initialized yet');
                }

                const walletClient = createWalletClient({
                    transport: custom(newProvider),
                });

                setWallet(walletClient);

            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);

    const login = async () => {
        if (!web3auth) throw Error("Error: Impossible to log in. Web3Auth is not initialized.");

        const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
            loginProvider: "jwt",
            extraLoginOptions: {
                domain: auth0_domain,
                verifierIdField: "sub",
                connection: "worldcoin",
            },
        });

        setProvider(web3authProvider);
    };

    const getUserInfo = async () => {
        if (!web3auth) throw Error("Error: Impossible to get user information. Web3Auth is not initialized.");
        if (!wallet) throw Error("Error: Impossible to get user information. Wallet is not initialized.");

        const user = await web3auth.getUserInfo();
        console.log('User: ', user);

        const addresses = await wallet.getAddresses();

        const smartAccountAddress = addresses[0];
        const eoaAddress = addresses[1];

        console.log('Addresses: ', addresses)
        console.log('Smart account address: ', smartAccountAddress);
        console.log('EOA address: ', eoaAddress);
    };

    const logout = async () => {
        if (!web3auth) throw Error("Error: Log out impossible. Web3Auth is not even initialized.");
        await web3auth.logout();
        setProvider(null);
    };

    const signMessage = async () => {
        if (!web3auth) throw Error("Error: Impossible to sign a message. Web3Auth is not initialized.");
        if (!provider) throw Error("Error: Impossible to sign a message. Provider is not initialized.");

        const signedMessage = await RPC.signMessage(provider);
        console.log(signedMessage);
    };

    const sendTransaction = async () => {
        if (!web3auth) throw Error("Error: Impossible to sign a message. Web3Auth is not initialized.");
        if (!provider) throw Error("Error: Impossible to sign a message. Provider is not initialized.");

        console.log("Sending Transaction...");
        const transactionReceipt = await RPC.sendTransaction(provider);
        console.log(transactionReceipt);
    };

    return (
        <main>
            <h1>Welcome to AnonMarket</h1>

            {web3auth && <Button color='primary' onClick={() => { login() }} disabled={web3auth.connected}>
                Login
            </Button>}

            {web3auth && <Button color='primary' onClick={() => { getUserInfo() }} disabled={!web3auth.connected}>
                Get user Info
            </Button>}

            {web3auth && <Button color='primary' onClick={() => { logout() }} disabled={!web3auth.connected}>
                Log out
            </Button>}

            {web3auth && <Button color='primary' onClick={() => { signMessage() }} disabled={!web3auth.connected}>
                Sign message
            </Button>}

            {web3auth && <Button color='primary' onClick={() => { sendTransaction() }} disabled={!web3auth.connected}>
                Send transaction
            </Button>}
        </main>
    );
}
