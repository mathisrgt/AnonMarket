import { ethers } from 'ethers';
import { HermesClient } from "@pythnetwork/hermes-client";
import dotenv from 'dotenv'

dotenv.config()

// Load your contract ABI and address
import escrowABI from '../abis/escrowABI.json' assert { type: 'json' };
import ammABI from '../abis/ammABI.json' assert { type: 'json' };
import oracleABI from '../abis/oracleABI.json' assert { type: 'json' };

const oracleContractAddress = '0xYourContractAddressHere'; // Replace with your contract address
const escrowContractAddress = '0xYourContractAddressHere'; // Replace with your contract address
const ammContractAddress = '0xYourContractAddressHere'; // Replace with your contract address

export function withdrawRoutes(app) {

  // Ethereum provider and signer setup
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL); // Replace with your RPC URL
  const privateKey = process.env.PRIVATE_KEY; // Replace with your private key
  const signer = new ethers.Wallet(privateKey, provider);
  const ammContract = new ethers.Contract(ammContractAddress, ammABI, signer);
  const oracleContract = new ethers.Contract(oracleContractAddress, oracleABI, signer);
  const escrowContract = new ethers.Contract(escrowContractAddress, escrowABI, signer);

  // Route to handle the ring signature and transaction submission
  app.post('/swap', async (req, res) => {
    try {
      const {
        message,
        signature,
        inputAmount,
        outcome,
        marketId
      } = req.body;

      // Validate input
      if (!ring || !signerPrivateKey || !message || !signature || !linkabilityFlag) {
        return res.status(400).send('Missing required parameters');
      }

      const keyImage = signature.keyImage; // Derive from your signature logic

      // Interact with the smart contract
      const tx = await ammContract.swap(
        ethers.BigNumber.from(inputAmount), // inputAmount in Wei
        outcome,
        message,
        signature,
        ethers.BigNumber.from(keyImage),
        marketId
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      // Return success response
      res.status(200).send({
        message: 'Transaction successful',
        transactionHash: receipt.transactionHash,
      });
    } catch (error) {
      console.error('Error in /swap route:', error);
      res.status(500).send({ message: 'Transaction failed', error: error.message });
    }
  });

  app.post('/redeem', async (req, res) => {
    try {
      const { marketId, outcome, keyImage, recipient } = req.body;

      // 1. Check if the market is resolved and fetch the winning vote_id
      // Fetch the latest price updates from Pyth
      const connection = new HermesClient("https://hermes.pyth.network", {});

      const priceIds = [
        // You can find the ids of prices at https://pyth.network/developers/price-feed-ids
        "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD price id
        "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43" // BTC/USD price id
      ];

      // Latest price updates
      const priceUpdates = await connection.getLatestPriceUpdates(priceIds);

      // Convert the binary data to proper bytes format with "0x" prefix
      const priceUpdateData = priceUpdates.binary.data.map(data =>
        "0x" + data
      );
      // console.log("priceUpdateData", priceUpdateData);

      const txs = await oracleContract.exampleMethod(priceUpdateData, {
        gasLimit: 1000000,
        value: 1
      });

      const receipts = await txs.wait();

      const marketResult = await oracleContract.readMarketResult(marketId);
      if (marketResult !== outcome) {
        return res.status(400).send('Market outcome does not match provided outcome.');
      }

      // 2. Calculate the user's gain from the AMM contract
      const userGain = await ammContract.calculateUserGain(outcome, keyImage, marketId);
      if (userGain.isZero()) {
        return res.status(400).send('No gains available for the provided outcome.');
      }

      // 3. Create a signed proof
      const message = ethers.utils.solidityKeccak256(
        ['address', 'uint256'],
        [recipient, userGain]
      );
      const signedMessage = await signer.signMessage(ethers.utils.arrayify(message));

      // 4. Interact with the escrow contract to redeem USDC
      const tx = await escrowContract.redeem(signedMessage, recipient, userGain);
      const receipt = await tx.wait();

      // Return success response
      res.status(200).send({
        message: 'Redeem successful',
        transactionHash: receipt.transactionHash,
        amountRedeemed: userGain.toString(),
      });
    } catch (error) {
      console.error('Error in /redeem route:', error);
      res.status(500).send({ message: 'Redemption failed', error: error.message });
    }
  });
}

