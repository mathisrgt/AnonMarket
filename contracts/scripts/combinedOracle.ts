import { ethers } from "hardhat";
//import { utils } from "ethers";

async function main() {

    // Deploying ERC20 Claimable Token
    const FPMM = await ethers.getContractFactory("CombinedOracle");
    const fpmm = await FPMM.deploy("0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43");
    console.log((fpmm as any).target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
