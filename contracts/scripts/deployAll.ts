import { execSync } from "child_process";

async function main() {
    const chains = ["worldChain"];
    const scripts = new Map<string, any[]>([
      ["escrow", ["0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", "0xEf4CDea2C56db853Cd69931f1D7fF7C85cb9D73a"]],
      ["fpmm", []],
      ["oracle", ["0xDd24F84d36BF92C65F92307595335bdFab5Bbd21"]],
      ["combinedOracle", ["0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43"]]
    ]);
    for (const chainName of chains) {
      for (const [scriptName, args] of scripts.entries()){
        try {
            const deployCommand = `npx hardhat run scripts/${scriptName}.ts --network ${chainName}  `;
            console.log(`Deploying ${scriptName}...`);
            const deployOutput = await execSync(deployCommand, { encoding: "utf-8" }).trim();
            console.log(`${scriptName} deployed at:`, deployOutput);
            setTimeout(() => {}, 39000);
            const verifyCommand = `npx hardhat verify --network ${chainName} ${deployOutput} ${args.join(" ")}`;
            const verifyOutput = await execSync(verifyCommand, { encoding: "utf-8" });
            console.log("Command Output:", verifyOutput);
        } catch (error) {
          console.error(`Error deploying on ${chainName}:`, error);
        }
      }
    }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});