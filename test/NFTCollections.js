const NFTCollections = artifacts.require("./NFTCollections.sol");
const {BN, expectRevert, expectEvent} = require('../node_modules/@openzeppelin/test-helpers');
const {expect} = require('chai');

contract('NFTCollections', accounts => {
     //Address used for test
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const user3 = accounts[3];
    const user4 = accounts[4];
    const addressZero = '0x0000000000000000000000000000000000000000';
    let NFTCollectionsInstance;

    const nftCollectionName = 'Collection1';
    const nftCollectionSymbol = 'COL1';
    const tokenURI = 'Test URI';
    const nftName = 'My first NFT';
    const nftDescription = 'This is my first NFT';
    const nftTag = 'Collectible';

    describe("### ** **", function () {
        beforeEach(async function () {
            NFTCollectionsInstance = await NFTCollections.new(nftCollectionName,nftCollectionSymbol,{from:owner});
            await NFTCollectionsInstance.MintNFT(owner,owner,tokenURI,nftName,nftDescription,nftTag,user2,0,false,false,{ from: owner }); 
        });

        it("Test...", async () => {
            //await NFTCollectionsInstance.xxx({from:owner});
            //const nftTokenID = await NFTCollectionsInstance.MintNFT.call(owner,owner,tokenURI,nftName,nftDescription,nftTag,user2,0,false,false,{ from: owner }); 
            //console.log(nftTokenID.toString());

            //OK  expect(await NFTCollectionsInstance.tokenURI(1,{from:owner})).to.equal(tokenURI);
            //OK  expect(new BN(await NFTCollectionsInstance.balanceOf(owner,{ from: owner }))).to.be.bignumber.equal(new BN(1));
            expect(await NFTCollectionsInstance.ownerOf(1,{from:owner})).to.equal(owner);

            /*
            const name = await NFTCollectionsInstance.name();
            console.log(name.toString());

            const balance = await NFTCollectionsInstance.balanceOf(owner,{ from: owner });
            console.log(balance.toString());

            //expect(name).to.equal(nftCollectionName);
            expect(new BN(balance)).to.be.bignumber.equal(new BN(1));
/*


            const price = await NFTCollectionsInstance.getPrice(nftTokenID.toString(),{ from: owner });
            console-log(price.toString());

            //await expectRevert(NFTCollectionsInstance.xxx(owner, {from:owner}), "xx");*/
        });
    });

});