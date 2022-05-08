// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract Auction {
    //------------------------------------------------------------------------------------
    // ----------------------------------Variables----------------------------------------
    //------------------------------------------------------------------------------------
        /// @notice This is the structure that contains all useful data to manage the auction of a given NFT
    struct BidManagement {
        bool hasAuctionStarted;
        uint auctionEndTime;
        address highestBidder;
        uint highestBid;
        mapping (address => uint) pendingRefunds;
        mapping (address => uint) totalBid;
        address[] bidders;
    }

    /// @notice Mapping of bid management data linked to each individual NFT (specified by collection name and token ID)
    mapping (string => mapping (uint => BidManagement)) bidManager;

    //------------------------------------------------------------------------------------
    // ------------------------------------Events-----------------------------------------
    //------------------------------------------------------------------------------------

    /// @notice Event raised when the bid has increased
    event HighestBidIncreased(string _nftCollection, uint _nftTokenID, address _bidder, uint _newBid);
    /// @notice Event raised when the auction has started
    event AuctionStarted(string _nftCollection, uint _nftTokenID, address _owner);
    /// @notice Event raised when the auction has finished
    event AuctionClosed(string _nftCollection, uint _nftTokenID, address _newOwner, uint _price);

    //------------------------------------------------------------------------------------
    // -----------------------------------Functions---------------------------------------
    //------------------------------------------------------------------------------------
    /// @notice This function allows to initiate a new auction
    /// @dev Call this function when the user decides to sell his NFT through an auction. The owner can define a starting price if he sends money in the transaction.
    /// @param _nftCollection Collection name of the given NFT
    /// @param _nftTokenID Token ID of the given NFT
    /// @param _biddingTime Auction time in seconds
    function initializeAuction(string memory _nftCollection, uint _nftTokenID, uint _biddingTime) external payable {
        require(!bidManager[_nftCollection][_nftTokenID].hasAuctionStarted, "An auction has already started for this NFT.");    // Make sure an auction did not start yet
        require(_biddingTime > 0, "Please define an auction higher tha zero.");                                                 // The auction time must be higher than zero

        bidManager[_nftCollection][_nftTokenID].auctionEndTime = block.timestamp + _biddingTime;    // Define the time at which the auction will end up
        bidManager[_nftCollection][_nftTokenID].highestBidder = msg.sender;                         // The initial highest bidder is the message sender
        bidManager[_nftCollection][_nftTokenID].highestBid = msg.value;                        // Set the first selling price
        bidManager[_nftCollection][_nftTokenID].hasAuctionStarted = true;                           // Auction started

        emit AuctionStarted(_nftCollection, _nftTokenID, msg.sender);       // Raise the event to log when an auction starts
    }

    /// @notice This function allows to place a new bid
    /// @dev Call this function each time a user place a new bid
    /// @param _nftCollection Collection name of the given NFT
    /// @param _nftTokenID Token ID of the given NFT
    function bid(string memory _nftCollection, uint _nftTokenID) external payable {
        require(bidManager[_nftCollection][_nftTokenID].hasAuctionStarted, "There is no auction started for this NFT.");    // Make sure an auction is ongoing for this NFT
        require(block.timestamp < bidManager[_nftCollection][_nftTokenID].auctionEndTime, "The auction has already ended.");// Make sure the auction is not finished yet
        require((bidManager[_nftCollection][_nftTokenID].totalBid[msg.sender]+msg.value) > bidManager[_nftCollection][_nftTokenID].highestBid, "The bid is too low."); // Make sure the bid (including previous bids) is higher than the current highest bid
    
        // Check if there was already a bid
        if(bidManager[_nftCollection][_nftTokenID].highestBid != 0) {
            bidManager[_nftCollection][_nftTokenID].pendingRefunds[bidManager[_nftCollection][_nftTokenID].highestBidder] += bidManager[_nftCollection][_nftTokenID].highestBid;
        }

        // Add the bidder in the list if it is the first time
        if(bidManager[_nftCollection][_nftTokenID].totalBid[msg.sender] == 0) {
            bidManager[_nftCollection][_nftTokenID].bidders.push(msg.sender);
        } 

        // Update the data with the new highest bid
        bidManager[_nftCollection][_nftTokenID].highestBid = bidManager[_nftCollection][_nftTokenID].totalBid[msg.sender]+msg.value;    // The highest bid is what this user already bid + the new value of this transaction
        bidManager[_nftCollection][_nftTokenID].highestBidder = msg.sender;             // Update the new highest bidder
        bidManager[_nftCollection][_nftTokenID].totalBid[msg.sender] += msg.value;      // The total bid of this user is updated               
        bidManager[_nftCollection][_nftTokenID].pendingRefunds[msg.sender] = 0;         // No pending refunds anymore

        emit HighestBidIncreased(_nftCollection,_nftTokenID,msg.sender,bidManager[_nftCollection][_nftTokenID].highestBid);     // Raise the event to save the new highest bid
    }

    /// @notice This function allows a user that placed a bid (not the highest anymore) to get back his funds
    /// @dev The user can call this function through the front when his bid is not the highest anymore.
    /// @param _nftCollection Collection name of the given NFT
    /// @param _nftTokenID Token ID of the given NFT
    function withdrawRefund(string memory _nftCollection, uint _nftTokenID) external {
        require(bidManager[_nftCollection][_nftTokenID].pendingRefunds[msg.sender] > 0, "There is nothing to refund to the message sender for this NFT.");   // Make sure there is funds to return
   
        uint refund = bidManager[_nftCollection][_nftTokenID].pendingRefunds[msg.sender];   // Recover the funds to refund before erasing it

        bidManager[_nftCollection][_nftTokenID].pendingRefunds[msg.sender] = 0;             // Erase the refund counter
        bidManager[_nftCollection][_nftTokenID].totalBid[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value:refund}("");
        require(success);
    }

    /// @notice This function allows to close the auction
    /// @dev This function is called from the front when the auction time is expired
    /// @param _nftCollection Collection name of the given NFT
    /// @param _nftTokenID Token ID of the given NFT
    function endAuction(string memory _nftCollection, uint _nftTokenID) external {
        require(bidManager[_nftCollection][_nftTokenID].hasAuctionStarted, "There is no auction started for this NFT.");    // Make sure an auction is ongoing for this NFT
        require(block.timestamp >= bidManager[_nftCollection][_nftTokenID].auctionEndTime, "The auction has not finished yet."); // Make sure the auction is finished

        bidManager[_nftCollection][_nftTokenID].hasAuctionStarted = false; 
        
        // Reset totalBid mapping
        uint listSize = bidManager[_nftCollection][_nftTokenID].bidders.length;
        address tempAddress;
        for (uint i=listSize; i>0; i--){
            tempAddress=bidManager[_nftCollection][_nftTokenID].bidders[i-1];
            bidManager[_nftCollection][_nftTokenID].totalBid[tempAddress] = 0;
        }
        delete bidManager[_nftCollection][_nftTokenID].bidders;

        emit AuctionClosed(_nftCollection, _nftTokenID, bidManager[_nftCollection][_nftTokenID].highestBidder,bidManager[_nftCollection][_nftTokenID].highestBid);       // Raise the event to log when an auction ends
    }


    //------------------------------------------------------------------------------------
    // ------------------------------------Getters----------------------------------------
    //------------------------------------------------------------------------------------
    /// @notice This function allows to initiate a new auction
    /// @dev Call this function to check if the time of the auction is over or not
    /// @param _nftCollection Collection name of the given NFT
    /// @param _nftTokenID Token ID of the given NFT
    /// @return Returns a boolean to define if the auction time has expired (true) or not (false)
    function checkAuctionTimeExpired(string memory _nftCollection, uint _nftTokenID) external view returns (bool) {
        require(bidManager[_nftCollection][_nftTokenID].hasAuctionStarted, "There is no auction started for this NFT.");    // Make sure an auction is ongoing for this NFT  

        return (block.timestamp >= bidManager[_nftCollection][_nftTokenID].auctionEndTime);
    }
}