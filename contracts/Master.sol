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
    function createNFT(address _collectionAddress, address _user, string memory _tokenURI, string memory _name, 
        string memory _description, string memory _tag, address _tokenAddress) external {
            require(_collectionAddress != address(0),"The collection address needs to be different from zero.");
            require(_user != address(0),"The user address needs to be different from zero.");  

            NFTCollections(_collectionAddress).MintNFT(_user,_tokenURI,_name,_description,_tag,_tokenAddress,0,false,false);
        }


    //------------------------------------------------------------------------------------
    // ------------------------------------Getters----------------------------------------
    //------------------------------------------------------------------------------------

}
