import { ethers } from "hardhat";
//import { utils } from "ethers";

async function main() {

    // Deploying ERC20 Claimable Token
    const FPMM = await ethers.getContractFactory("EscrowUSDC");
    const fpmm = await FPMM.deploy("0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", "0xEf4CDea2C56db853Cd69931f1D7fF7C85cb9D73a");
    console.log((fpmm as any).target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
