// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

//import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
//import "../node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
//import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

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

    /// @notice event for NFT creation
    /// @param _collectionName Name of the NFT collection
    /// @param _tokenID The ID of this given NFT
    /// @param _collectionData Data of the given NFT
    /// @param _timestamp Timestamp of the creation
    /// @param _creator The address of the creator of the NFT
    /// @param _firstOwner The first owner at the mint
    event NFTCreated(
        string _collectionName,
        uint256 _tokenID,
        NFT _collectionData,
        address _creator,
        address _firstOwner
    );

    /// @notice initialization of the ERC271
    /// @param _name name of the collection
    /// @param _symbol symbol of the collection
    function initialize(string memory _name, string memory _symbol)
        public
        initializer
    {
        __ERC721_init(_name, _symbol);
    }

    /// @notice Mint a NFT in the collection
    /// @param _firstOwner The address to mint the NFT to
    /// @param _tokenURI Token
    /// @param _name Description of the NFT
    /// @param _description Description of the NFT
    /// @param _tag Tag of the NFT
    /// @param _tokenAddress address du token
    /// @param _price NFT price
    /// @param _favorite NFT favorite
    /// @param _isAuctionable NFT auctioned
    /// @return newItemId New id of the item that has been minted
    function MintNFT(
        address _firstOwner,
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
        _mint(_firstOwner, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        emit NFTCreated(this.name(), newItemId, collection[newItemId-1], msg.sender, _firstOwner);   // Emit the event at each NFT created

        return newItemId;
    }
}
