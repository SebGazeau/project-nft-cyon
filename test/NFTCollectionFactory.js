const CYONToken = artifacts.require("./contracts/CYONToken.sol");
const Master = artifacts.require("./contracts/Master.sol");
const Factory = artifacts.require("./contracts/NFTCollectionFactory.sol");
const NFTCollections = artifacts.require("./contracts/NFTCollections.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const {expect} = require('chai');

contract('NFTCollectionFactory', (accounts) => {
	const owner = accounts[0];
	const sendETH = (0.021*10**18);
	const sendCYON = (0.001*10**18);
	let CYONTokenInstance;
	let MasterInstance;
	let FactoryInstance;

	let NFTCollection;
    let addressCollection;
	let NFT1;
	let NFT2;
	let NFT3;
	describe.only("Testing create NFT", () => {
		before(async () => {
			CYONTokenInstance = await CYONToken.new('10000000000000000000000000',{from:owner});
			await CYONTokenInstance.transfer(CYONTokenInstance.address, '10000000000000000000000000');
            MasterInstance = await Master.new(CYONTokenInstance.address,{from:owner});
            FactoryInstance = await Factory.new({from:owner});
		});
		context(('create collection'), () => {
			it("should create a collection", async () => {
				NFTCollection = await FactoryInstance.createNFTCollection('Collection Unit Test','CUT',{from: accounts[1]});
                addressCollection = NFTCollection.logs[0].args._collectionAddress;
				expect(NFTCollection).to.be.ok;
			});
            it.skip("get event NFT Collection Created", async () => {
                expectEvent(NFTCollection, 'NFTCollectionCreated', {_collectionName:'Collection Unit Test', _collectionAddress: addressCollection, _timestamp: '', _creator: accounts[1] });
			});
            it("should create NFT", async () => {
                NFT1 = await MasterInstance.createNFT(addressCollection, accounts[1], 'test hash 1', 'NFT Unit Test 1','NFT for unit test 1','NUT1', {from: accounts[1]});
                NFT2 = await MasterInstance.createNFT(addressCollection, accounts[1], 'test hash 2', 'NFT Unit Test 2','NFT for unit test 2','NUT2', {from: accounts[1]});
                NFT3 = await MasterInstance.createNFT(addressCollection, accounts[1], 'test hash 3', 'NFT Unit Test 3','NFT for unit test 3','NUT3', {from: accounts[1]});
                expect(NFT1).to.be.ok;
			});
            it("owner of NFT", async () => {
                const NFTCollectionInstance = await NFTCollections.at(addressCollection)
                const OwnerNftOne = await NFTCollectionInstance.ownerOf('1');
                const OwnerNftTwo = await NFTCollectionInstance.ownerOf('2');
                const OwnerNftThree = await NFTCollectionInstance.ownerOf('3');
                expect(OwnerNftOne).to.equal(accounts[1]);
                expect(OwnerNftTwo).to.equal(accounts[1]);
                expect(OwnerNftThree).to.equal(accounts[1]);
			});
		})
		
	});
});