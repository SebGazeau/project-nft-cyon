const Auction = artifacts.require("./contracts/Auction.sol");
const Master = artifacts.require("./contracts/Master");
const NFTCollectionFactory = artifacts.require("./contracts/NFTCollectionFactory");
const CYONToken = artifacts.require("./contracts/CYONToken.sol");
const NFTCollections = artifacts.require("./contracts/NFTCollections");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('Auction', accounts => {
    //------------------------------------------------------------------------------------
    // ----------------------------------Variables----------------------------------------
    //------------------------------------------------------------------------------------
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const user3 = accounts[3];
    const user4 = accounts[4];
    const addressZero = '0x0000000000000000000000000000000000000000';

    //const nftTokenID = 1;
    const biddingTime = 60;

    const nftCollectionName = 'Collection1';
    const nftCollectionSymbol = 'COL1';
    const tokenURI = 'Test URI';
    const nftName = 'My first NFT';
    const nftDescription = 'This is my first NFT';
    const nftTag = 'Collectible';

    let auctionInstance;
    let masterInstance;
    let nftFactoryInstance;
    let CYONTokenInstance;
    let nftCollectionInstance;
    let nftCollectionAddress;
    let nftTokenID;

    //------------------------------------------------------------------------------------
    // ------------------------------------Tests------------------------------------------
    //------------------------------------------------------------------------------------
    // This is an internal function, it cannot be tested directly. But it is tested through the functions that call it in the Master.
    describe.skip("setAuctionValidity function test", function () {
        before(async function () {
            CYONTokenInstance = await CYONToken.new('10000000000000000000000000',{from:owner});
            masterInstance = await Master.new(CYONTokenInstance.address, {from:owner});
            auctionInstance = await Auction.new({from:owner});
            nftFactoryInstance = await NFTCollectionFactory.new({from:owner});
            
            /*
            const tx = await nftFactoryInstance.createNFTCollection(nftCollectionName,nftCollectionSymbol,{from:owner});
            const collectionAddress = tx.logs[0].args[1];
            console.log(collectionAddress);
            nftCollectionInstance = await NFTCollections.at(collectionAddress);*/
            
            nftCollectionInstance = await NFTCollections.new(nftCollectionName,nftCollectionSymbol,{from:owner});
            nftCollectionAddress = nftCollectionInstance.address;
            
            console.log(nftCollectionInstance.address);

            nftTokenID = await nftCollectionInstance.MintNFT(user1,user1,tokenURI,nftName,nftDescription,nftTag,CYONTokenInstance.address,0,false,false,{ from: user1 }); 
            console.log(nftTokenID.toString());

            const result = await masterInstance.requestAuction(nftCollectionAddress,1,{ from: user1 });
            console.log(result.toString());

            await auctionInstance.startAuction(nftCollectionAddress,1,biddingTime,{ from: user1 });

           /* const isAuction = await auctionInstance.isInAuction(nftCollectionAddress,1,{ from: user1 });
            console.log(isAuction.toString());*/
        });
        it("should revert when an auction has already started.", async () => {
            /*const ownerOf = await nftCollectionInstance.ownerOf(1,{ from: user1 });
            console.log(ownerOf.toString());*/
            // Try to call it again (through the Master) and should revert
            await expectRevert(masterInstance.requestAuction(nftCollectionAddress,1,{ from: user1 }), 'An auction has already started for this NFT.');
       
        });
    });

    describe.skip("startAuction function test", function () {
        before(async function () {
            CYONTokenInstance = await CYONToken.new('10000000000000000000000000',{from:owner});
            masterInstance = await Master.new(CYONTokenInstance.address, {from:owner});
            auctionInstance = await Auction.new({from:owner});
            nftFactoryInstance = await NFTCollectionFactory.new({from:owner});
            nftCollectionInstance = await NFTCollections.new(nftCollectionName,nftCollectionSymbol,{from:owner});
            nftCollectionAddress = nftCollectionInstance.address;
            
            await nftCollectionInstance.MintNFT(user1,user1,tokenURI,nftName,nftDescription,nftTag,CYONTokenInstance.address,0,false,false,{ from: user1 });         
        });
        it("should revert when the collection address is set to zero.", async () => {
            await masterInstance.requestAuction(nftCollectionAddress,1,{ from: user1 });
            await expectRevert(auctionInstance.startAuction(addressZero,1,biddingTime,{ from: user1 }), 'The collection address needs to be different from zero.');
        });
        it("should revert when the auction validity has not been verified yet.", async () => {
            await expectRevert(auctionInstance.startAuction(nftCollectionAddress,1,biddingTime,{ from: user1 }), 'The validity of the auction has not been verified, yet');
        });
        it("should revert when an auction has already started.", async () => {
            await masterInstance.requestAuction(nftCollectionAddress,1,{ from: user1 });
            await auctionInstance.startAuction(nftCollectionAddress,1,biddingTime,{ from: user1 });
            await expectRevert(auctionInstance.startAuction(nftCollectionAddress,1,biddingTime,{ from: user1 }), 'An auction has already started for this NFT.');
        });
        it("should revert when the auction time is set to zero.", async () => {
            await masterInstance.requestAuction(nftCollectionAddress,1,{ from: user1 });
            await expectRevert(auctionInstance.startAuction(nftCollectionAddress,1,0,{ from: user1 }), 'Please define an auction higher than zero.');
        });
        it("should return false if the auction time has been properly applied.", async () => {
            await masterInstance.requestAuction(nftCollectionAddress,1,{ from: user1 });
            await auctionInstance.startAuction(nftCollectionAddress,1,biddingTime,{ from: user1 });
            expect(await auctionInstance.checkAuctionTimeExpired(nftCollectionAddress,1,{ from: user1 })).to.be.false;
        });
        it("should the current owner to be the highest bidder.", async () => {
            await masterInstance.requestAuction(nftCollectionAddress,1,{ from: user1 });
            await auctionInstance.startAuction(nftCollectionAddress,1,biddingTime,{ from: user1 });
            expect(await auctionInstance.getCurrentHighestBidder(nftCollectionAddress,1,{from:user1})).to.equal(user1);
        });
        it("should the current highest bid equal to 20.", async () => {
            await masterInstance.requestAuction(nftCollectionAddress,1,{ from: user1 });
            await auctionInstance.startAuction(nftCollectionAddress,1,biddingTime,{ from: user1, value: new BN(20)});
            const val = await auctionInstance.getCurrentHighestBid(nftCollectionAddress,1,{from:user1});
            expect(new BN(val)).to.be.bignumber.equal(new BN(20));
        });
        it("should the current total bid of the current owner equal to 20.", async () => {
            await masterInstance.requestAuction(nftCollectionAddress,1,{ from: user1 });
            await auctionInstance.startAuction(nftCollectionAddress,1,biddingTime,{ from: user1, value: new BN(20)});
            const val = await auctionInstance.getTotalBid(nftCollectionAddress,1,{from:user1});
            expect(new BN(val)).to.be.bignumber.equal(new BN(20));
        });
        it("should raise an event when the auction has started.", async () => {
            await masterInstance.requestAuction(nftCollectionAddress,1,{ from: user1 });
            const findEvent = await auctionInstance.startAuction(nftCollectionAddress,1,biddingTime,{ from: user1 });
            expectEvent(findEvent,"AuctionStarted" ,{_nftCollectionAddress: nftCollectionAddress, _nftTokenID: new BN(1), _owner: user1});
        });
    });
    describe("bid function test", function () {
        before(async function () {
            CYONTokenInstance = await CYONToken.new('10000000000000000000000000',{from:owner});
            masterInstance = await Master.new(CYONTokenInstance.address, {from:owner});
            auctionInstance = await Auction.new({from:owner});
            nftFactoryInstance = await NFTCollectionFactory.new({from:owner});
            nftCollectionInstance = await NFTCollections.new(nftCollectionName,nftCollectionSymbol,{from:owner});
            nftCollectionAddress = nftCollectionInstance.address;
            
            await nftCollectionInstance.MintNFT(user1,user1,tokenURI,nftName,nftDescription,nftTag,CYONTokenInstance.address,0,false,false,{ from: user1 });         
            await masterInstance.requestAuction(nftCollectionAddress,1,{ from: user1 });
        });
        it("should revert when the collection address is set to zero.", async () => {
            await auctionInstance.startAuction(nftCollectionAddress,1,biddingTime,{ from: user1 });
            await expectRevert(auctionInstance.bid(addressZero,1,{ from: user2 , value: new BN(20)}), 'The collection address needs to be different from zero.');
        });
        it("should revert when an auction did not start yet.", async () => {
            await expectRevert(auctionInstance.bid(nftCollectionAddress,1,{ from: user2 , value: new BN(20)}), 'There is no auction started for this NFT.');
        });
        it("should revert when the auction already ended.", async () => {
            await auctionInstance.startAuction(nftCollectionAddress,1,1,{ from: user1 });
            // Create timeout 20s
            await expectRevert(auctionInstance.bid(nftCollectionAddress,1,{ from: user2 , value: new BN(20)}), 'The auction has already ended.');
        });
        it("should revert when the amount of bidders exceeds 1000.", async () => {
            await auctionInstance.startAuction(nftCollectionAddress,1,1,{ from: user1 });
            for (let i = 0; i < 1000; i++) {
                // create random address : tbd
                let addr;
                await auctionInstance.bid(nftCollectionAddress,1,{ from: addr , value: new BN(20+i)})
            }
            await expectRevert(auctionInstance.bid(nftCollectionAddress,1,{ from: user3 , value: new BN(1200)}), 'This auction achieved the maximum amount of bidders.');
        });
        it("should revert when the new bid is equal to the current highest bid.", async () => {
            await auctionInstance.startAuction(nftCollectionAddress,1,1,{ from: user1 });
            await auctionInstance.bid(nftCollectionAddress,1,{ from: user2 , value: new BN(20)});
            await expectRevert(auctionInstance.bid(nftCollectionAddress,1,{ from: user3 , value: new BN(20)}), 'The bid is too low.');
        });
        it("should revert when the new bid is lower than the current highest bid.", async () => {
            await auctionInstance.startAuction(nftCollectionAddress,1,1,{ from: user1 });
            await auctionInstance.bid(nftCollectionAddress,1,{ from: user2 , value: new BN(20)});
            await expectRevert(auctionInstance.bid(nftCollectionAddress,1,{ from: user3 , value: new BN(15)}), 'The bid is too low.');
        });
    });
});