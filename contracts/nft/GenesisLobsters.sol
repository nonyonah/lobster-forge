// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title GenesisLobsters
 * @dev NFT collection with fully onchain SVG metadata
 * @notice First 1000 lobsters - The OG colony members
 */
contract GenesisLobsters is ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY = 1000;
    uint256 public mintPrice = 0; // Free for early holders
    uint256 private _tokenIdCounter;

    // Trait options
    string[] private shellColors = ["#FF4D4D", "#FF6B6B", "#CC3D3D", "#00D9FF", "#00B8D9", "#9333EA"];
    string[] private clawTypes = ["Standard", "Power", "Pincer", "Ancient", "Cyber", "Diamond"];
    string[] private backgrounds = ["Ocean Deep", "Coral Reef", "Abyss", "Bioluminescent", "Base Blue"];

    // Trait storage
    mapping(uint256 => uint256) private tokenSeeds;

    // Events
    event LobsterMinted(address indexed to, uint256 indexed tokenId, uint256 seed);

    constructor(
        address _initialOwner
    ) ERC721("Genesis Lobsters", "GLOB") Ownable(_initialOwner) {}

    /**
     * @dev Mint a new lobster
     */
    function mint() external payable {
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient payment");

        uint256 tokenId = _tokenIdCounter++;
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId)));
        tokenSeeds[tokenId] = seed;

        _safeMint(msg.sender, tokenId);
        emit LobsterMinted(msg.sender, tokenId, seed);
    }

    /**
     * @dev Owner batch mint for airdrops
     */
    function airdrop(address[] calldata recipients) external onlyOwner {
        for (uint256 i = 0; i < recipients.length; i++) {
            require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");
            
            uint256 tokenId = _tokenIdCounter++;
            uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, recipients[i], tokenId)));
            tokenSeeds[tokenId] = seed;
            
            _safeMint(recipients[i], tokenId);
            emit LobsterMinted(recipients[i], tokenId, seed);
        }
    }

    /**
     * @dev Get traits for a token
     */
    function getTraits(uint256 tokenId) public view returns (
        string memory shellColor,
        string memory clawType,
        string memory background,
        uint256 rarity
    ) {
        require(tokenId < _tokenIdCounter, "Token does not exist");
        uint256 seed = tokenSeeds[tokenId];
        
        shellColor = shellColors[seed % shellColors.length];
        clawType = clawTypes[(seed / 10) % clawTypes.length];
        background = backgrounds[(seed / 100) % backgrounds.length];
        rarity = (seed % 100) + 1; // 1-100 rarity score
    }

    /**
     * @dev Generate SVG for a token
     */
    function generateSVG(uint256 tokenId) public view returns (string memory) {
        (string memory shellColor, string memory clawType, string memory background, uint256 rarity) = getTraits(tokenId);
        
        // Determine background color
        string memory bgColor = "#0A1628"; // Default deep ocean
        if (keccak256(bytes(background)) == keccak256("Coral Reef")) bgColor = "#1A365D";
        else if (keccak256(bytes(background)) == keccak256("Bioluminescent")) bgColor = "#0F2138";
        else if (keccak256(bytes(background)) == keccak256("Base Blue")) bgColor = "#0052FF";

        return string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">',
            '<rect width="400" height="400" fill="', bgColor, '"/>',
            // Lobster body
            '<ellipse cx="200" cy="200" rx="80" ry="50" fill="', shellColor, '"/>',
            // Lobster head
            '<ellipse cx="280" cy="200" rx="40" ry="30" fill="', shellColor, '"/>',
            // Eyes
            '<circle cx="300" cy="185" r="8" fill="white"/><circle cx="300" cy="185" r="4" fill="black"/>',
            '<circle cx="300" cy="215" r="8" fill="white"/><circle cx="300" cy="215" r="4" fill="black"/>',
            // Claws
            '<ellipse cx="120" cy="170" rx="30" ry="15" fill="', shellColor, '" transform="rotate(-30 120 170)"/>',
            '<ellipse cx="120" cy="230" rx="30" ry="15" fill="', shellColor, '" transform="rotate(30 120 230)"/>',
            // Tail
            '<polygon points="200,250 160,300 240,300" fill="', shellColor, '"/>',
            // Rarity badge
            '<text x="20" y="380" fill="white" font-size="14" font-family="monospace">',
            'Genesis Lobster #', tokenId.toString(), ' | Rarity: ', rarity.toString(),
            '</text>',
            '</svg>'
        ));
    }

    /**
     * @dev Return token URI with onchain metadata
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(tokenId < _tokenIdCounter, "Token does not exist");
        
        (string memory shellColor, string memory clawType, string memory background, uint256 rarity) = getTraits(tokenId);
        string memory svg = generateSVG(tokenId);
        string memory svgBase64 = Base64.encode(bytes(svg));
        
        string memory json = string(abi.encodePacked(
            '{"name": "Genesis Lobster #', tokenId.toString(),
            '", "description": "A founding member of the LobsterForge colony. 100% onchain.",',
            '"image": "data:image/svg+xml;base64,', svgBase64, '",',
            '"attributes": [',
            '{"trait_type": "Shell Color", "value": "', shellColor, '"},',
            '{"trait_type": "Claw Type", "value": "', clawType, '"},',
            '{"trait_type": "Background", "value": "', background, '"},',
            '{"trait_type": "Rarity Score", "value": ', rarity.toString(), '}',
            ']}'
        ));
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        ));
    }

    /**
     * @dev Set mint price
     */
    function setMintPrice(uint256 _price) external onlyOwner {
        mintPrice = _price;
    }

    /**
     * @dev Withdraw ETH
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @dev Get current supply
     */
    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter;
    }
}
