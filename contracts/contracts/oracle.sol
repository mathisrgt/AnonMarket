// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

contract OracleMarket {
    IPyth pyth;

    // Counter for automatic market IDs
    uint256 public nextMarketId = 1;

    // Mapping to store market results (0 for Trump, 1 for Harris, 2 for None)
    mapping(uint256 => uint256) public marketResults;

    // Mapping for market information
    mapping(uint256 => Market) public markets;

    // Constant list of price feed IDs
    bytes32[] public priceIds = [
        bytes32(
            0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43
        ), // BTC/USD
        bytes32(
            0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace
        ) // ETH/USD
    ];

    // Structure for market information
    struct Market {
        uint256 id;
        uint256 endTime;
        uint256 priceFeedIndex; // Index in the priceIds array
        uint256 threshold;
        bool marketFinished;
    }

    /**
     * @param pythContract The address of the Pyth contract
     */
    constructor(address pythContract) {
        pyth = IPyth(pythContract);
    }

    /**
     * @notice Creates a predictive market with an automatically assigned ID.
     * @param endTime The end timestamp of the market.
     * @param priceFeedIndex The index of the price feed ID in the priceIds array.
     * @param threshold The threshold for comparison.
     */
    function createMarket(
        uint256 endTime,
        uint256 priceFeedIndex,
        uint256 threshold
    ) public {
        require(priceFeedIndex < priceIds.length, "Invalid price feed index");

        // Create a new market
        markets[nextMarketId] = Market({
            id: nextMarketId,
            endTime: endTime,
            priceFeedIndex: priceFeedIndex,
            threshold: threshold,
            marketFinished: false
        });

        // Increment the market ID for the next market
        nextMarketId++;
    }

    /**
     * @notice Resolves a market based on Pyth data.
     * @param marketId The ID of the market.
     * @param priceUpdate The updated data for Pyth.
     */
    function resolveMarket(uint256 marketId, bytes[] calldata priceUpdate)
        public
        payable
    {
        Market storage market = markets[marketId];
        require(market.id != 0, "Market does not exist");
        require(block.timestamp >= market.endTime, "Market not yet ended");
        require(!market.marketFinished, "Market already resolved");

        // Update prices via Pyth
        uint256 fee = pyth.getUpdateFee(priceUpdate);
        pyth.updatePriceFeeds{value: fee}(priceUpdate);

        // Retrieve the price feed ID using the index
        bytes32 priceFeedId = priceIds[market.priceFeedIndex];

        // Retrieve the price from Pyth
        PythStructs.Price memory price = pyth.getPriceNoOlderThan(
            priceFeedId,
            600
        );

        // Define a fixed scaling factor (e.g., 10^8)
        uint256 scalingFactor = 10**8;

        // Convert the price to a human-readable value
        uint256 readablePrice = uint256(uint64(price.price)) / scalingFactor;

        // Resolve the market (0 for Trump, 1 for Harris, 2 for None)
        if (readablePrice > 0) {
            if (readablePrice > market.threshold) {
                marketResults[marketId] = 1; // Harris
            } else {
                marketResults[marketId] = 0; // Trump
            }
        } else {
            marketResults[marketId] = 2; // None
        }

        // Mark the market as resolved
        market.marketFinished = true;
    }

    /**
     * @notice Reads the result of a market.
     * @param marketId The ID of the market.
     * @return The result of the market (0, 1, or 2).
     */
    function readMarketResult(uint256 marketId) public view returns (uint256) {
        require(markets[marketId].id != 0, "Market does not exist");
        require(markets[marketId].marketFinished, "Market not resolved");
        return marketResults[marketId];
    }

    /**
     * @notice Retrieves the price feed ID by index.
     * @param index The index of the price feed ID.
     * @return The corresponding price feed ID.
     */
    function getPriceFeedId(uint256 index) public view returns (bytes32) {
        require(index < priceIds.length, "Invalid price feed index");
        return priceIds[index];
    }

    /**
     * @notice Checks if a market is finished.
     * @param marketId The ID of the market.
     * @return A boolean indicating if the market is finished.
     */
    function isMarketFinished(uint256 marketId) public view returns (bool) {
        require(markets[marketId].id != 0, "Market does not exist");
        return markets[marketId].marketFinished;
    }
}