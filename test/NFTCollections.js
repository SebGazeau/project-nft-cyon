const NFTCollections = artifacts.require("./NFTCollections.sol");
const {BN, expectRevert, expectEvent} = require('../node_modules/@openzeppelin/test-helpers');
const {expect} = require('chai');

contract('NFTCollections', accounts => {
    //------------------------------------------------------------------------------------
    // ----------------------------------Variables----------------------------------------
    //------------------------------------------------------------------------------------
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    let NFTCollectionsInstance;

    const nftCollectionName = 'Collection1';
    const nftCollectionSymbol = 'COL1';
    const tokenURI = 'Test URI';
    const nftName = 'My first NFT';
    const nftDescription = 'This is my first NFT';
    const nftTag = 'Collectible';

    //------------------------------------------------------------------------------------
    // ------------------------------------Tests------------------------------------------
    //------------------------------------------------------------------------------------
    describe("MintNFT function test", function () {
        beforeEach(async function () {
            NFTCollectionsInstance = await NFTCollections.new(nftCollectionName,nftCollectionSymbol,{from:owner});
        });
        it("should return 1 as first token ID.", async () => {
            const nftTokenID = await NFTCollectionsInstance.MintNFT.call(owner,owner,tokenURI,nftName,nftDescription,nftTag,user2,0,false,false,{ from: owner });
            console.log(nftTokenID.toString());
            expect(new BN(nftTokenID)).to.be.bignumber.equal(new BN(1));
        });
        it("should return 2 as second token ID.", async () => {
            await NFTCollectionsInstance.MintNFT(owner,owner,tokenURI,nftName,nftDescription,nftTag,user2,0,false,false,{ from: owner });
            const nftTokenID = await NFTCollectionsInstance.MintNFT.call(owner,owner,tokenURI,nftName,nftDescription,nftTag,user2,0,false,false,{ from: owner });
            console.log(nftTokenID.toString());
            expect(new BN(nftTokenID)).to.be.bignumber.equal(new BN(2));
        });
        it("should mint the NFT to the correct owner.", async () => {
            await NFTCollectionsInstance.MintNFT(user1,owner,tokenURI,nftName,nftDescription,nftTag,user2,0,false,false,{ from: owner });
            expect(await NFTCollectionsInstance.ownerOf(1,{from:owner})).to.equal(user1);
        });
        it("should update the balance of the owner.", async () => {
            await NFTCollectionsInstance.MintNFT(user1,owner,tokenURI,nftName,nftDescription,nftTag,user2,0,false,false,{ from: owner });
            expect(new BN(await NFTCollectionsInstance.balanceOf(user1,{ from: owner }))).to.be.bignumber.equal(new BN(1));
        });
        it("should send the URI after the mint.", async () => {
            await NFTCollectionsInstance.MintNFT(owner,owner,tokenURI,nftName,nftDescription,nftTag,user2,0,false,false,{ from: owner });
            expect(await NFTCollectionsInstance.tokenURI(1,{from:owner})).to.equal(tokenURI);
        });
        it.skip("should raise an event when a NFT is created.", async () => {
            const findEvent = await NFTCollectionsInstance.MintNFT(owner,owner,tokenURI,nftName,nftDescription,nftTag,user2,0,false,false,{ from: owner });
            console.log(findEvent);
            expectEvent(findEvent,"NFTCreated" ,{_collectionName: nftCollectionName, _collectionAddress: NFTCollectionsInstance.address, _tokenID: new BN(1), _collectionData: {name: nftName, description: nftDescription, tag: nftTag, tokenAddress: user2, price: new BN(0), favorite: false, isAuctionable: false},_creator: owner});
        }); 
        
    });
    describe("setPrice function test", function () {
        before(async function () {
            NFTCollectionsInstance = await NFTCollections.new(nftCollectionName,nftCollectionSymbol,{from:owner});
            await NFTCollectionsInstance.MintNFT(owner,owner,tokenURI,nftName,nftDescription,nftTag,user2,0,false,false,{ from: owner });
        });
        it("should raise an event when the price is modified.", async () => {
            const price = new BN(10);
            const findEvent = await NFTCollectionsInstance.setPrice(1,price,{from:owner});
            expectEvent(findEvent,"NewPriceSet" ,{_collectionName: nftCollectionName, _collectionAddress: NFTCollectionsInstance.address, _tokenID: new BN(1), _price: price});
        }); 
    });
    describe("getPrice function test", function () {
        before(async function () {
            NFTCollectionsInstance = await NFTCollections.new(nftCollectionName,nftCollectionSymbol,{from:owner});
            await NFTCollectionsInstance.MintNFT(owner,owner,tokenURI,nftName,nftDescription,nftTag,user2,0,false,false,{ from: owner });
        });
        it("should return the correct price (10).", async () => {
            const price = new BN(10);
            await NFTCollectionsInstance.setPrice(1,price,{from:owner});
            const result = await NFTCollectionsInstance.getPrice.call(1,{from:owner})
            expect(new BN(result)).to.be.bignumber.equal(new BN(price));
        }); 
    });
});