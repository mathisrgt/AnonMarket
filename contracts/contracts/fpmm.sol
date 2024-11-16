// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FPMM {
    uint256 public reserveX;
    uint256 public reserveY;
    uint256 public k; // Invariant constant
    address public owner;
    uint256 public creatorFunds;
    uint256 public totalFunds;
    uint256 public userSharesX;
    uint256 public userSharesY;

    event LiquidityAdded(address indexed provider, uint256 amountX, uint256 amountY);
    event LiquidityRemoved(address indexed provider, uint256 amountX, uint256 amountY);
    event Swap(address indexed swapper, string outcome, uint256 inputAmount, uint256 outputAmount);

    constructor(uint256 initialX, uint256 initialY) {
        require(initialX > 0 && initialY > 0, "Initial reserves must be greater than zero");
        reserveX = initialX;
        reserveY = initialY;
        k = reserveX * reserveY; // Set the invariant constant
        owner = msg.sender;
        creatorFunds = initialX + initialY; // Track initial creator funds
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    // Add liquidity to the FPMM
    function addLiquidity(uint256 amountX, uint256 amountY) external onlyOwner {
        reserveX += amountX;
        reserveY += amountY;
        k = reserveX * reserveY; // Update the invariant constant
        creatorFunds += amountX + amountY; // Track only owner-added funds
        emit LiquidityAdded(msg.sender, amountX, amountY);
    }

    // Remove liquidity from the FPMM
    function removeLiquidity(uint256 amountX, uint256 amountY) external onlyOwner {
        require(reserveX >= amountX && reserveY >= amountY, "Insufficient liquidity");
        reserveX -= amountX;
        reserveY -= amountY;
        k = reserveX * reserveY; // Update the invariant constant
        creatorFunds -= amountX + amountY;
        emit LiquidityRemoved(msg.sender, amountX, amountY);
    }

    // Swap function to swap shares of one outcome for another
    function swap(uint256 inputAmount, string memory outcome) external returns (uint256 outputAmount) {
        require(inputAmount > 0, "Input amount must be greater than zero");

        reserveX = reserveX + inputAmount;
        reserveY = reserveY + inputAmount;
        totalFunds += inputAmount; // Track user-contributed funds

        if (keccak256(abi.encodePacked(outcome)) == keccak256(abi.encodePacked("Y"))) {
            uint256 newReserveY = k / reserveX;
            outputAmount = reserveY - newReserveY;
            reserveY = newReserveY;
            userSharesY += outputAmount; // Track shares bought for outcome X
        } else if (keccak256(abi.encodePacked(outcome)) == keccak256(abi.encodePacked("X"))) {
            uint256 newReserveX = k / reserveY;
            outputAmount = reserveX - newReserveX;
            reserveX = newReserveX;
            userSharesX += outputAmount; // Track shares bought for outcome Y
        } else {
            revert("Invalid outcome specified");
        }

        emit Swap(msg.sender, outcome, inputAmount, outputAmount);
        return outputAmount;
    }

    // Calculate the probability (price) for each outcome
    function priceForOutcome(string memory outcome) public view returns (uint256) {
        uint256 totalReserve = reserveX + reserveY;
        if (keccak256(abi.encodePacked(outcome)) == keccak256(abi.encodePacked("X"))) {
            return (reserveY * 1e18) / totalReserve; // Price for X in percentage * 1e18
        } else if (keccak256(abi.encodePacked(outcome)) == keccak256(abi.encodePacked("Y"))) {
            return (reserveX * 1e18) / totalReserve; // Price for Y in percentage * 1e18
        } else {
            revert("Invalid outcome specified");
        }
    }

    // Calculate user gain if an outcome wins
    function calculateUserGain(uint256 outcomeIndex, uint256 userShares) external view returns (uint256 userGain) {
        require(outcomeIndex == 0 || outcomeIndex == 1, "Invalid outcome index");
        
        uint256 payoutPerShare;
        if (outcomeIndex == 0) {
            payoutPerShare = totalFunds * 1e18 / userSharesX; // Amount per share
            userGain = (userShares * payoutPerShare) / 1e18;
        } else {
            payoutPerShare = totalFunds * 1e18 / userSharesY;
            userGain = (userShares * payoutPerShare) / 1e18;
        }
        return userGain;
    }

    // Get reserves (public getter functions)
    function getReserves() external view returns (uint256, uint256) {
        return (reserveX, reserveY);
    }
}
