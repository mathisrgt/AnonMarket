import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    console.log('Deploying FPMM...');

    await deploy('FPMM', {
        from: deployer,
        args: [],
        log: true,
    });
};

func.tags = ['fpmm'];

export default func;
