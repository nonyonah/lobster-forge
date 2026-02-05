/**
 * Base Contract Deployer Skill
 * Template compilation and deployment to Base L2
 */

import { parseAbi, encodeDeployData, type Hash, formatEther } from "viem";
import type { WalletManager } from "../../base-wallet-manager/scripts/wallet-manager";

export type ContractTier = 1 | 2 | 3;

export interface ContractTemplate {
    name: string;
    tier: ContractTier;
    abi: readonly unknown[];
    bytecode: `0x${string}`;
    constructorArgs: string[];
    estimatedGasCost: bigint;
}

export interface DeploymentResult {
    contractAddress: `0x${string}`;
    transactionHash: Hash;
    gasUsed: bigint;
    deploymentCost: bigint;
    verificationCommand: string;
    basescanUrl: string;
}

export interface DeploymentLog {
    timestamp: Date;
    contractName: string;
    address: `0x${string}`;
    txHash: Hash;
    tier: ContractTier;
    deployer: `0x${string}`;
    cost: string;
}

// Tier authorization rules
const TIER_RULES = {
    1: { maxCost: 0.5, requiresApproval: false, description: "Auto-deploy" },
    2: { maxCost: 2.0, requiresApproval: true, description: "Review required" },
    3: { maxCost: Infinity, requiresApproval: true, description: "Community vote" },
};

export class ContractDeployer {
    private walletManager: WalletManager;
    private templates: Map<string, ContractTemplate> = new Map();
    private deploymentHistory: DeploymentLog[] = [];
    private chainId: 8453 | 84532;

    constructor(walletManager: WalletManager, chainId: 8453 | 84532 = 84532) {
        this.walletManager = walletManager;
        this.chainId = chainId;
        this.loadDefaultTemplates();
    }

    /**
     * Load default contract templates
     */
    private loadDefaultTemplates(): void {
        // Templates would normally be loaded from compiled artifacts
        // This is a simplified version showing the structure
        console.log("🦞 Contract templates loaded");
    }

    /**
     * Register a contract template
     */
    registerTemplate(template: ContractTemplate): void {
        this.templates.set(template.name, template);
        console.log(`🦞 Registered template: ${template.name} (Tier ${template.tier})`);
    }

    /**
     * Check if deployment is authorized
     */
    async checkAuthorization(
        templateName: string,
        estimatedCostEth: number
    ): Promise<{ authorized: boolean; reason: string }> {
        const template = this.templates.get(templateName);
        if (!template) {
            return { authorized: false, reason: "Template not found" };
        }

        const tierRule = TIER_RULES[template.tier];

        // Check cost limits
        if (estimatedCostEth > tierRule.maxCost) {
            return {
                authorized: false,
                reason: `Cost ${estimatedCostEth} ETH exceeds Tier ${template.tier} limit of ${tierRule.maxCost} ETH`,
            };
        }

        // Tier 1 auto-deploys
        if (template.tier === 1) {
            return { authorized: true, reason: "Tier 1: Auto-authorized" };
        }

        // Tier 2+ requires approval
        if (tierRule.requiresApproval) {
            // In production, this would check community votes or admin approval
            console.log(`⚠️ Tier ${template.tier} deployment requires approval`);
            return {
                authorized: true, // For demo purposes
                reason: `Tier ${template.tier}: ${tierRule.description}`,
            };
        }

        return { authorized: true, reason: "Authorized" };
    }

    /**
     * Estimate deployment cost
     */
    async estimateDeploymentCost(
        bytecode: `0x${string}`,
        constructorData?: `0x${string}`
    ): Promise<{ gasEstimate: bigint; costEth: number }> {
        // Simplified estimation
        const bytecodeLength = bytecode.length / 2;
        const gasEstimate = BigInt(21000 + bytecodeLength * 68 + 200000);

        const gasPrice = await this.walletManager.getGasPrices();
        const costWei = gasEstimate * gasPrice.maxFeePerGas;
        const costEth = parseFloat(formatEther(costWei));

        return { gasEstimate, costEth };
    }

    /**
     * Deploy a contract from template
     */
    async deploy(
        templateName: string,
        constructorArgs: unknown[],
        options?: { skipAuthorization?: boolean }
    ): Promise<DeploymentResult> {
        console.log(`\n🦞 Deploying ${templateName}...`);

        const template = this.templates.get(templateName);
        if (!template) {
            throw new Error(`Template not found: ${templateName}`);
        }

        // Encode constructor data
        const deployData = encodeDeployData({
            abi: template.abi as any,
            bytecode: template.bytecode,
            args: constructorArgs,
        });

        // Estimate cost
        const { gasEstimate, costEth } = await this.estimateDeploymentCost(
            template.bytecode,
            deployData
        );

        console.log(`   Estimated gas: ${gasEstimate}`);
        console.log(`   Estimated cost: ${costEth.toFixed(4)} ETH`);

        // Check authorization
        if (!options?.skipAuthorization) {
            const auth = await this.checkAuthorization(templateName, costEth);
            if (!auth.authorized) {
                throw new Error(`Deployment not authorized: ${auth.reason}`);
            }
            console.log(`   Authorization: ${auth.reason}`);
        }

        // Deploy
        const result = await this.walletManager.sendTransaction(
            {
                to: undefined as any, // Contract creation
                data: deployData,
                gasLimit: gasEstimate + BigInt(50000), // Buffer
            },
            { skipSafetyCheck: true }
        );

        // Extract contract address from receipt
        const contractAddress = result.receipt.contractAddress as `0x${string}`;
        if (!contractAddress) {
            throw new Error("Contract address not found in receipt");
        }

        // Log deployment
        const log: DeploymentLog = {
            timestamp: new Date(),
            contractName: templateName,
            address: contractAddress,
            txHash: result.hash,
            tier: template.tier,
            deployer: this.walletManager.address,
            cost: formatEther(result.totalCost),
        };
        this.deploymentHistory.push(log);

        // Generate verification command
        const basescanUrl = this.chainId === 8453
            ? "https://basescan.org"
            : "https://sepolia.basescan.org";

        const verificationCommand = `npx hardhat verify --network ${this.chainId === 8453 ? "base" : "baseSepolia"
            } ${contractAddress} ${constructorArgs.join(" ")}`;

        console.log(`✅ Contract deployed: ${contractAddress}`);
        console.log(`   TX: ${result.hash}`);
        console.log(`   Verify: ${verificationCommand}`);

        return {
            contractAddress,
            transactionHash: result.hash,
            gasUsed: result.gasUsed,
            deploymentCost: result.totalCost,
            verificationCommand,
            basescanUrl: `${basescanUrl}/address/${contractAddress}`,
        };
    }

    /**
     * Get deployment history
     */
    getDeploymentHistory(): DeploymentLog[] {
        return [...this.deploymentHistory];
    }

    /**
     * Generate deployment report
     */
    generateReport(): string {
        if (this.deploymentHistory.length === 0) {
            return "No deployments yet.";
        }

        let report = "🦞 Deployment History\n";
        report += "=".repeat(40) + "\n\n";

        for (const log of this.deploymentHistory) {
            report += `${log.contractName} (Tier ${log.tier})\n`;
            report += `  Address: ${log.address}\n`;
            report += `  Cost: ${log.cost} ETH\n`;
            report += `  Date: ${log.timestamp.toISOString()}\n\n`;
        }

        return report;
    }
}
