// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FPMM {
    uint256 public constant MAX_SPENDING_LIMIT = 10; // 10 USDC

    address public owner;
    mapping(uint256 => Market) public markets; // Store market data by market_id (changed to uint256)
    mapping(uint256 => mapping(uint256 => mapping(uint256 => uint256))) public userShares; // Changed marketId to uint256

    mapping(uint256 => uint256) public totalSpent; // Track total funds spent by each key_image

    event LiquidityAdded(address indexed provider, uint256 amountX, uint256 amountY, uint256 indexed marketId);
    event LiquidityRemoved(address indexed provider, uint256 amountX, uint256 amountY, uint256 indexed marketId);
    event Swap(address indexed swapper, uint256 outcome, uint256 inputAmount, uint256 outputAmount, uint256 indexed marketId);

    struct Market {
        uint256 reserveX;
        uint256 reserveY;
        uint256 k; // Invariant constant
        uint256 totalFunds;
        uint256 totalSharesX;
        uint256 totalSharesY;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addLiquidity(uint256 amountX, uint256 amountY, uint256 marketId) external onlyOwner {
        Market storage market = markets[marketId];
        require(amountX > 0 && amountY > 0, "Amount must be greater than zero");
        
        market.reserveX += amountX;
        market.reserveY += amountY;
        market.k = market.reserveX * market.reserveY;

        emit LiquidityAdded(msg.sender, amountX, amountY, marketId);
    }

    function removeLiquidity(uint256 amountX, uint256 amountY, uint256 marketId) external onlyOwner {
        Market storage market = markets[marketId];
        require(market.reserveX >= amountX && market.reserveY >= amountY, "Insufficient liquidity");

        market.reserveX -= amountX;
        market.reserveY -= amountY;
        market.k = market.reserveX * market.reserveY;

        emit LiquidityRemoved(msg.sender, amountX, amountY, marketId);
    }

    function verifyRingSignature(string memory message, uint256 keyImage) internal pure returns (bool) {
        // Implement actual ring signature verification here
        return true;
    }

    function swap(
        uint256 inputAmount,
        uint256 outcome,
        string memory message,
        uint256 keyImage,
        uint256 marketId
    ) external returns (uint256 outputAmount) {
        Market storage market = markets[marketId];
        require(inputAmount > 0, "Input amount must be greater than zero");
        require(verifyRingSignature(message, keyImage), "Invalid ring signature");

        market.reserveX += inputAmount;
        market.reserveY += inputAmount;
        market.totalFunds += inputAmount;

        uint256 currentSpent = totalSpent[keyImage];
        require(currentSpent + inputAmount <= MAX_SPENDING_LIMIT, "Spending limit exceeded");

        totalSpent[keyImage] = currentSpent + inputAmount;

        if (outcome == 1) {
            uint256 newReserveY = market.k / market.reserveX; 
            outputAmount = market.reserveY - newReserveY; 
            market.reserveY = newReserveY;
            market.totalSharesY += outputAmount;
        } else if (outcome == 0) {
            uint256 newReserveX = market.k / market.reserveY; 
            outputAmount = market.reserveX - newReserveX; 
            market.reserveX = newReserveX;
            market.totalSharesX += outputAmount;
        } else {
            revert("Invalid outcome specified");
        }

        userShares[marketId][keyImage][outcome] += outputAmount;



        emit Swap(msg.sender, outcome, inputAmount, outputAmount, marketId);
        return outputAmount;
    }

    function priceForOutcome(uint256 outcome, uint256 marketId) public view returns (uint256) {
        Market storage market = markets[marketId];
        uint256 totalReserve = market.reserveX + market.reserveY;
        if (outcome == 0) {
            return (market.reserveY * 1e18) / totalReserve;
        } else if (outcome == 1) {
            return (market.reserveX * 1e18) / totalReserve;
        } else {
            revert("Invalid outcome specified");
        }
    }

    function calculateUserGain(uint256 outcome, uint256 keyImage, uint256 marketId) external view returns (uint256 userGain) {
        uint256 shares = userShares[marketId][keyImage][outcome];
        require(shares > 0, "User has no shares for this outcome");

        Market storage market = markets[marketId];

        uint256 payoutPerShare;
        if (outcome == 0) {
            payoutPerShare = market.totalFunds * 1e18 / market.totalSharesX; // Amount per share
            userGain = (shares * payoutPerShare) / 1e18;
        } else {
            payoutPerShare = market.totalFunds * 1e18 / market.totalSharesY;
            userGain = (shares * payoutPerShare) / 1e18;
        }
        return userGain;
    }

    function getReserves(uint256 marketId) external view returns (uint256, uint256) {
        Market storage market = markets[marketId];
        return (market.reserveX, market.reserveY);
    }

    function getTotalSpent(uint256 keyImage) external view returns (uint256) {
        return totalSpent[keyImage];
    }

    function getUserShares(
        uint256 marketId,
        uint256 keyImage,
        uint256 outcome
    ) external view returns (uint256) {
        return userShares[marketId][keyImage][outcome];
    }
}
