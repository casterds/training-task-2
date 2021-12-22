// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, upgrades } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the smartcontract to deploy.
  const GiftNFTCard = await ethers.getContractFactory("GiftNFTCard");
  const deployedAddress = process.env.DEPLOYED_ADDRESS;
  if (!deployedAddress) {
    // Deploying the smart contract for the first time.
    const gnftCard = await upgrades.deployProxy(GiftNFTCard);
    await gnftCard.deployed();

    console.log("GiftNFTCard deployed to:", gnftCard.address);
    console.log(
      "Kindly keep the address safe. This is the address to which the smart contract can be upgraded to."
    );
  } else {
    // Upgrading the smart contract.
    await upgrades.upgradeProxy(deployedAddress, GiftNFTCard);
    console.log("GiftNFTCard upgraded to:", deployedAddress);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
