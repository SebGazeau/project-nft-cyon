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

    //const addressCYON = '0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B';

    const nftTokenID = 1;
    const biddingTime = 60;

    const nftCollectionName = 'Collection1';
    const nftCollectionSymbol = 'COL1';
    let nftCollectionAddress;
    const tokenURI = 'Test URI';
    const nftName = 'My first NFT';
    const nftDescription = 'This is my first NFT';
    const nftTag = 'Collectible';


    let auctionInstance;
    let masterInstance;
    let nftFactoryInstance;
    let CYONTokenInstance;
    let nftCollectionInstance;

    //------------------------------------------------------------------------------------
    // ------------------------------------Tests------------------------------------------
    //------------------------------------------------------------------------------------
    // This is an internal function, it cannot be tested directly. But it is tested through the functions that call it in the Master.
    describe("setAuctionValidity function test", function () {
        before(async function () {
            CYONTokenInstance = await CYONToken.new('10000000000000000000000000',{from:owner});
            masterInstance = await Master.new(CYONTokenInstance.address, {from:owner});
            auctionInstance = await Auction.new({from:owner});
            nftCollectionInstance = await NFTCollections.new('Col1','Col1',{from:owner});
            nftFactoryInstance = await NFTCollectionFactory.new({from:owner});
            
            
        });
        it("should revert when an auction has already started.", async () => {
            nftCollectionAddress = nftCollectionInstance.address;

            const test1 = await nftCollectionInstance.MintNFT.call(owner,owner,tokenURI,nftName,nftDescription,nftTag,CYONTokenInstance.address,0,false,false);
            console.log(test1.toString());
            const test2 = await masterInstance.createNFT.call(nftCollectionAddress,owner,tokenURI,nftName,nftDescription,nftTag,{ from: owner }); 
            console.log(test2.toString());
            const test3 = await masterInstance.createNFT.call(nftCollectionAddress,owner,tokenURI,nftName,nftDescription,nftTag,{ from: owner }); 
            console.log(test3.toString());

            const name = await nftCollectionInstance.name();
            console.log(name.toString());
            const balance = await nftCollectionInstance.balanceOf(owner,{ from: owner });
            console.log(balance.toString());
            
            await masterInstance.requestAuction(nftCollectionAddress,new BN(1),{ from: owner });
            //await auctionInstance.startAuction(nftCollectionAddress,nftTokenID,biddingTime,{ from: owner });
            // Try to call it again (through the Master) and should revert
            //await expectRevert(masterInstance.requestAuction(nftCollectionAddress,nftTokenID,{ from: owner }), 'An auction has already started for this NFT.');
       
        });
    });
});