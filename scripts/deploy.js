const hre = require("hardhat");

async function main() {
    const Create = await hre.ethers.getContractFactory("Create");
    const create = await Create.deploy();
    await create.waitForDeployment();
    console.log("Contract deployed to:", await create.getAddress());

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
