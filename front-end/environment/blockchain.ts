if (process.env.NEXT_PUBLIC_CHAIN_ID === undefined)
    throw new Error('NEXT_PUBLIC_CHAIN_ID is undefined');
export const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;

if (process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID === undefined)
    throw new Error('NEXT_PUBLIC_WEB3AUTH_CLIENT_ID is undefined');
export const web3auth_clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;

if (process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID === undefined)
    throw new Error('NEXT_PUBLIC_AUTH0_CLIENT_ID is undefined');
export const auth0_clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;

if (process.env.NEXT_PUBLIC_AUTH0_DOMAIN === undefined)
    throw new Error('NEXT_PUBLIC_AUTH0_DOMAIN is undefined');
export const auth0_domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;

if (process.env.NEXT_PUBLIC_VERIFIER_NAME === undefined)
    throw new Error('NEXT_PUBLIC_VERIFIER_NAME is undefined');
export const verifier_name = process.env.NEXT_PUBLIC_VERIFIER_NAME;

if (process.env.NEXT_PUBLIC_PIMLINCO_APY_KEY === undefined)
    throw new Error('NEXT_PUBLIC_PIMLINCO_APY_KEY is undefined');
export const pimlicoApiKey = process.env.NEXT_PUBLIC_PIMLINCO_APY_KEY;

if (process.env.NEXT_PUBLIC_RPC_URL === undefined) {
    throw new Error('NEXT_PUBLIC_RPC_URL is undefined');
}
export const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

if (process.env.NEXT_PUBLIC_PRIVATE_KEY === undefined) {
    throw new Error('NEXT_PUBLIC_PRIVATE_KEY is undefined');
}
export const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
