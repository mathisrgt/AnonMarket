import { ethers } from "hardhat";
//import { utils } from "ethers";

async function main() {

    // Deploying ERC20 Claimable Token
    const FPMM = await ethers.getContractFactory("OracleMarket");
    const fpmm = await FPMM.deploy("0xDd24F84d36BF92C65F92307595335bdFab5Bbd21");
    console.log((fpmm as any).target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
