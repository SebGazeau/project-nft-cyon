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
- Unit testing for Master and Auction
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
- 6 getters:
  - checkAuctionTimeExpired: This function allows to check if the auction ended.
  - getCurrentHighestBidder: This function allows to check for the current highest bidder.
  - getCurrentHighestBid: This function allows to check for the current highest bid.
  - getBiddersAmount: This function allows to check for the amount of bidders.
  - isInAuction: This function allows to check if there is an auction in progress for the given NFT.
  - getTotalBid: This function allows to check the total bid of the user calling the message.

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

- xx valid tests
- xx invalid tests
- xx functions out of xx have been tested.

5 files:

- Master.js
- Auction.js
- CYONToken.js
- NFTCollectionFactory.js
- NFTCollections.js

## User Interface (Dapp)

Video:
