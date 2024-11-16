import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || "";
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    rskTestnet: {
      url: "https://rpc.testnet.rootstock.io/sJNoNnADg2VjGzJZ3dYKaHWbLKr4gs-T",
      chainId: 31,
      gasPrice: 60000000,
      accounts: [PRIVATE_KEY],
    },
    zircuit: {
      url: `https://zircuit1-testnet.p2pify.com`,
      accounts: [PRIVATE_KEY]
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // Optional: Add etherscan API key if you want to verify contracts
  },
};

export default config;
