# project-nft-cyon - Project 5 Alyra

Authors: Sébastien Gazeau, Alexis Mendoza and Sébastien Dupertuis

## Work Sharing

Sébastien Gazeau:

- Github coordination and deployment
- Dapp
- CYONToken smart contract + comments
- Unit testing for CYONToken
- Webserver deployment

Alexis Mendoza:

- NFTCollectionFactory and NFTCollections smart contracts + comments
- Dapp (some screens)
- Video
- Project coordination

Sébastien Dupertuis:

- Master, Auction smart contracts and NFTCollections complements for the Master contract + comments
- Unit testings
- README

## Introduction

This project consists in the creation of a decentralized application that represents a NFT marketplace.
This plateform allows the users to:

- create NFT collections
- Create and mint NFTs in the collections
- visualize the available collections
- visualize any NFT from any collection (with all details related to a NFT)
- sell a NFT in auction or in direct sale
- buy a NFT in auction or in direct sale
- swap ETH into the plateform token (CYON)

## Install project and start

Launch Ganache in a separate console.

For the first launch (git clone):

- The command `npm run i-local` will install the dependencies for the smart contracts and their relative unit tests.
- Then, it will deploy the contracts with Truffle, from the project root.
- Finally, it will install the necessary dependencies for the client.

For the next launches:

- This is enough to start Ganache and to deploy the contracts from the project root with `truffle migrate`.

For both cases, end up with navigating to the client folder with `cd client`, and execute the `npm run start` command in order to launch the Dapp.

## Accessibility

https://main.d32uedov80na8d.amplifyapp.com/

## Smart Contracts

5 files:

- Master.sol
- Auction.sol
- CYONToken.sol
- NFTCollectionFactory.sol
- NFTCollections.sol

### Master.sol

Description:
This is the main contract that contains most of the functions called by the Dapp.

Dependencies:

- Auction.sol
- NFTCollectionFactory.sol
- @openzeppelin/contracts/token/ERC20/IERC20.sol

This smart contract contains:

- 1 event:
  - NFTSold: raised when a NFT is sold
- 5 functions:
  - createNFT: external / This function allows to create NFTs inside a collection and mint it directly. Returns the new id of the NFT that has been minted.
  - setNewPrice: external / This function allows to set the price of the given NFT.
  - buyNFT: external payable / This function allows to transfer the money to the NFT owner and the NFT to the buyer after a direct sale.
  - requestAuction: external / This function allows to initiate an auction by verifying owner and tokenID. Returns a boolean (True if the auction is authorized).
  - closeAuction: external / This function allows to close an auction when the time has expired.
- 1 getter:
  - getURI: This function returns the URI data of the given NFT.

### Auction.sol

Description:
This smart contract manages the sales of NFTs by auction.

Dependencies:
None

This smart contract contains:

- 3 events:
  - HighestBidIncreased: raised when the bid has increased
  - AuctionStarted: raised when the auction has started
  - AuctionClosed: raised when the auction has finished
- 5 functions:
  - setAuctionValidity: internal / This function confirms a valid auction request.
  - startAuction: external payable / This function allows to start a new auction.
  - bid: external payable / This function allows to place a new bid.
  - withdrawRefund: external / This function allows a user that placed a bid (not the highest anymore) to get back his funds.
  - endAuction: internal / This function allows to close the auction.
- 7 getters:
  - checkAuctionTimeExpired: This function allows to check if the auction ended.
  - getCurrentHighestBidder: This function allows to check for the current highest bidder.
  - getCurrentHighestBid: This function allows to check for the current highest bid.
  - getBiddersAmount: This function allows to check for the amount of bidders.
  - isInAuction: This function allows to check if there is an auction in progress for the given NFT.
  - getTotalBid: This function allows to check the total bid of the user calling the message.
  - getPendingRefunds: This function allows to check the total pending refunds of a user, if any.

### CYONToken.sol

Description:
The ERC20 token that is used in our marketplace for direct sales.

Dependencies:

- @openzeppelin/contracts/token/ERC20/ERC20.sol
- @openzeppelin/contracts/token/ERC20/IERC20.sol

This smart contract contains:

- 1 modifier:
  - valueNotZero: require the msg.value to be higher than 0
- 3 functions:
  - swapETHtoCYON: public payable / This function allows to swap ETH to the CYON platform token.
  - swapCYONtoETH: public payable / This function allows to swap the CYON platform token back to ETH.
  - \_safeTransferFrom: private / This function allows to transfer CYON tokens between users.
- 1 getter:
  - getBalanceETH: This function returns the contract balance in ETH.

### NFTCollectionFactory.sol

Description:
This contract serves as a NFT factory, for collections creation.

Dependencies:

- NFTCollections.sol

This smart contract contains:

- 1 event:
  - NFTCollectionCreated: raised when a collection is created.
- 1 function:
  - createNFTCollection: external payable / This function allows to create NFT collections. Returns the new collection contract address.

### NFTCollections.sol

Description:
The NFT Collection based contract, used and deployed in the factory.

Dependencies:

- @openzeppelin/contracts/token/ERC721/ERC721.sol
- @openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol
- @openzeppelin/contracts/utils/Counters.sol

This smart contract contains:

- 2 events:
  - NFTCreated: raised when a NFT is created/minted.
  - NewPriceSet: raised when the price of a NFT has been modified.
- 2 functions:
  - MintNFT: public / Mint a NFT in the collection. Returns the new id of the item that has been minted.
  - setPrice: external / This function allows to set the price of the given NFT.
- 1 getter:
  - getPrice: This function allows to get the sale price of the given NFT (if in sale).

## Unit Tests

5 files:

- Master.js
- Auction.js
- CYONToken.js
- NFTCollectionFactory.js
- NFTCollections.js

### Master.js

- 11 valid tests
- 1 pending test
- 0 invalid tests
- 3 functions out of 6 have been tested.

### Auction.js

- 26 valid tests
- 2 pending tests
- 0 invalid tests
- 11 functions out of 12 have been tested.

### CYONToken.js

- 8 valid tests
- 0 invalid tests
- 4 functions out of 4 have been tested.

### NFTCollectionFactory.js

- 3 valid tests
- 1 pending test
- 0 invalid tests
- 1 functions out of 1 has been tested.

### NFTCollections.js

- 7 valid tests
- 1 pending test
- 0 invalid tests
- 3 functions out of 3 have been tested.

## User Interface (Dapp)
The user interface was written in ReactJs with bootstrap as material design. The entry point of the structure is the file App .js. 
It allows to articulate thanks to the system router of react. 
The different parts of the application are divided into components inside the Components folder.

The interface offers a home page that shows the collections of Nft create on the application. 
Each card is clickable to see the different NFT of the collection, 
a filter is offered to display only some NFT of the collection. 
Each NFT is in turn clickable to see detailed information and possible actions! 

Possible actions are direct buying or participating in an auction. 
In the case of the auction the person may bid in that the auction is not completed. 
If she is not the person with the highest auction she can recover the funds from previous auctions.

The menu bar allows, if the user is logged in, to access the profile, collection creation and Nft creation screens 
on the left. On the right a connection button if necessary, it is replaced by a "swap" button 
that displays a block for exchanging ethers for tokens of the protocol needed for direct purchases.

In the profile section the user can see these collections of which he holds an Nft and the transactions that have carried out. 
When browsing a collection he can see the Nft he owns and he can put them on sale either at auction in eth or directly in cyon. 

## Videos
- https://www.loom.com/share/90125a84c9244da48230ab32f3232711 (presentation of the token, the application, and the creation of an NFT and a collection)
- https://www.loom.com/share/164dafd2be704a87a918cf1c56537124 (sale and purchase of an NFT, with history, and conducting an auction)
- https://www.loom.com/share/42e70e2875634a7c80a8dcaf2ff94af7 (bidding on an NFT and presenting the code)
