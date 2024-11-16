import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    console.log('Deploying escrow...');

    await deploy('EscrowUSDC', {
        from: deployer,
        args: ["0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", "0xEf4CDea2C56db853Cd69931f1D7fF7C85cb9D73a"],
        log: true,
    });
};

func.tags = ['escrow'];

export default func;
