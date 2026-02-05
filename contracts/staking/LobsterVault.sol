// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title LobsterVault
 * @dev Staking contract for $FORGE tokens
 * @notice Stake FORGE, earn rewards from trading fees
 */
contract LobsterVault is ReentrancyGuard, Ownable, Pausable {
    using SafeERC20 for IERC20;

    IERC20 public immutable forgeToken;
    
    // Staking state
    uint256 public totalStaked;
    uint256 public rewardRate; // Rewards per second per token staked (scaled by 1e18)
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    // User state
    struct UserInfo {
        uint256 staked;
        uint256 rewardPerTokenPaid;
        uint256 rewards;
        uint256 stakedAt;
    }
    mapping(address => UserInfo) public userInfo;

    // Configuration
    uint256 public earlyWithdrawPenalty = 1000; // 10% penalty if withdrawn within lock period
    uint256 public lockPeriod = 7 days;
    uint256 public constant PENALTY_DENOMINATOR = 10000;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 penalty);
    event RewardsClaimed(address indexed user, uint256 amount);
    event RewardsAdded(uint256 amount);
    event RewardRateUpdated(uint256 newRate);

    constructor(
        address _forgeToken,
        address _initialOwner
    ) Ownable(_initialOwner) {
        require(_forgeToken != address(0), "Invalid token");
        forgeToken = IERC20(_forgeToken);
    }

    /**
     * @dev Update reward state
     */
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        
        if (account != address(0)) {
            userInfo[account].rewards = earned(account);
            userInfo[account].rewardPerTokenPaid = rewardPerTokenStored;
        }
        _;
    }

    /**
     * @dev Calculate reward per token
     */
    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }
        return rewardPerTokenStored + 
            ((block.timestamp - lastUpdateTime) * rewardRate * 1e18) / totalStaked;
    }

    /**
     * @dev Calculate earned rewards for a user
     */
    function earned(address account) public view returns (uint256) {
        UserInfo storage user = userInfo[account];
        return (user.staked * (rewardPerToken() - user.rewardPerTokenPaid)) / 1e18 + user.rewards;
    }

    /**
     * @dev Stake FORGE tokens
     */
    function stake(uint256 amount) external nonReentrant whenNotPaused updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        
        UserInfo storage user = userInfo[msg.sender];
        user.staked += amount;
        user.stakedAt = block.timestamp;
        totalStaked += amount;

        forgeToken.safeTransferFrom(msg.sender, address(this), amount);
        
        emit Staked(msg.sender, amount);
    }

    /**
     * @dev Withdraw staked tokens
     */
    function withdraw(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        
        UserInfo storage user = userInfo[msg.sender];
        require(user.staked >= amount, "Insufficient balance");
        
        uint256 penalty = 0;
        
        // Apply early withdrawal penalty
        if (block.timestamp < user.stakedAt + lockPeriod) {
            penalty = (amount * earlyWithdrawPenalty) / PENALTY_DENOMINATOR;
        }
        
        user.staked -= amount;
        totalStaked -= amount;
        
        uint256 amountAfterPenalty = amount - penalty;
        forgeToken.safeTransfer(msg.sender, amountAfterPenalty);
        
        // Send penalty to owner (treasury)
        if (penalty > 0) {
            forgeToken.safeTransfer(owner(), penalty);
        }
        
        emit Withdrawn(msg.sender, amountAfterPenalty, penalty);
    }

    /**
     * @dev Claim pending rewards
     */
    function claimRewards() external nonReentrant updateReward(msg.sender) {
        UserInfo storage user = userInfo[msg.sender];
        uint256 reward = user.rewards;
        
        if (reward > 0) {
            user.rewards = 0;
            forgeToken.safeTransfer(msg.sender, reward);
            emit RewardsClaimed(msg.sender, reward);
        }
    }

    /**
     * @dev Add rewards to the pool
     */
    function addRewards(uint256 amount) external onlyOwner updateReward(address(0)) {
        require(amount > 0, "Cannot add 0");
        forgeToken.safeTransferFrom(msg.sender, address(this), amount);
        emit RewardsAdded(amount);
    }

    /**
     * @dev Set reward rate
     */
    function setRewardRate(uint256 _rewardRate) external onlyOwner updateReward(address(0)) {
        rewardRate = _rewardRate;
        emit RewardRateUpdated(_rewardRate);
    }

    /**
     * @dev Set lock period and penalty
     */
    function setLockConfig(uint256 _lockPeriod, uint256 _penalty) external onlyOwner {
        require(_penalty <= 2000, "Penalty too high"); // Max 20%
        lockPeriod = _lockPeriod;
        earlyWithdrawPenalty = _penalty;
    }

    /**
     * @dev Pause staking
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause staking
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency withdraw all (no rewards)
     */
    function emergencyWithdraw() external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        uint256 amount = user.staked;
        require(amount > 0, "Nothing to withdraw");
        
        user.staked = 0;
        user.rewards = 0;
        totalStaked -= amount;
        
        forgeToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount, 0);
    }
}
