// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract EscrowUSDC {
    IERC20 public usdcToken;
    address public authorizedSigner;

    // Mapping public key smart account, public key created by front for ring signatures
    mapping(address => bytes) public deposits10;
    mapping(address => bytes) public deposits50;
    mapping(address => bytes) public deposits100;

    // Arrays to track all addresses for each mapping
    address[] public depositors10;
    address[] public depositors50;
    address[] public depositors100;

    event Deposited(address indexed sender, uint256 amount);
    event Redeemed(address indexed receiver, uint256 amount);

    constructor(address _usdcToken, address _authorizedSigner) {
        usdcToken = IERC20(_usdcToken);
        authorizedSigner = _authorizedSigner;
    }

    function deposit10(bytes memory publicKey2) external {
        uint256 amount = 1 * 10**6; // USDC uses 6 decimals
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        if (deposits10[msg.sender].length == 0) {
            depositors10.push(msg.sender);
        }
        deposits10[msg.sender] = publicKey2;

        emit Deposited(msg.sender, amount);
    }

    function deposit50(bytes memory publicKey2) external {
        uint256 amount = 50 * 10**6;
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        if (deposits50[msg.sender].length == 0) {
            depositors50.push(msg.sender);
        }
        deposits50[msg.sender] = publicKey2;

        emit Deposited(msg.sender, amount);
    }

    function deposit100(bytes memory publicKey2) external {
        uint256 amount = 100 * 10**6;
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        if (deposits100[msg.sender].length == 0) {
            depositors100.push(msg.sender);
        }
        deposits100[msg.sender] = publicKey2;

        emit Deposited(msg.sender, amount);
    }

    // Withdraw part
    function redeem(bytes memory signedMessage, address recipient, uint256 amount) external {
        bytes32 messageHash = keccak256(abi.encodePacked(recipient, amount));
        address signer = _recoverSigner(messageHash, signedMessage);

        require(signer == authorizedSigner, "Invalid signature");
        require(usdcToken.balanceOf(address(this)) >= amount, "Insufficient contract balance");

        require(usdcToken.transferFrom(address(this), recipient, amount), "Transfer failed");
        emit Redeemed(recipient, amount);
    }

    function _recoverSigner(bytes32 messageHash, bytes memory signedMessage) internal pure returns (address) {
        require(signedMessage.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(signedMessage, 32))
            s := mload(add(signedMessage, 64))
            v := byte(0, mload(add(signedMessage, 96)))
        }

        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    // Reading function to get all depositors and their public keys
    function getDeposits10() external view returns (address[] memory, bytes[] memory) {
        uint256 count = depositors10.length;
        bytes[] memory publicKeys = new bytes[](count);

        for (uint256 i = 0; i < count; i++) {
            publicKeys[i] = deposits10[depositors10[i]];
        }
        return (depositors10, publicKeys);
    }

    function getDeposits50() external view returns (address[] memory, bytes[] memory) {
        uint256 count = depositors50.length;
        bytes[] memory publicKeys = new bytes[](count);

        for (uint256 i = 0; i < count; i++) {
            publicKeys[i] = deposits50[depositors50[i]];
        }
        return (depositors50, publicKeys);
    }

    function getDeposits100() external view returns (address[] memory, bytes[] memory) {
        uint256 count = depositors100.length;
        bytes[] memory publicKeys = new bytes[](count);

        for (uint256 i = 0; i < count; i++) {
            publicKeys[i] = deposits100[depositors100[i]];
        }
        return (depositors100, publicKeys);
    }
}
