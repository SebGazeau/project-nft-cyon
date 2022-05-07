// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";

contract NFTs_Collections is Initializable, ERC721URIStorageUpgradeable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct NFT {
        string name;
        string description;
        string tag;
        uint256 price;
        bool favorite;
        bool isAuctionable;
    }
    NFT[] collection;

    function initialize(string memory _name, string memory _symbol)
        public
        initializer
    {
        __ERC721_init(_name, _symbol);
    }

    function MintNFTCollection(
        address _user,
        string memory _tokenURI,
        string memory _name,
        string memory _description,
        string memory _tag,
        uint256 _price,
        bool _favorite,
        bool _isAuctionable
    ) public returns (uint256) {
        _tokenIds.increment();
        collection.push(
            NFT(_name, _description, _tag, _price, _favorite, _isAuctionable)
        );
        uint256 newItemId = _tokenIds.current();
        _mint(_user, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        return newItemId;
    }
}
