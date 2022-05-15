const CYONToken = artifacts.require("./contracts/CYONToken.sol");
const Master = artifacts.require("./contracts/Master.sol");
const Factory = artifacts.require("./contracts/NFTCollectionFactory.sol");
const NFTCollection = artifacts.require("./contracts/NFTCollections.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const {expect} = require('chai');

contract('Master', (accounts) => {
	const owner = accounts[0];
	const sendETH = (0.021*10**18);
	const sendCYON = (0.001*10**18);
	let CYONTokenInstance;
	let MasterInstance;
	let FactoryInstance;

	let NFTCollection;
    let addressCollection;
	let swapCYONtoETH;
	describe("Testing create NFT", () => {
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
            it("should create NFT", async () => {
                const NFT = await MasterInstance.createNFT(addressCollection, accounts[1], 'test hash', 'NFT Unit Test','NFT for unit test','NUT', {from: accounts[1]});
                const NFT2 = await MasterInstance.createNFT(addressCollection, accounts[1], 'test hash', 'NFT Unit Test','NFT for unit test','NUT', {from: accounts[1]});
                const NFT3 = await MasterInstance.createNFT(addressCollection, accounts[1], 'test hash', 'NFT Unit Test','NFT for unit test','NUT', {from: accounts[1]});
                console.log()
                expect(NFTCollection).to.be.ok;
			});
            it("should sel a NFT", async () => {
                const NFTCollectionInstance = await NFTCollection.new
                const NFT = await MasterInstance.createNFT(addressCollection, accounts[1], 'test hash', 'NFT Unit Test','NFT for unit test','NUT', {from: accounts[1]});
                expect(NFTCollection).to.be.ok;
			});
		})
		context.skip(('CYON to ETH'), async () => {
			it('should send ETH balance of contract', async () =>{
				const balanceCtrEth = await CYONTokenInstance.getBalanceETH({from:owner});
				expect(balanceCtrEth).to.be.ok;
			})
			it("should swap the tokens", async () => {
				await CYONTokenInstance.approve(CYONTokenInstance.address,new BN(sendCYON.toString()), {from: accounts[1]})
				swapCYONtoETH = await CYONTokenInstance.swapCYONtoETH(new BN(sendCYON.toString()),{from: accounts[1]});
				expect(swapCYONtoETH).to.be.ok;
			});
			it('get event CYONtoETH', () =>{
				expectEvent(swapCYONtoETH, 'CYONtoETH', {balanceCYON: new BN(sendCYON.toString()), userAddress: accounts[1]});
			});
			it('if the nbr of CYON is greater than or equal to 100, revert',async () =>{
				await expectRevert(CYONTokenInstance.swapCYONtoETH(new BN(10),{from: accounts[1]}), 'the amount of CYON must be greater than or equal to 100');
			});
			it('is greater than the requested transfer, revert ',async () =>{
				await expectRevert(CYONTokenInstance.swapCYONtoETH(new BN(sendCYON.toString()),{from: accounts[1]}), 'Token 2 allowance too low');
			});
		})
	});
});