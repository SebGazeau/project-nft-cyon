// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title NFTCollections contract
/// @author Sebastien Gazeau, Sébastien Dupertuis et Alexis Mendoza
/// @dev The contract code contains comments for developers only visible in the source code
contract NFTCollections is ERC721URIStorage {
    //------------------------------------------------------------------------------------
    // ----------------------------------Variables----------------------------------------
    //------------------------------------------------------------------------------------
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
    constructor(string memory _name, string memory _symbol) ERC721 (_name, _symbol) {}
    //------------------------------------------------------------------------------------
    // ------------------------------------Events-----------------------------------------
    //------------------------------------------------------------------------------------
    /// @notice event for NFT creation
    /// @param _collectionName Name of the NFT collection
    /// @param _collectionAddress Address of the collection
    /// @param _tokenID The ID of this given NFT
    /// @param _collectionData Data of the given NFT
    /// @param _creator The address of the creator of the NFT
    event NFTCreated(string _collectionName, address _collectionAddress, uint256 _tokenID, NFT _collectionData, address _creator);

    /// @notice event for NFT sales
    /// @param _collectionName Name of the NFT collection
    /// @param _collectionAddress Address of the collection
    /// @param _tokenID The ID of this given NFT
    /// @param _price The new price of the given NFT
    event NewPriceSet(string _collectionName, address _collectionAddress, uint256 _tokenID, uint256 _price);

    //------------------------------------------------------------------------------------
    // ----------------------------------Constructor--------------------------------------
    //------------------------------------------------------------------------------------
    // /// @notice initialization of the ERC271
    // /// @param _name name of the collection
    // /// @param _symbol symbol of the collection
    // function initialize(string memory _name, string memory _symbol) public initializer
    // {
    //     __ERC721_init(_name, _symbol);
    // }

    /// @notice Mint a NFT in the collection
    /// @param _firstOwner The address to mint the NFT to
    /// @param _creator The creator of the new NFT
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
        address _creator,
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

        emit NFTCreated(this.name(), address(this), newItemId, collection[newItemId-1], _creator);   // Emit the event at each NFT created

        return newItemId;
    }

    /// @notice This function allows to set the price of the given NFT
    /// @dev Call this function when a sale is initiated
    /// @param _tokenID The token ID of the NFT to set the price
    /// @param _price The price to set
    function setPrice(uint256 _tokenID, uint256 _price) external {
        // All the "require" are done on the upper level in Master SC
        collection[_tokenID-1].price = _price;

        emit NewPriceSet(this.name(), address(this), _tokenID, _price);
    }


    //------------------------------------------------------------------------------------
    // ------------------------------------Getters----------------------------------------
    //------------------------------------------------------------------------------------
    /// @notice This function allows to get the sale price of the given NFT (if in sale)
    /// @dev Call this function to get the current sale price
    /// @param _tokenID The token ID of the NFT to get the price
    /// @return _price The price of the given NFT
    function getPrice(uint256 _tokenID) external view returns (uint256) {
        return(collection[_tokenID-1].price);
    }

    //------------------------------------------------------------------------------------
    // ------------------------------------Getters----------------------------------------
    //------------------------------------------------------------------------------------
    /// @notice This function allows to get the total amount of NFTs saved in this contract
    /// @dev Call this function to check the last created token ID
    /// @return _totalSupply The last created token ID
    function getTotalSupply() external view returns (uint256) {
        return(_tokenIds.current());
    }
}
