/**
 * Frontend Builder Skill
 * React component generation and Vercel deployment
 */

import * as fs from "fs";
import * as path from "path";

const VERCEL_API_BASE = "https://api.vercel.com";

export interface ComponentConfig {
  name: string;
  type: "page" | "component";
  props?: Record<string, string>;
  contractAddress?: `0x${string}`;
  hooks?: string[];
}

export interface DeploymentResult {
  id: string;
  url: string;
  readyState: string;
  createdAt: string;
}

export interface ComponentTemplate {
  name: string;
  code: string;
  styles?: string;
}

export class FrontendBuilder {
  private vercelToken: string;
  private projectId: string;
  private frontendPath: string;

  constructor(
    vercelToken: string,
    projectId: string,
    frontendPath: string
  ) {
    this.vercelToken = vercelToken;
    this.projectId = projectId;
    this.frontendPath = frontendPath;

    console.log("🦞 Frontend Builder initialized");
  }

  /**
   * Generate a React component from template
   */
  generateComponent(config: ComponentConfig): ComponentTemplate {
    console.log(`🦞 Generating component: ${config.name}`);

    let code = "";

    switch (config.name) {
      case "StakingInterface":
        code = this.generateStakingInterface(config);
        break;
      case "NFTMintButton":
        code = this.generateNFTMintButton(config);
        break;
      case "TreasuryDisplay":
        code = this.generateTreasuryDisplay(config);
        break;
      case "ProposalVoting":
        code = this.generateProposalVoting(config);
        break;
      default:
        code = this.generateGenericComponent(config);
    }

    return { name: config.name, code };
  }

  /**
   * Generate staking interface component
   */
  private generateStakingInterface(config: ComponentConfig): string {
    return `"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseEther, formatEther } from "viem";

const VAULT_ADDRESS = "${config.contractAddress || "0x..."}";
const VAULT_ABI = [
  { name: "stake", type: "function", inputs: [{ type: "uint256" }] },
  { name: "withdraw", type: "function", inputs: [{ type: "uint256" }] },
  { name: "claimRewards", type: "function", inputs: [] },
  { name: "userInfo", type: "function", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }, { type: "uint256" }, { type: "uint256" }, { type: "uint256" }] },
] as const;

export default function StakingInterface() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("");

  const { data: userInfo } = useReadContract({
    address: VAULT_ADDRESS as \`0x\${string}\`,
    abi: VAULT_ABI,
    functionName: "userInfo",
    args: address ? [address] : undefined,
  });

  const { writeContract: stake, isPending: isStaking } = useWriteContract();
  const { writeContract: withdraw, isPending: isWithdrawing } = useWriteContract();
  const { writeContract: claim, isPending: isClaiming } = useWriteContract();

  const handleStake = () => {
    if (!amount) return;
    stake({
      address: VAULT_ADDRESS as \`0x\${string}\`,
      abi: VAULT_ABI,
      functionName: "stake",
      args: [parseEther(amount)],
    });
  };

  if (!isConnected) {
    return (
      <div className="card text-center py-8">
        <p className="text-pearl-dim">Connect wallet to stake</p>
      </div>
    );
  }

  const stakedAmount = userInfo?.[0] ? formatEther(userInfo[0]) : "0";
  const rewards = userInfo?.[2] ? formatEther(userInfo[2]) : "0";

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4">Stake $FORGE</h3>
      
      <div className="mb-4">
        <p className="metric-label">Your Staked Balance</p>
        <p className="metric-value">{parseFloat(stakedAmount).toFixed(2)} FORGE</p>
      </div>

      <div className="mb-4">
        <p className="metric-label">Claimable Rewards</p>
        <p className="metric-value text-lobster-primary">{parseFloat(rewards).toFixed(4)} FORGE</p>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="flex-1 bg-ocean-surface border border-white/10 rounded-lg px-4 py-2 text-pearl"
        />
        <button
          onClick={handleStake}
          disabled={isStaking}
          className="btn-primary"
        >
          {isStaking ? "Staking..." : "Stake"}
        </button>
      </div>

      <button
        onClick={() => claim({
          address: VAULT_ADDRESS as \`0x\${string}\`,
          abi: VAULT_ABI,
          functionName: "claimRewards",
        })}
        disabled={isClaiming || parseFloat(rewards) === 0}
        className="btn-secondary w-full"
      >
        {isClaiming ? "Claiming..." : "Claim Rewards"}
      </button>
    </div>
  );
}`;
  }

  /**
   * Generate NFT mint button component
   */
  private generateNFTMintButton(config: ComponentConfig): string {
    return `"use client";

import { useAccount, useWriteContract, useReadContract } from "wagmi";

const NFT_ADDRESS = "${config.contractAddress || "0x..."}";
const NFT_ABI = [
  { name: "mint", type: "function", inputs: [], outputs: [] },
  { name: "totalMinted", type: "function", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "MAX_SUPPLY", type: "function", inputs: [], outputs: [{ type: "uint256" }] },
] as const;

export default function NFTMintButton() {
  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const { data: totalMinted } = useReadContract({
    address: NFT_ADDRESS as \`0x\${string}\`,
    abi: NFT_ABI,
    functionName: "totalMinted",
  });

  const { data: maxSupply } = useReadContract({
    address: NFT_ADDRESS as \`0x\${string}\`,
    abi: NFT_ABI,
    functionName: "MAX_SUPPLY",
  });

  const minted = Number(totalMinted || 0);
  const max = Number(maxSupply || 1000);
  const soldOut = minted >= max;

  const handleMint = () => {
    writeContract({
      address: NFT_ADDRESS as \`0x\${string}\`,
      abi: NFT_ABI,
      functionName: "mint",
    });
  };

  return (
    <div className="card text-center">
      <h3 className="text-xl font-bold mb-2">Genesis Lobsters</h3>
      <p className="text-pearl-dim mb-4">{minted}/{max} minted</p>
      
      <div className="progress-bar mb-4">
        <div 
          className="progress-fill" 
          style={{ width: \`\${(minted/max)*100}%\` }}
        />
      </div>

      <button
        onClick={handleMint}
        disabled={!isConnected || isPending || soldOut}
        className="btn-primary w-full"
      >
        {soldOut ? "Sold Out" : isPending ? "Minting..." : "Mint (Free)"}
      </button>
    </div>
  );
}`;
  }

  /**
   * Generate treasury display component
   */
  private generateTreasuryDisplay(config: ComponentConfig): string {
    return `"use client";

import { useBalance } from "wagmi";
import { formatEther } from "viem";

const TREASURY_ADDRESS = "${config.contractAddress || "0x..."}";

export default function TreasuryDisplay() {
  const { data: balance } = useBalance({
    address: TREASURY_ADDRESS as \`0x\${string}\`,
  });

  const ethBalance = balance ? parseFloat(formatEther(balance.value)).toFixed(4) : "0";

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-2">Treasury</h3>
      <div className="metric-value">{ethBalance} ETH</div>
      <a
        href={\`https://basescan.org/address/\${TREASURY_ADDRESS}\`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-bioluminescent text-sm hover:underline"
      >
        View on Basescan →
      </a>
    </div>
  );
}`;
  }

  /**
   * Generate proposal voting component
   */
  private generateProposalVoting(config: ComponentConfig): string {
    return `"use client";

import { useState } from "react";

interface Proposal {
  id: string;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  status: "active" | "passed" | "rejected";
}

const mockProposals: Proposal[] = [
  {
    id: "1",
    title: "Add FORGE/USDC pool on Aerodrome",
    description: "Create additional liquidity pool for stablecoin trading",
    votesFor: 45,
    votesAgainst: 12,
    status: "active",
  },
];

export default function ProposalVoting() {
  const [selectedVote, setSelectedVote] = useState<Record<string, "for" | "against">>({});

  return (
    <div className="space-y-4">
      {mockProposals.map((proposal) => (
        <div key={proposal.id} className="card">
          <h4 className="font-bold mb-2">{proposal.title}</h4>
          <p className="text-pearl-dim text-sm mb-4">{proposal.description}</p>
          
          <div className="flex justify-between mb-2">
            <span className="text-green-400">For: {proposal.votesFor}</span>
            <span className="text-red-400">Against: {proposal.votesAgainst}</span>
          </div>
          
          <div className="progress-bar mb-4">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ 
                width: \`\${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%\` 
              }}
            />
          </div>
          
          <div className="flex gap-2">
            <button className="btn-primary flex-1">Vote For</button>
            <button className="btn-secondary flex-1">Vote Against</button>
          </div>
        </div>
      ))}
    </div>
  );
}`;
  }

  /**
   * Generate generic component
   */
  private generateGenericComponent(config: ComponentConfig): string {
    const propsInterface = config.props
      ? Object.entries(config.props)
        .map(([key, type]) => `  ${key}: ${type};`)
        .join("\n")
      : "";

    return `"use client";

${propsInterface ? `interface ${config.name}Props {\n${propsInterface}\n}\n` : ""}
export default function ${config.name}(${propsInterface ? `props: ${config.name}Props` : ""}) {
  return (
    <div className="card">
      <h3 className="text-xl font-bold">${config.name}</h3>
      {/* Component content */}
    </div>
  );
}`;
  }

  /**
   * Write component to file
   */
  writeComponent(template: ComponentTemplate, subdir = "components"): string {
    const filePath = path.join(
      this.frontendPath,
      subdir,
      `${template.name}.tsx`
    );

    fs.writeFileSync(filePath, template.code);
    console.log(`✅ Component written: ${filePath}`);

    return filePath;
  }

  /**
   * Trigger Vercel deployment
   */
  async deploy(): Promise<DeploymentResult | null> {
    if (!this.vercelToken) {
      console.log("[DRY RUN] Would trigger Vercel deployment");
      return null;
    }

    try {
      const response = await fetch(
        `${VERCEL_API_BASE}/v13/deployments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.vercelToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "lobsterforge",
            project: this.projectId,
            target: "production",
          }),
        }
      );

      const data = await response.json() as any;

      if (data.id) {
        console.log(`✅ Deployment triggered: ${data.url}`);
        return {
          id: data.id,
          url: data.url,
          readyState: data.readyState,
          createdAt: data.createdAt,
        };
      }

      console.error("Deployment failed:", data);
      return null;
    } catch (error) {
      console.error("Vercel API error:", error);
      return null;
    }
  }

  /**
   * Check deployment status
   */
  async getDeploymentStatus(deploymentId: string): Promise<string> {
    if (!this.vercelToken) return "unknown";

    try {
      const response = await fetch(
        `${VERCEL_API_BASE}/v13/deployments/${deploymentId}`,
        {
          headers: {
            Authorization: `Bearer ${this.vercelToken}`,
          },
        }
      );

      const data = await response.json();
      return data.readyState || "unknown";
    } catch (error) {
      return "error";
    }
  }

  /**
   * Generate deployment announcement
   */
  generateDeploymentPost(url: string, components: string[]): string {
    return `🦞 FRONTEND EVOLVED

New components deployed:
${components.map((c) => `• ${c}`).join("\n")}

Live at: ${url}

The colony interface grows. ⚡`;
  }
}
