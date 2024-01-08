// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract MyERC721 is ERC721Enumerable, Ownable {
    uint256 private _tokenIdCounter;

    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant MINT_PRICE = 0.1 ether;

    constructor(address initialOwner) Ownable(initialOwner) ERC721("Token_ERC721", "TkERC") {}

    function mint() external payable {
        require(totalSupply() < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= MINT_PRICE, "Insufficient funds");

          uint256 tokenId = _tokenIdCounter;
        _safeMint(msg.sender, tokenId);

        _tokenIdCounter += 1;

        // Send any excess funds back to the sender
        if (msg.value > MINT_PRICE) {
            payable(msg.sender).transfer(msg.value - MINT_PRICE);
        }
    }

    function currentSupply() external view returns (uint256) {
        return totalSupply();
    }

}
