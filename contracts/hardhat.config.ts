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
    linea_sepolia: {
      url: `https://rpc.sepolia.linea.build/`,
      accounts: [PRIVATE_KEY],
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
    chiliz_spicy: {
      url: 'https://spicy-rpc.chiliz.com',
      accounts: [PRIVATE_KEY]
    },
    scrollSepolia: {
      url: 'https://sepolia-rpc.scroll.io',
      accounts: [PRIVATE_KEY]
    },
    baseSepolia: {
     url: "https://sepolia.base.org",
     accounts: [PRIVATE_KEY],
     gasPrice: 1000000000,
   }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY, // Optional: Add etherscan API key if you want to verify contracts
      zircuit: process.env.ZIRCUIT_VERIFY_API_KEY,
      chiliz_spicy: "PLACEHOLDER",
      rskTestnet: 'RSK_TESTNET_RPC_URL',
      scrollSepolia: process.env.SCROLLSCAN_API_KEY,
      linea_sepolia: process.env.LINEASCAN_API_KEY,
      baseSepolia: process.env.BASESCAN_API_KEY,
    },
    customChains: [
      {
        network: "linea_sepolia",
        chainId: 59141,
        urls: {
          apiURL: "https://api-sepolia.lineascan.build/api",
          browserURL: "https://sepolia.lineascan.build/address"
        }
      },
      {
        network: 'zircuit',
        chainId: 48899,
        urls: {
          apiURL: 'https://explorer.testnet.zircuit.com/api/contractVerifyHardhat',
          browserURL: 'https://explorer.testnet.zircuit.com/',
        },
      },
      {
        network: "baseSepolia",
        chainId: 84531, // Replace with the correct chain ID for Base Sepolia
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api", // Replace with the correct API URL
          browserURL: "https://sepolia.basescan.org", // Replace with the correct browser URL
        }
      },
      {
        network: "chiliz_spicy",
        chainId: 88882,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/testnet/evm/88882/etherscan",
          browserURL: "https://testnet.chiliscan.com"
        }
      },
      {
        network: "rskTestnet",
        chainId: 31,
        urls: {
          apiURL: "https://rootstock-testnet.blockscout.com/api/",
          browserURL: "https://rootstock-testnet.blockscout.com/",
        }
      },
      {
        network: 'scrollSepolia',
        chainId: 534351,
        urls: {
          apiURL: 'https://api-sepolia.scrollscan.com/api',
          browserURL: 'https://sepolia.scrollscan.com/',
        },
      }
    ]
  },
};

export default config;
