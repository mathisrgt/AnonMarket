// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {FunctionsClient} from "@chainlink/contracts@1.2.0/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts@1.2.0/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts@1.2.0/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {AggregatorV3Interface} from "@chainlink/contracts@1.2.0/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract CombinedOracle is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    // Chainlink Functions variables
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;
    uint32 gasLimit = 300000;
    bytes32 donID =
        0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;
    string public character;
    address router = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0;

    // Price Feed variables
    AggregatorV3Interface internal dataFeed;
    uint256 public nextMarketId = 1;
    mapping(uint256 => uint256) public marketResults;
    mapping(uint256 => Market) public markets;

    bytes32[] public priceIds = [
        bytes32(
            0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43
        ), // BTC/USD
        bytes32(
            0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace
        ) // ETH/USD
    ];

    // Market structure
    struct Market {
        uint256 id;
        uint256 endTime;
        uint256 priceFeedIndex;
        uint256 threshold;
        bool marketFinished;
    }

    // Custom error and events
    error UnexpectedRequestID(bytes32 requestId);
    event Response(
        bytes32 indexed requestId,
        string character,
        bytes response,
        bytes err
    );

    // JavaScript sources for different types of data
    mapping(uint256 => string) private sources;
    string source1 =
        "const query = 'tennis alcaraz match';"
        "const apiResponse = await Functions.makeHttpRequest({"
        "  url: 'https://serpapi.com/search.json',"
        "  params: {"
        "    q: query,"
        "    api_key: 'eaf2c806fedc4eed8f895b9e908f3e4e59fd54095a51a84d4621bd009fd9b476',"
        "  },"
        "});"
        "if (apiResponse.error) {"
        "  throw new Error('Failed to fetch match data from SerpAPI');"
        "}"
        "const { data } = apiResponse;"
        "const sportsResults = data.sports_results?.tables?.games;"
        "if (!sportsResults || sportsResults.length === 0) {"
        "  throw new Error('No sports results found in API response');"
        "}"
        "const latestGame = sportsResults[0];"
        "const players = latestGame.players;"
        "if (!players || players.length !== 2) {"
        "  throw new Error('Invalid player data in the response');"
        "}"
        "const alcaraz = players.find(player => player.name === 'C. Alcaraz');"
        "if (!alcaraz) {"
        "  throw new Error('Carlos Alcaraz data not found');"
        "}"
        "const alcarazSets = Object.values(alcaraz.sets).reduce("
        "  (acc, set) => acc + parseInt(set.split(' ')[0]),"
        "  0"
        ");"
        "const opponent = players.find(player => player.name !== 'C. Alcaraz');"
        "const opponentSets = Object.values(opponent.sets).reduce("
        "  (acc, set) => acc + parseInt(set.split(' ')[0]),"
        "  0"
        ");"
        "const alcarazWon = alcarazSets > opponentSets;"
        "return Functions.encodeString(JSON.stringify(alcarazWon));";

    string source2 =
        "const query = 'football france italy';"
        "const apiResponse = await Functions.makeHttpRequest({"
        "  url: 'https://serpapi.com/search.json',"
        "  params: {"
        "    q: query,"
        "    api_key: 'eaf2c806fedc4eed8f895b9e908f3e4e59fd54095a51a84d4621bd009fd9b476',"
        "  },"
        "});"
        "if (apiResponse.error) {"
        "  throw new Error('Failed to fetch match data from SerpAPI');"
        "}"
        "const { data } = apiResponse;"
        "const sportsResults = data.sports_results;"
        "if (!sportsResults) {"
        "  return Functions.encodeString('0'); // Match not done"
        "}"
        "const gameSpotlight = sportsResults.game_spotlight;"
        "if (!gameSpotlight) {"
        "  return Functions.encodeString('0'); // Match not done"
        "}"
        "const matchStatus = gameSpotlight.status || 'Not Done';"
        "if (matchStatus.toLowerCase() !== 'final') {"
        "  return Functions.encodeString('0'); // Match not done"
        "}"
        "const teams = gameSpotlight.teams;"
        "if (!teams || teams.length !== 2) {"
        "  throw new Error('Invalid team data');"
        "}"
        "const france = teams.find((team) => team.name.toLowerCase() === 'france');"
        "const italy = teams.find((team) => team.name.toLowerCase() === 'italy');"
        "if (!france || !italy) {"
        "  throw new Error('France or Italy data missing');"
        "}"
        "const franceScore = france.score || 0;"
        "const italyScore = italy.score || 0;"
        "let result;"
        "if (franceScore > italyScore) {"
        "  result = 1; // France won"
        "} else if (italyScore > franceScore) {"
        "  result = 2; // Italy won"
        "} else {"
        "  result = 3; // Draw"
        "}"
        "return Functions.encodeString(JSON.stringify(result));";

    /**
     * @notice Initializes the contract with both Chainlink Functions and Price Feed capabilities
     * @param router The address of the Functions router
     * @param aggregatorAddress The address of the price feed aggregator
     */
    constructor(
        address aggregatorAddress
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        dataFeed = AggregatorV3Interface(aggregatorAddress);
        sources[1] = source1;
        sources[2] = source2;
    }

    /**
     * @notice Creates a predictive market
     */
    function createMarket(
        uint256 endTime,
        uint256 priceFeedIndex,
        uint256 threshold
    ) public {
        require(priceFeedIndex < priceIds.length, "Invalid price feed index");

        markets[nextMarketId] = Market({
            id: nextMarketId,
            endTime: endTime,
            priceFeedIndex: priceFeedIndex,
            threshold: threshold,
            marketFinished: false
        });

        nextMarketId++;
    }

    /**
     * @notice Resolves a market based on price feed data
     */
    function resolveMarket(uint256 marketId) public {
        Market storage market = markets[marketId];
        require(market.id != 0, "Market does not exist");
        require(block.timestamp >= market.endTime, "Market not yet ended");
        require(!market.marketFinished, "Market already resolved");

        int256 chainlinkPrice = getChainlinkDataFeedLatestAnswer();
        require(chainlinkPrice >= 0, "Invalid Chainlink price");
        uint256 chainlinkPriceUnsigned = uint256(chainlinkPrice);

        marketResults[marketId] = chainlinkPriceUnsigned > market.threshold
            ? 1
            : 0;
        market.marketFinished = true;
    }

    /**
     * @notice Sends a Functions request for external data
     */
    function sendRequest(
        uint64 subscriptionId,
        uint256 sourceId,
        string[] calldata args
    ) external onlyOwner returns (bytes32 requestId) {
        require(sourceId == 1 || sourceId == 2, "Invalid source ID");

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(sources[sourceId]);
        if (args.length > 0) req.setArgs(args);

        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );

        return s_lastRequestId;
    }

    /**
     * @notice Callback function for fulfilling a request
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }

        s_lastResponse = response;
        character = string(response);
        s_lastError = err;

        emit Response(requestId, character, s_lastResponse, s_lastError);
    }

    /**
     * @notice Reads the result of a market
     */
    function readMarketResult(uint256 marketId) public view returns (uint256) {
        require(markets[marketId].id != 0, "Market does not exist");
        require(markets[marketId].marketFinished, "Market not resolved");
        return marketResults[marketId];
    }

    /**
     * @notice Gets a price feed ID by index
     */
    function getPriceFeedId(uint256 index) public view returns (bytes32) {
        require(index < priceIds.length, "Invalid price feed index");
        return priceIds[index];
    }

    /**
     * @notice Gets the latest price feed answer
     */
    function getChainlinkDataFeedLatestAnswer() public view returns (int256) {
        (
            ,
            /* uint80 roundID */ int answer /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/,
            ,
            ,

        ) = dataFeed.latestRoundData();
        return answer;
    }
}
