// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import "./Auction.sol";
import "./NFTCollectionFactory.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract Master is Auction, NFTCollectionFactory {
    
    

    //------------------------------------------------------------------------------------
    // ----------------------------------Variables----------------------------------------
    //------------------------------------------------------------------------------------
    IERC20 public tokenCYON;

    //------------------------------------------------------------------------------------
    // ------------------------------------Events-----------------------------------------
    //------------------------------------------------------------------------------------

    //------------------------------------------------------------------------------------
    // ----------------------------------Constructor--------------------------------------
    //------------------------------------------------------------------------------------
    /// @notice The constructor the Master smart contract
    /// @param _addressCYON The ERC20 address of the platform token (CYON) 
    constructor(address _addressCYON) {
        tokenCYON = IERC20(_addressCYON);
    }

    //------------------------------------------------------------------------------------
    // -----------------------------------Functions---------------------------------------
    //------------------------------------------------------------------------------------
    /// @notice This function allows to create NFTs inside a collection and mint it directly
    /// @dev Call this function when the user wants to create a new NFT and mint it to the given address
    /// @param _collectionAddress The address of the collection in which the NFT will be created/minted
    /// @param _firstOwner The destination address to which the NFT is minted
    /// @param _tokenURI The metadata through a link URI
    /// @param _name Name of the new NFT
    /// @param _description Description of the new NFT
    /// @param _tag Tag of the new NFT allowing filtering
    function createNFT(address _collectionAddress, address _firstOwner, string memory _tokenURI, string memory _name, 
        string memory _description, string memory _tag) external {
            require(_collectionAddress != address(0),"The collection address needs to be different from zero.");
            require(_firstOwner != address(0),"The user address needs to be different from zero.");  

            NFTCollections(_collectionAddress).MintNFT(_firstOwner,msg.sender,_tokenURI,_name,_description,_tag,address(tokenCYON),0,false,false);
        }


    /// @notice This function allows to set the price of the given NFT
    /// @dev Call this function when a sale is initiated
    /// @param _collectionAddress The address of the collection of the NFT to set the price
    /// @param _tokenID The token ID of the NFT to set the price
    /// @param _price The price to set
    function setNewPrice(address _collectionAddress, uint256 _tokenID, uint256 _price) external {
        require(_collectionAddress != address(0),"The collection address needs to be different from zero.");    // Make sure the address is different from zero
        require((_tokenID <= NFTCollections(_collectionAddress).getTotalSupply()) && (_tokenID > 0), "This token ID does not exist.");      // Make sure the token ID exists
        require(NFTCollections(_collectionAddress).ownerOf(_tokenID) == msg.sender,"This NFT does not belong to the current message sender.");  // Make sure the sale comes from the owner
        require(_price > 0,"Please define a selling price higher than zero.");                                  // Make sure the price is more than zero

        NFTCollections(_collectionAddress).setPrice(_tokenID,_price);
    }


    //------------------------------------------------------------------------------------
    // ------------------------------------Getters----------------------------------------
    //------------------------------------------------------------------------------------
    
}
