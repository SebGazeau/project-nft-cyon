// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

/// @title NFTCollections contract
/// @author Sebastien Gazeau, Sébastien Dupertuis et Alexis Mendoza
/// @dev The contract code contains comments for developers only visible in the source code
contract NFTCollections is Initializable, ERC721URIStorageUpgradeable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Structure of the NFT
    struct NFT {
        string name;
        string description;
        string tag;
        address tokenAddress;
        uint256 price;
        bool favorite;
        bool isAuctionable;
    }
    NFT[] collection;

    /// @notice initialization of the ERC271
    /// @param _name name of the collection
    /// @param _symbol symbol of the collection
    function initialize(string memory _name, string memory _symbol)
        public
        initializer
    {
        __ERC721_init(_name, _symbol);
    }

    /// @notice mint from the collection
    /// @param _user NFT and collection user
    /// @param _tokenURI Token
    /// @param _name Description of the NFT
    /// @param _description Description of the NFT
    /// @param _tag Tag of the NFT
    /// @param _tokenAddress address du token
    /// @param _price NFT price
    /// @param _favorite NFT favorite
    /// @param _isAuctionable NFT auctioned
    /// @return newItemId New id of the item that has been minted
    function MintNFTCollection(
        address _user,
        string memory _tokenURI,
        string memory _name,
        string memory _description,
        string memory _tag,
        address _tokenAddress,
        uint256 _price,
        bool _favorite,
        bool _isAuctionable
    ) public returns (uint256) {
        _tokenIds.increment();
        collection.push(
            NFT(
                _name,
                _description,
                _tag,
                _tokenAddress,
                _price,
                _favorite,
                _isAuctionable
            )
        );
        uint256 newItemId = _tokenIds.current();
        _mint(_user, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        return newItemId;
    }
}
