const { ethers } = require('hardhat');

async function main() {
  const gigContract = await ethers.deployContract('Gig', [
    "ProjectName",
      "ProjectDescriptionProjectDescriptionProjectDescriptionProjectDescriptionProjectDescription",
      "ProjectMetricsProjectMetricsProjectMetricsProjectMetricsProjectMetricsProjectMetricsProjectMetricsProjectDescriptionProjectDescription",
  ]);

  await gigContract.waitForDeployment();

  console.log('Gig Contract Deployed at ' + gigContract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});