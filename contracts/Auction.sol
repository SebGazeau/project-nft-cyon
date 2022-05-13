// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

/// @title A decentralized auction system
/// @author Sebastien Gazeau, Sébastien Dupertuis et Alexis Mendoza
/// @notice This smart contract can be used in any NFT project requiring a system of auction
contract Auction {
    //------------------------------------------------------------------------------------
    // ----------------------------------Variables----------------------------------------
    //------------------------------------------------------------------------------------
        /// @notice This is the structure that contains all useful data to manage the auction of a given NFT
    struct BidManagement {
        address currentOwner;
        bool hasAuctionStarted;
        uint auctionEndTime;
        address highestBidder;
        uint highestBid;
        mapping (address => uint) pendingRefunds;
        mapping (address => uint) totalBid;
        address[] bidders;
    }

    /// @notice Mapping of bid management data linked to each individual NFT (specified by collection address and token ID)
    mapping (address => mapping (uint => BidManagement)) bidManager;

    //------------------------------------------------------------------------------------
    // ------------------------------------Events-----------------------------------------
    //------------------------------------------------------------------------------------

    /// @notice Event raised when the bid has increased
    event HighestBidIncreased(address _nftCollectionAddress, uint _nftTokenID, address _bidder, uint _newBid);
    /// @notice Event raised when the auction has started
    event AuctionStarted(address _nftCollectionAddress, uint _nftTokenID, address _owner);
    /// @notice Event raised when the auction has finished
    event AuctionClosed(address _nftCollectionAddress, uint _nftTokenID, address _newOwner, uint _price);

    //------------------------------------------------------------------------------------
    // -----------------------------------Functions---------------------------------------
    //------------------------------------------------------------------------------------
    /// @notice This function confirms a valid auction request
    /// @dev This function is called from the master file when an auction is requested from the front
    /// @param _nftCollectionAddress Collection address of th
    /// @param _nftTokenID Token ID of the given NFTe given NFT
    /// @param _currentOwner The current owner of the NFT
    function setAuctionValidity(address _nftCollectionAddress, uint _nftTokenID, address _currentOwner) internal {
        require(_nftCollectionAddress != address(0),"The collection address needs to be different from zero.");    // Make sure the address is different from zero
        require(!bidManager[_nftCollectionAddress][_nftTokenID].hasAuctionStarted, "An auction has already started for this NFT.");    // Make sure an auction did not start yet

        bidManager[_nftCollectionAddress][_nftTokenID].currentOwner = _currentOwner;
    }

    /// @notice This function allows to start a new auction
    /// @dev Call this function when the user decides to sell his NFT through an auction. The owner can define a starting price if he sends money in the transaction.
    /// @param _nftCollectionAddress Collection address of the given NFT
    /// @param _nftTokenID Token ID of the given NFT
    /// @param _biddingTime Auction time in seconds
    function startAuction(address _nftCollectionAddress, uint _nftTokenID, uint _biddingTime) external payable {
        require(_nftCollectionAddress != address(0),"The collection address needs to be different from zero.");    // Make sure the address is different from zero
        require(bidManager[_nftCollectionAddress][_nftTokenID].currentOwner == msg.sender,"The validity of the auction has not been verified, yet"); // Make sure it is allowed to start an auction on this NFT 
        require(!bidManager[_nftCollectionAddress][_nftTokenID].hasAuctionStarted, "An auction has already started for this NFT.");    // Make sure an auction did not start yet
        require(_biddingTime > 0, "Please define an auction higher than zero.");                                                 // The auction time must be higher than zero

        bidManager[_nftCollectionAddress][_nftTokenID].auctionEndTime = block.timestamp + _biddingTime;    // Define the time at which the auction will end up
        bidManager[_nftCollectionAddress][_nftTokenID].highestBidder = msg.sender;                         // The initial highest bidder is the message sender
        bidManager[_nftCollectionAddress][_nftTokenID].highestBid = msg.value;                        // Set the first selling price
        bidManager[_nftCollectionAddress][_nftTokenID].hasAuctionStarted = true;                           // Auction started
        bidManager[_nftCollectionAddress][_nftTokenID].bidders.push(msg.sender);                       // Push the owner in the bidders list
        bidManager[_nftCollectionAddress][_nftTokenID].totalBid[msg.sender] += msg.value;              // Initialize the total bid of the owner

        emit AuctionStarted(_nftCollectionAddress, _nftTokenID, msg.sender);       // Raise the event to log when an auction starts
    }

    /// @notice This function allows to place a new bid
    /// @dev Call this function each time a user place a new bid
    /// @param _nftCollectionAddress Collection address of the given NFT
    /// @param _nftTokenID Token ID of the given NFT
    function bid(address _nftCollectionAddress, uint _nftTokenID) external payable {
        require(_nftCollectionAddress != address(0),"The collection address needs to be different from zero.");    // Make sure the address is different from zero
        require(bidManager[_nftCollectionAddress][_nftTokenID].hasAuctionStarted, "There is no auction started for this NFT.");        // Make sure an auction is ongoing for this NFT
        require(block.timestamp < bidManager[_nftCollectionAddress][_nftTokenID].auctionEndTime, "The auction has already ended.");    // Make sure the auction is not finished yet
        require(bidManager[_nftCollectionAddress][_nftTokenID].bidders.length < 1000, "This auction achieved the maximum amount of bids.");    // Revert if we achieve the given limit of bids
        require((bidManager[_nftCollectionAddress][_nftTokenID].totalBid[msg.sender]+msg.value) > bidManager[_nftCollectionAddress][_nftTokenID].highestBid, "The bid is too low."); // Make sure the bid (including previous bids) is higher than the current highest bid
    
        // Check if there was already a bid
        if(bidManager[_nftCollectionAddress][_nftTokenID].highestBid != 0) {
            bidManager[_nftCollectionAddress][_nftTokenID].pendingRefunds[bidManager[_nftCollectionAddress][_nftTokenID].highestBidder] += bidManager[_nftCollectionAddress][_nftTokenID].highestBid;
        }

        // Add the bidder in the list if it is the first time
        if(bidManager[_nftCollectionAddress][_nftTokenID].totalBid[msg.sender] == 0) {
            bidManager[_nftCollectionAddress][_nftTokenID].bidders.push(msg.sender);
        } 

        // Update the data with the new highest bid
        bidManager[_nftCollectionAddress][_nftTokenID].totalBid[msg.sender] += msg.value;      // The total bid of this user is updated  
        bidManager[_nftCollectionAddress][_nftTokenID].highestBid = bidManager[_nftCollectionAddress][_nftTokenID].totalBid[msg.sender];    // The highest bid is what this user already bid + the new value of this transaction
        bidManager[_nftCollectionAddress][_nftTokenID].highestBidder = msg.sender;             // Update the new highest bidder             
        bidManager[_nftCollectionAddress][_nftTokenID].pendingRefunds[msg.sender] = 0;         // No pending refunds anymore

        emit HighestBidIncreased(_nftCollectionAddress,_nftTokenID,msg.sender,bidManager[_nftCollectionAddress][_nftTokenID].highestBid);     // Raise the event to save the new highest bid
    }

    /// @notice This function allows a user that placed a bid (not the highest anymore) to get back his funds
    /// @dev The user can call this function through the front when his bid is not the highest anymore.
    /// @param _nftCollectionAddress Collection address of the given NFT
    /// @param _nftTokenID Token ID of the given NFT
    function withdrawRefund(address _nftCollectionAddress, uint _nftTokenID) external {
        require(_nftCollectionAddress != address(0),"The collection address needs to be different from zero.");    // Make sure the address is different from zero
        require(bidManager[_nftCollectionAddress][_nftTokenID].pendingRefunds[msg.sender] > 0, "There is nothing to refund to the message sender for this NFT.");   // Make sure there is funds to return
   
        uint refund = bidManager[_nftCollectionAddress][_nftTokenID].pendingRefunds[msg.sender];   // Recover the funds to refund before erasing it

        bidManager[_nftCollectionAddress][_nftTokenID].pendingRefunds[msg.sender] = 0;             // Erase the refund counter
        bidManager[_nftCollectionAddress][_nftTokenID].totalBid[msg.sender] = 0; 
        
        (bool success, ) = msg.sender.call{value:refund}("");
        require(success, "Failed to send ETH to the requester.");
    }

    /// @notice This function allows to close the auction
    /// @dev This function is called from the front when the auction time is expired
    /// @param _nftCollectionAddress Collection address of the given NFT
    /// @param _nftTokenID Token ID of the given NFT
    function endAuction(address _nftCollectionAddress, uint _nftTokenID) internal {
        //require(_nftCollectionAddress != address(0),"The collection address needs to be different from zero.");    // Make sure the address is different from zero
        //require(bidManager[_nftCollectionAddress][_nftTokenID].hasAuctionStarted, "There is no auction started for this NFT.");    // Make sure an auction is ongoing for this NFT
        //require(block.timestamp >= bidManager[_nftCollectionAddress][_nftTokenID].auctionEndTime, "The auction has not finished yet."); // Make sure the auction is finished

        bidManager[_nftCollectionAddress][_nftTokenID].hasAuctionStarted = false; 
        bidManager[_nftCollectionAddress][_nftTokenID].currentOwner = address(0);
        
        // Reset totalBid mapping. No risk of DoS gaz limit since the amount of bidders is limited to 1000.
        uint listSize = bidManager[_nftCollectionAddress][_nftTokenID].bidders.length;
        address tempAddress;
        for (uint i=listSize; i>0; i--){
            tempAddress=bidManager[_nftCollectionAddress][_nftTokenID].bidders[i-1];
            bidManager[_nftCollectionAddress][_nftTokenID].totalBid[tempAddress] = 0;
        }
        delete bidManager[_nftCollectionAddress][_nftTokenID].bidders;

        emit AuctionClosed(_nftCollectionAddress, _nftTokenID, bidManager[_nftCollectionAddress][_nftTokenID].highestBidder,bidManager[_nftCollectionAddress][_nftTokenID].highestBid);       // Raise the event to log when an auction ends
    }


    //------------------------------------------------------------------------------------
    // ------------------------------------Getters----------------------------------------
    //------------------------------------------------------------------------------------
    /// @notice This function allows to check if the auction ended
    /// @dev Call this function to check if the time of the auction is over or not
    /// @param _nftCollectionAddress Collection address of the given NFT
    /// @param _nftTokenID Token ID of the given NFT
    /// @return Returns a boolean to define if the auction time has expired (true) or not (false)
    function checkAuctionTimeExpired(address _nftCollectionAddress, uint _nftTokenID) external view returns (bool) {
        require(_nftCollectionAddress != address(0),"The collection address needs to be different from zero.");    // Make sure the address is different from zero
        require(bidManager[_nftCollectionAddress][_nftTokenID].hasAuctionStarted, "There is no auction started for this NFT.");    // Make sure an auction is ongoing for this NFT  

        return (block.timestamp >= bidManager[_nftCollectionAddress][_nftTokenID].auctionEndTime);
    }

    /// @notice This function allows to check for the current highest bidder
    /// @dev Call this function when you want to know the address of the highest bidder
    /// @param _nftCollectionAddress Collection address of the given NFT
    /// @param _nftTokenID Token ID of the given NFT
    /// @return Returns the address of the current highest bidder
    function getCurrentHighestBidder(address _nftCollectionAddress, uint _nftTokenID) external view returns (address) {
        require(_nftCollectionAddress != address(0),"The collection address needs to be different from zero.");    // Make sure the address is different from zero
        require(bidManager[_nftCollectionAddress][_nftTokenID].hasAuctionStarted, "There is no auction started for this NFT.");    // Make sure an auction is ongoing for this NFT  

        return (bidManager[_nftCollectionAddress][_nftTokenID].highestBidder);
    }

    /// @notice This function allows to check for the current highest bid
    /// @dev Call this function when you want to know the value of the highest bid
    /// @param _nftCollectionAddress Collection address of the given NFT
    /// @param _nftTokenID Token ID of the given NFT
    /// @return Returns the value of the current highest bid
    function getCurrentHighestBid(address _nftCollectionAddress, uint _nftTokenID) external view returns (uint) {
        require(_nftCollectionAddress != address(0),"The collection address needs to be different from zero.");    // Make sure the address is different from zero
        require(bidManager[_nftCollectionAddress][_nftTokenID].hasAuctionStarted, "There is no auction started for this NFT.");    // Make sure an auction is ongoing for this NFT  

        return (bidManager[_nftCollectionAddress][_nftTokenID].highestBid);
    }

    /// @notice This function allows to check for the amount of bidders
    /// @dev Call this function from the front to display the amount of bidders over the given limit (here 1000)
    /// @param _nftCollectionAddress Collection address of the given NFT
    /// @param _nftTokenID Token ID of the given NFT
    /// @return Returns the amount of bidders (how many addresses)
    function getBiddersAmount(address _nftCollectionAddress, uint _nftTokenID) external view returns (uint) {
        require(_nftCollectionAddress != address(0),"The collection address needs to be different from zero.");    // Make sure the address is different from zero
        require(bidManager[_nftCollectionAddress][_nftTokenID].hasAuctionStarted, "There is no auction started for this NFT.");    // Make sure an auction is ongoing for this NFT  

        return (bidManager[_nftCollectionAddress][_nftTokenID].bidders.length);
    }
 
    /// @notice This function allows to check if there is an auction in progress for the given NFT
    /// @dev Call this function from the front to know if there is an auction ongoing
    /// @param _nftCollectionAddress Collection address of the given NFT
    /// @param _nftTokenID Token ID of the given NFT
    /// @return Returns true if an auction is in progress
    function isInAuction(address _nftCollectionAddress, uint _nftTokenID) external view returns (bool) {
        require(_nftCollectionAddress != address(0),"The collection address needs to be different from zero.");    // Make sure the address is different from zero
        return(bidManager[_nftCollectionAddress][_nftTokenID].hasAuctionStarted);
    }
}