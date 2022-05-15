const CYONToken = artifacts.require("./contracts/CYONToken.sol");
const Master = artifacts.require("./contracts/Master.sol");
const Factory = artifacts.require("./contracts/NFTCollectionFactory.sol");
const NFTCollection = artifacts.require("./contracts/NFTCollections.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const {expect} = require('chai');

contract('Master', (accounts) => {
	//------------------------------------------------------------------------------------
    // ----------------------------------Variables----------------------------------------
    //------------------------------------------------------------------------------------
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const user3 = accounts[3];
    const user4 = accounts[4];
    const addressZero = '0x0000000000000000000000000000000000000000';

	const biddingTime = 60;

    const nftCollectionName = 'Collection1';
    const nftCollectionSymbol = 'COL1';
    const tokenURI = 'Test URI';
    const nftName = 'My first NFT';
    const nftDescription = 'This is my first NFT';
    const nftTag = 'Collectible';

	let CYONTokenInstance;
	let MasterInstance;

    let masterInstance;
    let nftFactoryInstance;
    let nftCollection;
    let nftCollectionAddress;

	describe("Testing createNFT function", () => {
		beforeEach(async () => {
			CYONTokenInstance = await CYONToken.new('10000000000000000000000000',{from:owner});
			await CYONTokenInstance.transfer(CYONTokenInstance.address, '10000000000000000000000000');
            masterInstance = await Master.new(CYONTokenInstance.address,{from:owner});
            nftFactoryInstance = await Factory.new({from:owner});
			nftCollection = await nftFactoryInstance.createNFTCollection(nftCollectionName,nftCollectionSymbol,{from: user1});
			nftCollectionAddress = nftCollection.logs[0].args._collectionAddress;
		});
		it("should revert when the collection address is set to zero.", async () => {
            await expectRevert(masterInstance.createNFT(addressZero, user1, tokenURI, nftName,nftDescription,nftTag, {from: user1}), 'The collection address needs to be different from zero.');
        });
		it("should revert when the first owner address is set to zero.", async () => {
            await expectRevert(masterInstance.createNFT(nftCollectionAddress, addressZero, tokenURI, nftName,nftDescription,nftTag, {from: user1}), 'The user address needs to be different from zero.');
        });
		it("should create a NFT.", async () => {
			await masterInstance.createNFT(nftCollectionAddress, user1, tokenURI, nftName,nftDescription,nftTag, {from: user1});
			expect(NFTCollection).to.be.ok;
		});
		it("should return 1 as first token ID.", async () => {
            const nftTokenID = await masterInstance.createNFT.call(nftCollectionAddress, user1, tokenURI, nftName,nftDescription,nftTag, {from: user1});
            expect(new BN(nftTokenID)).to.be.bignumber.equal(new BN(1));
        });
	});

	describe("Testing setNewPrice function", () => {
		beforeEach(async () => {
			CYONTokenInstance = await CYONToken.new('10000000000000000000000000',{from:owner});
			await CYONTokenInstance.transfer(CYONTokenInstance.address, '10000000000000000000000000');
            masterInstance = await Master.new(CYONTokenInstance.address,{from:owner});
            nftFactoryInstance = await Factory.new({from:owner});
			nftCollection = await nftFactoryInstance.createNFTCollection(nftCollectionName,nftCollectionSymbol,{from: user1});
			nftCollectionAddress = nftCollection.logs[0].args._collectionAddress;
			await masterInstance.createNFT(nftCollectionAddress, user1, tokenURI, nftName,nftDescription,nftTag, {from: user1});
		});
		it("should revert when the collection address is set to zero.", async () => {
            await expectRevert(masterInstance.setNewPrice(addressZero, 1, 10,{from: user1}), 'The collection address needs to be different from zero.');
        });
		it("should revert when a user different from the owner calls the function.", async () => {
            await expectRevert(masterInstance.setNewPrice(nftCollectionAddress, 1, 10,{from: user2}), 'This NFT does not belong to the current message sender.');
        });
		it("should revert when the price is set to 0.", async () => {
            await expectRevert(masterInstance.setNewPrice(nftCollectionAddress, 1, 0,{from: user1}), 'Please define a selling price higher than zero.');
        });
		it("should set the price.", async () => {
			await masterInstance.setNewPrice(nftCollectionAddress, 1, 10,{from: user1});
			expect(NFTCollection).to.be.ok;
		});
	});

	describe("Testing buyNFT function", () => {
		beforeEach(async () => {
			CYONTokenInstance = await CYONToken.new('10000000000000000000000000',{from:owner});
			await CYONTokenInstance.transfer(CYONTokenInstance.address, '10000000000000000000000000');
            masterInstance = await Master.new(CYONTokenInstance.address,{from:owner});
            nftFactoryInstance = await Factory.new({from:owner});
			nftCollection = await nftFactoryInstance.createNFTCollection(nftCollectionName,nftCollectionSymbol,{from: user1});
			nftCollectionAddress = nftCollection.logs[0].args._collectionAddress;
			await masterInstance.createNFT(nftCollectionAddress, user1, tokenURI, nftName,nftDescription,nftTag, {from: user1});
			await CYONTokenInstance.swapETHtoCYON({from: user1, value: 10});
			await CYONTokenInstance.swapETHtoCYON({from: user2, value: 10});
		});
		it("should revert when the collection address is set to zero.", async () => {
            await expectRevert(masterInstance.buyNFT(addressZero, 1, {from: user2}), 'The collection address needs to be different from zero.');
        });
		it("should revert when the NFT is not for sale.", async () => {
            await expectRevert(masterInstance.buyNFT(nftCollectionAddress, 1, {from: user2}), 'This NFT is not for sale.');
        });
		it("should revert when Master contract did not get the allowance to transfer CYON token.", async () => {
			await masterInstance.setNewPrice(nftCollectionAddress, 1, 10,{from: user1});
            await expectRevert(masterInstance.buyNFT(nftCollectionAddress, 1, {from: user2}), 'CYON token allowance too low.');
        });
		it.skip("should revert when Master contract did not get the allowance to transfer CYON token.", async () => {
			const price = new BN(10);
			await masterInstance.setNewPrice(nftCollectionAddress, 1, price,{from: user1});
            await CYONTokenInstance.approve(masterInstance.address,new BN(1000), {from: user1});
			const oldBalance1 = await CYONTokenInstance.balanceOf(user1);
			await masterInstance.buyNFT(nftCollectionAddress, 1, {from: user2})
			const newBalance1 = await CYONTokenInstance.balanceOf(user1);
			const newBalanceCalc = oldBalance1 + price;
			
			expect(newBalance1).to.be.equal(newBalanceCalc);
        });
	});
});