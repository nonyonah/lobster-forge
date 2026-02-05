/**
 * LobsterForge Deployment Script
 * Deploys all core contracts to Base
 */

import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("\n🦞 LobsterForge Deployment Starting...");
    console.log("=".repeat(50));
    console.log(`Deployer: ${deployer.address}`);
    console.log(`Balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH`);
    console.log("=".repeat(50) + "\n");

    // 1. Deploy ForgeToken
    console.log("📦 Deploying ForgeToken...");
    const ForgeToken = await ethers.getContractFactory("ForgeToken");
    const forgeToken = await ForgeToken.deploy(
        deployer.address, // Treasury (initially deployer)
        deployer.address  // Owner
    );
    await forgeToken.waitForDeployment();
    const forgeAddress = await forgeToken.getAddress();
    console.log(`✅ ForgeToken deployed: ${forgeAddress}`);

    // 2. Deploy LobsterVault
    console.log("\n📦 Deploying LobsterVault...");
    const LobsterVault = await ethers.getContractFactory("LobsterVault");
    const lobsterVault = await LobsterVault.deploy(
        forgeAddress,     // ForgeToken address
        deployer.address  // Owner
    );
    await lobsterVault.waitForDeployment();
    const vaultAddress = await lobsterVault.getAddress();
    console.log(`✅ LobsterVault deployed: ${vaultAddress}`);

    // 3. Deploy GenesisLobsters NFT
    console.log("\n📦 Deploying GenesisLobsters...");
    const GenesisLobsters = await ethers.getContractFactory("GenesisLobsters");
    const genesisLobsters = await GenesisLobsters.deploy(deployer.address);
    await genesisLobsters.waitForDeployment();
    const nftAddress = await genesisLobsters.getAddress();
    console.log(`✅ GenesisLobsters deployed: ${nftAddress}`);

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("🦞 DEPLOYMENT COMPLETE");
    console.log("=".repeat(50));
    console.log(`
Contract Addresses (add to .env):

FORGE_TOKEN_ADDRESS=${forgeAddress}
LOBSTER_VAULT_ADDRESS=${vaultAddress}
GENESIS_LOBSTERS_ADDRESS=${nftAddress}
TREASURY_ADDRESS=${deployer.address}
  `);

    // Basescan verification commands
    console.log("Verification Commands:");
    console.log(`npx hardhat verify --network baseSepolia ${forgeAddress} ${deployer.address} ${deployer.address}`);
    console.log(`npx hardhat verify --network baseSepolia ${vaultAddress} ${forgeAddress} ${deployer.address}`);
    console.log(`npx hardhat verify --network baseSepolia ${nftAddress} ${deployer.address}`);

    console.log("\n🦞 The blockchain is your ocean. Go forth and evolve! 🌊\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
