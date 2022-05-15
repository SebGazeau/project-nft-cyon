const CYONToken = artifacts.require("./contracts/CYONToken.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const {expect} = require('chai');

contract('CYONToken', (accounts) => {
	const owner = accounts[0];
	const sendETH = (0.021*10**18);
	const sendCYON = (0.001*10**18);
	let CYONTokenInstance;
	let swapETHtoCYON;
	let swapCYONtoETH;
	describe("Testing Swap token", () => {
		before(async () => {
			CYONTokenInstance = await CYONToken.new('10000000000000000000000000',{from:owner});
			await CYONTokenInstance.transfer(CYONTokenInstance.address, '10000000000000000000000000')
		});
		context(('ETH to CYON'), () => {
			it("should swap the tokens ", async () => {
				swapETHtoCYON = await CYONTokenInstance.swapETHtoCYON({from: accounts[1], value: new BN(sendETH.toString())});
				expect(swapETHtoCYON).to.be.ok;
			});
			it('get event ETHtoCYON', () =>{
				expectEvent(swapETHtoCYON, 'ETHtoCYON', {balanceETH: new BN(sendETH.toString()), userAddress: accounts[1]});
			});
			it('if the value is different from 0',async () =>{
				await expectRevert(CYONTokenInstance.swapETHtoCYON({from: accounts[1], value: 0}), 'the amount must be greater than 0');
			});
		})
		context(('CYON to ETH'), async () => {
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