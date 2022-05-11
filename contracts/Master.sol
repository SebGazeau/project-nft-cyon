// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import "./Auction.sol";
import "./NFTCollectionFactory.sol";

contract Master is Auction, NFTCollectionFactory {
    //------------------------------------------------------------------------------------
    // ----------------------------------Variables----------------------------------------
    //------------------------------------------------------------------------------------

    //------------------------------------------------------------------------------------
    // ------------------------------------Events-----------------------------------------
    //------------------------------------------------------------------------------------
    
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
    /// @param _creator The address of the NFT creator
    function createNFT(address _collectionAddress, address _firstOwner, string memory _tokenURI, string memory _name, 
        string memory _description, string memory _tag, address _creator) external {
            require(_collectionAddress != address(0),"The collection address needs to be different from zero.");
            require(_firstOwner != address(0),"The user address needs to be different from zero.");  

            NFTCollections(_collectionAddress).MintNFT(_firstOwner,_creator,_tokenURI,_name,_description,_tag,address(0),0,false,false);
        }


    //------------------------------------------------------------------------------------
    // ------------------------------------Getters----------------------------------------
    //------------------------------------------------------------------------------------

}
