// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ForgeToken
 * @dev $FORGE - The native token of the LobsterForge ecosystem
 * @notice ERC20 with transfer tax routing to treasury
 */
contract ForgeToken is ERC20, ERC20Burnable, Ownable {
    // Tax configuration
    uint256 public buyTax = 150; // 1.5% = 150 basis points
    uint256 public sellTax = 150;
    uint256 public constant MAX_TAX = 500; // 5% max
    uint256 public constant TAX_DENOMINATOR = 10000;

    // Addresses
    address public treasury;
    address public liquidityPool;

    // Tax exemptions
    mapping(address => bool) public isExempt;

    // Events
    event TaxUpdated(uint256 buyTax, uint256 sellTax);
    event TreasuryUpdated(address indexed newTreasury);
    event ExemptionUpdated(address indexed account, bool exempt);

    constructor(
        address _treasury,
        address _initialOwner
    ) ERC20("LobsterForge", "FORGE") Ownable(_initialOwner) {
        require(_treasury != address(0), "Invalid treasury");
        
        treasury = _treasury;
        
        // Mint 1 billion tokens to owner for initial distribution
        _mint(_initialOwner, 1_000_000_000 * 10 ** decimals());
        
        // Exempt owner and treasury from taxes
        isExempt[_initialOwner] = true;
        isExempt[_treasury] = true;
    }

    /**
     * @dev Override transfer to apply tax
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        // Skip tax for minting, burning, or exempt addresses
        if (from == address(0) || to == address(0) || isExempt[from] || isExempt[to]) {
            super._update(from, to, amount);
            return;
        }

        uint256 taxAmount = 0;
        
        // Determine if buy or sell based on liquidity pool
        if (from == liquidityPool) {
            // Buy
            taxAmount = (amount * buyTax) / TAX_DENOMINATOR;
        } else if (to == liquidityPool) {
            // Sell
            taxAmount = (amount * sellTax) / TAX_DENOMINATOR;
        }

        if (taxAmount > 0) {
            super._update(from, treasury, taxAmount);
            amount -= taxAmount;
        }

        super._update(from, to, amount);
    }

    /**
     * @dev Set liquidity pool address for tax detection
     */
    function setLiquidityPool(address _pool) external onlyOwner {
        require(_pool != address(0), "Invalid pool");
        liquidityPool = _pool;
        isExempt[_pool] = true;
    }

    /**
     * @dev Update tax rates
     */
    function setTaxes(uint256 _buyTax, uint256 _sellTax) external onlyOwner {
        require(_buyTax <= MAX_TAX && _sellTax <= MAX_TAX, "Tax too high");
        buyTax = _buyTax;
        sellTax = _sellTax;
        emit TaxUpdated(_buyTax, _sellTax);
    }

    /**
     * @dev Update treasury address
     */
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury");
        isExempt[treasury] = false;
        treasury = _treasury;
        isExempt[_treasury] = true;
        emit TreasuryUpdated(_treasury);
    }

    /**
     * @dev Set tax exemption for an address
     */
    function setExempt(address account, bool exempt) external onlyOwner {
        isExempt[account] = exempt;
        emit ExemptionUpdated(account, exempt);
    }
}
