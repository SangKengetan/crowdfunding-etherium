const hre = require("hardhat");

async function main() {
  // Deploy the contract
  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");

  const crowdfunding = await CrowdFunding.deploy();

  await crowdfunding.waitForDeployment();

  console.log("CrowdFunding deployed to :", crowdfunding.target);
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
