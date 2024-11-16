import { ethers } from "hardhat";
//import { utils } from "ethers";

async function main() {

    // Deploying ERC20 Claimable Token
    console.log("Deploying FPMM...");
    const FPMM = await ethers.getContractFactory("FPMM");
    const fpmm = await FPMM.deploy(1000, 1000);
    console.log(`FPMM deployed at: ${(fpmm as any).target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
