const CYONToken = artifacts.require("./contracts/CYONToken.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const {expect} = require('chai');

contract('CYONToken', (accounts) => {
    //Address used for test
    const owner = accounts[0];
    let CYONTokenInstance;
    describe("### ** **", function () {
        before(async function () {
            CYONTokenInstance = await CYONToken.new('10000000000000000000000000',{from:owner});
            // CYONTokenInstance = await deployProxy(CYONToken,['10000000000000000000000000']);
            await CYONTokenInstance.transfer(CYONTokenInstance.address, '10000000000000000000000000')
            // console.log()
        });

        it("Test...", async () => {
            const sendETH = (0.021*10**18);
            const swapETHtoCYON = await CYONTokenInstance.swapETHtoCYON({from: accounts[1], value: new BN(sendETH.toString())});
            console.log('balance cyon after swap ETH to Cyan',(await CYONTokenInstance.balanceOf(accounts[1])).toString())
            expect(swapETHtoCYON).to.be.ok;
        });
        it("Test swapCYONtoETH", async () => {
            const balanceCtrEth = await CYONTokenInstance.getBalanceETH({from:owner});
            console.log('balanceCtrEth', balanceCtrEth.toString());
            const sendCYON = (0.001*10**18);
            console.log((await CYONTokenInstance.balanceOf(accounts[1])).toString())
            console.log(sendCYON)
            await CYONTokenInstance.approve(CYONTokenInstance.address,new BN(sendCYON.toString()), {from: accounts[1]})
            const swapCYONtoETH = await CYONTokenInstance.swapCYONtoETH(new BN(sendCYON.toString()),{from: accounts[1]});
            expect(swapCYONtoETH).to.be.ok;
        });
    });

});21_000_000_000_000_000