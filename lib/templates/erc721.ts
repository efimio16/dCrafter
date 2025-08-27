const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r");

export function erc721Template(
    name: string,
    symbol: string,
    baseURI: string,
    royaltyReceiver: string,
    royaltyFeeNumerator: number,
    maxSupply: number
) {
    const normalizedBaseURI = baseURI.replace(/\/+$/, "");

    if (!Number.isInteger(maxSupply) || maxSupply <= 0) 
        throw new Error('Invalid maxSupply');

    if (!Number.isInteger(royaltyFeeNumerator) || royaltyFeeNumerator < 0 || royaltyFeeNumerator > 10000)
        throw new Error('Invalid royaltyFeeNumerator');

    return `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract CustomNFT is ERC721URIStorage, ERC2981, Ownable, EIP712, ReentrancyGuard {
    using ECDSA for bytes32;

    uint256 public immutable maxSupply;
    uint256 private _totalMinted;

    mapping(uint256 => bool) public redeemedTokens;

    struct NFTVoucher {
        uint256 tokenId;
        address recipient;
        uint256 price; // can be 0 for free mint
        bytes signature;
    }

    constructor() ERC721("${esc(name)}", "${esc(symbol)}") EIP712("${esc(name)}", "1") Ownable(msg.sender) {
        _setDefaultRoyalty(${esc(royaltyReceiver)}, ${royaltyFeeNumerator});
        maxSupply = ${maxSupply};
    }

    /// @notice Redeem a signed voucher to mint NFT
    function redeem(NFTVoucher calldata voucher) public payable nonReentrant {
        require(voucher.recipient == msg.sender, "Not the recipient");
        require(!redeemedTokens[voucher.tokenId], "Token already redeemed");
        require(voucher.tokenId > 0 && voucher.tokenId <= maxSupply, "Invalid tokenId");
        require(_totalMinted < maxSupply, "Max supply reached");
        require(msg.value >= voucher.price, "Insufficient ETH sent");

        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256("NFTVoucher(uint256 tokenId,address recipient,uint256 price)"),
                    voucher.tokenId,
                    voucher.recipient,
                    voucher.price
                )
            )
        );
        address signer = ECDSA.recover(digest, voucher.signature);
        require(signer == owner(), "Invalid or unauthorized signature");

        redeemedTokens[voucher.tokenId] = true;
        _totalMinted++;

        _safeMint(voucher.recipient, voucher.tokenId);
        _setTokenURI(voucher.tokenId, string(abi.encodePacked("${normalizedBaseURI}/", Strings.toString(voucher.tokenId), ".json")));

        // Refund excess ETH
        if(msg.value > voucher.price) {
            (bool success, ) = msg.sender.call{value: msg.value - voucher.price}("");
            require(success, "Refund failed");
        }
    }

    function totalSupply() public view returns (uint256) {
        return _totalMinted;
    }

    function supportsInterface(bytes4 interfaceId) 
        public view override(ERC721URIStorage, ERC2981) returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
}
`;
}
