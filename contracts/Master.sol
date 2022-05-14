// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import "./Auction.sol";
import "./NFTCollectionFactory.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title Master contract to manage the decentralized NFT market place 
/// @author Sebastien Gazeau, Sébastien Dupertuis et Alexis Mendoza
/// @notice This smart contract is the link between the Dapp and the subcontracts
contract Master is Auction {
    
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
    /// @param _units The units of the sale
    event NFTSold(string _collectionName, address _collectionAddress, uint256 _tokenID, address _oldOwner, address _newOwner, uint256 _price, string _units);

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
        string memory _description, string memory _tag) external  returns (uint256) {
            require(_collectionAddress != address(0),"The collection address needs to be different from zero.");
            require(_firstOwner != address(0),"The user address needs to be different from zero.");  

            return(NFTCollections(_collectionAddress).MintNFT(_firstOwner,msg.sender,_tokenURI,_name,_description,_tag,address(tokenCYON),0,false,false));
        }


    /// @notice This function allows to set the price of the given NFT
    /// @dev Call this function when a sale is initiated
    /// @param _collectionAddress The address of the collection of the NFT to set the price
    /// @param _tokenID The token ID of the NFT to set the price
    /// @param _price The price to set
    function setNewPrice(address _collectionAddress, uint256 _tokenID, uint256 _price) external {
        require(_collectionAddress != address(0),"The collection address needs to be different from zero.");    // Make sure the address is different from zero
        //require((_tokenID <= NFTCollections(_collectionAddress).getTotalSupply()) && (_tokenID > 0), "This token ID does not exist.");      // Make sure the token ID exists
        require(NFTCollections(_collectionAddress).ownerOf(_tokenID) == msg.sender,"This NFT does not belong to the current message sender.");  // Make sure the sale comes from the owner. Revert if the tokenID does not exist (ERC721Upgradeable library)
        require(_price > 0,"Please define a selling price higher than zero.");                                  // Make sure the price is more than zero

        NFTCollections(_collectionAddress).setPrice(_tokenID,_price);
    }

    /// @notice This function allows to transfer the money to the NFT owner and the NFT to the buyer after a direct sale.
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
        bool sent = tokenCYON.transferFrom(msg.sender,currentOwner, price);
        require(sent, "Failed to send CYON to the NFT owner.");

        // Send the NFT to the new owner
        require(NFTCollections(_collectionAddress).getApproved(_tokenID) == address(this),"This address does not have the allowance to send the NFT");       // Make sure the Master contract has the allowance to manage the NFT transfer
        NFTCollections(_collectionAddress).safeTransferFrom(currentOwner, msg.sender, _tokenID);

        // Reset the price to 0 after the sale
        NFTCollections(_collectionAddress).setPrice(_tokenID,0);

        emit NFTSold(NFTCollections(_collectionAddress).name(), _collectionAddress, _tokenID, currentOwner, msg.sender, price, "CYON");
    }

    /// @notice This function allows to initiate an auction by verifying owner and tokenID
    /// @dev Call this function before starting the auction procedure
    /// @param _collectionAddress The address of the collection of the NFT to start an auction
    /// @param _tokenID The token ID of the NFT to start an auction
    /// @return _validity True if the auction is authorized
    function requestAuction(address _collectionAddress, uint256 _tokenID) external returns (bool) {
        require(_collectionAddress != address(0),"The collection address needs to be different from zero.");    // Make sure the address is different from zero
        require(NFTCollections(_collectionAddress).ownerOf(_tokenID) == msg.sender,"This NFT does not belong to the current message sender.");  // Make sure the sale comes from the owner. Revert if the tokenID does not exist (ERC721Upgradeable library)
        require(NFTCollections(_collectionAddress).getPrice(_tokenID) == 0,"This NFT is already for sale.");     // Make sure the NFT is not already for sale

        setAuctionValidity(_collectionAddress, _tokenID, msg.sender);

        return true;
    }

    /// @notice This function allows to close an auction when the time has expired
    /// @dev Call this function from the front when the auction time has expired
    /// @param _collectionAddress The address of the collection of the NFT to close the auction
    /// @param _tokenID The token ID of the NFT to close the auction
    function closeAuction(address _collectionAddress, uint256 _tokenID) external {
        require(_collectionAddress != address(0),"The collection address needs to be different from zero.");    // Make sure the address is different from zero
        NFTCollections(_collectionAddress).ownerOf(_tokenID);       // Revert if the tokenID does not exist (ERC721Upgradeable library)
        require(this.isInAuction(_collectionAddress,_tokenID),"This NFT did not start an auction.");         // Make sure an auction started
        require(this.checkAuctionTimeExpired(_collectionAddress,_tokenID), "The auction has not finished yet."); // Make sure the auction is finished

        // Get the data of the auction
        uint256 price = this.getCurrentHighestBid(_collectionAddress,_tokenID);
        address currentOwner = NFTCollections(_collectionAddress).ownerOf(_tokenID);
        address highestBidder = this.getCurrentHighestBidder(_collectionAddress, _tokenID);
        require(highestBidder != address(0),"Error: the highest bidder is the zero address.");  // Make sure the address of the highest bidder is valid

        // Check if price is more than 0. Otherwise, nobody has bidded
        if(price > 0) {
            // Send the ETH to the current NFT owner
            (bool success, ) = payable(currentOwner).call{value:price}("");
            require(success, "Failed to send ETH to the NFT owner.");

            // Verify that the highest bidder is not the current owner. Otherwise, nobody has bidded, except the initial bid of the owner (starting price)
            if(highestBidder != currentOwner) {
                NFTCollections(_collectionAddress).setPrice(_tokenID,price);        // Update the price of the NFT for event tracking
            
                // Send the NFT to the new owner
                require(NFTCollections(_collectionAddress).getApproved(_tokenID) == address(this),"This address does not have the allowance to send the NFT");       // Make sure the Master contract has the allowance to manage the NFT transfer
                NFTCollections(_collectionAddress).safeTransferFrom(currentOwner, highestBidder, _tokenID);

                // Reset the price to 0 after the sale for price tracking
                NFTCollections(_collectionAddress).setPrice(_tokenID,0);

                emit NFTSold(NFTCollections(_collectionAddress).name(), _collectionAddress, _tokenID, currentOwner, highestBidder, price, "ETH");
            }
            
            // Reset the auction data
            endAuction(_collectionAddress, _tokenID);
        }
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
        //require((_tokenID <= NFTCollections(_collectionAddress).getTotalSupply()) && (_tokenID > 0), "This token ID does not exist.");      // Make sure the token ID exists
        NFTCollections(_collectionAddress).ownerOf(_tokenID);       // Revert if the tokenID does not exist (ERC721Upgradeable library)
        return(NFTCollections(_collectionAddress).tokenURI(_tokenID));
    }

/*
    /// @notice This function returns the current owner of the given NFT
    /// @dev Call this function to get the owner of the NFT. Revert if the tokenID does not exist
    /// @param _collectionAddress The address of the collection of the NFT to get the owner
    /// @param _tokenID The token ID of the NFT to get the owner
    /// @return _address The owner address
    function getNFTOwner(address _collectionAddress, uint256 _tokenID) external view returns (address) {
        return(NFTCollections(_collectionAddress).ownerOf(_tokenID));
    }*/
}
