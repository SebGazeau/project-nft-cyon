// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import "./Auction.sol";
import "./NFTCollectionFactory.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title Master contract to manage the decentralized NFT market place 
/// @author Sebastien Gazeau, Sébastien Dupertuis et Alexis Mendoza
/// @notice This smart contract is the link between the Dapp and the subcontracts
contract Master {
    
    //------------------------------------------------------------------------------------
    // ----------------------------------Variables----------------------------------------
    //------------------------------------------------------------------------------------
    IERC20 public tokenCYON;

    //------------------------------------------------------------------------------------
    // ------------------------------------Events-----------------------------------------
    //------------------------------------------------------------------------------------
    /// @notice event for NFT sales
    /// @param _collectionName Name of the NFT collection
    /// @param _collectionAddress Address of the collection
    /// @param _tokenID The ID of this given NFT
    /// @param _oldOwner Previous owner of the sold NFT
    /// @param _newOwner New owner of the bought NFT
    /// @param _price The sale price of the given NFT
    event NFTSold(string _collectionName, address _collectionAddress, uint256 _tokenID, address _oldOwner, address _newOwner, uint256 _price);

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

    /// @notice This function allows to transfer the money to the NFT owner and the NFT to the buyer.
    /// @dev Call this function when a buyer click on the BUY button
    /// @param _collectionAddress The address of the collection of the NFT to be sold/transfered
    /// @param _tokenID The token ID of the NFT to be sold/transfered
    function buyNFT(address _collectionAddress, uint256 _tokenID) external payable {
        // Global requires
        require(_collectionAddress != address(0),"The collection address needs to be different from zero.");    // Make sure the address is different from zero
        uint256 price = NFTCollections(_collectionAddress).getPrice(_tokenID);
        require(price > 0,"This NFT is not for sale.");     // Make sure the NFT is for sale
    
        // Send the CYON to the current NFT owner
        require(tokenCYON.allowance(msg.sender, address(this)) >= price, "CYON token allowance too low.");      // Make sure the Master contract has the allowance to manage the CYON transfer
        address currentOwner = NFTCollections(_collectionAddress).ownerOf(_tokenID);
        bool sent = tokenCYON.transfer(currentOwner, price);
        require(sent, "Failed to send CYON to the NFT owner.");

        // Send the NFT to the new owner
        require(NFTCollections(_collectionAddress).getApproved(_tokenID) == address(this),"");       // Make sure the Master contract has the allowance to manage the NFT transfer
        NFTCollections(_collectionAddress).safeTransferFrom(currentOwner, msg.sender, _tokenID);

        // Reset the price to 0 after the sale
        NFTCollections(_collectionAddress).setPrice(_tokenID,0);

        emit NFTSold(NFTCollections(_collectionAddress).name(), _collectionAddress, _tokenID, currentOwner, msg.sender, price);
    }


    //------------------------------------------------------------------------------------
    // ------------------------------------Getters----------------------------------------
    //------------------------------------------------------------------------------------
    /// @notice This function returns the URI data of the given NFT
    /// @dev Call this function to get the metadata of the NFT
    /// @param _collectionAddress The address of the collection of the NFT to get the URI
    /// @param _tokenID The token ID of the NFT to get the URI
    /// @return _URI The URI data
    function getURI(address _collectionAddress, uint256 _tokenID) external view returns (string memory) {
        require((_tokenID <= NFTCollections(_collectionAddress).getTotalSupply()) && (_tokenID > 0), "This token ID does not exist.");      // Make sure the token ID exists
        return(NFTCollections(_collectionAddress).tokenURI(_tokenID));
    }
}
