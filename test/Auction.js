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

    //------------------------------------------------------------------------------------
    // ------------------------------------Tests------------------------------------------
    //------------------------------------------------------------------------------------
    // This is an internal function, it cannot be tested directly. But it is tested through the functions that call it in the Master.
    describe("setAuctionValidity function test", function () {
        before(async function () {
            CYONTokenInstance = await CYONToken.new('10000000000000000000000000',{from:owner});
            masterInstance = await Master.new(CYONTokenInstance.address, {from:owner});
            auctionInstance = await Auction.new({from:owner});
            nftFactoryInstance = await NFTCollectionFactory.new({from:owner});
            const tx = await nftFactoryInstance.createNFTCollection(nftCollectionName,nftCollectionSymbol,{from:owner});
            const collectionAddress = tx.logs[0].args[1]
            console.log(collectionAddress);
            nftCollectionInstance = await NFTCollections.at(collectionAddress);

            //nftCollectionInstance = await NFTCollections.new(nftCollectionName,nftCollectionSymbol,{from:owner});
            nftCollectionAddress = nftCollectionInstance.address;
            console.log(nftCollectionInstance.address);



        });
        it("should revert when an auction has already started.", async () => {
            const nftTokenID = await masterInstance.createNFT.call(nftCollectionAddress,user1,tokenURI,nftName,nftDescription,nftTag,{ from: user1 }); 
            //const nftTokenID = await nftCollectionInstance.MintNFT.call(user1,user1,tokenURI,nftName,nftDescription,nftTag,CYONTokenInstance.address,0,false,false,{ from: user1 }); 
            console.log(nftTokenID.toString());

            const name = await nftCollectionInstance.name();
            console.log(name.toString());
            const balance = await nftCollectionInstance.balanceOf(user1,{ from: user1 });
            console.log(balance.toString());

            const ownerOf = await nftCollectionInstance.ownerOf(1,{ from: user1 });
            console.log(ownerOf.toString());

            const result = await masterInstance.requestAuction.call(nftCollectionAddress,nftTokenID.toString(),{ from: user1 });
            console.log(result.toString());
            //await auctionInstance.startAuction(nftCollectionAddress,nftTokenID,biddingTime,{ from: owner });
            // Try to call it again (through the Master) and should revert
            //await expectRevert(masterInstance.requestAuction(nftCollectionAddress,nftTokenID,{ from: owner }), 'An auction has already started for this NFT.');
       
        });
    });
});