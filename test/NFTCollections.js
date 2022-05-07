const NFTs_Collections = artifacts.require("./contracts/NFTs_Collections.sol");
const {BN, expectRevert, expectEvent} = require('@openzeppelin/test-helpers');
const {expect} = require('chai');

contract('NFTs_Collections', accounts => {
    //Address used for test
    const owner = accounts[0];

    describe("### ** **", function () {
        before(async function () {
            NFTs_CollectionsInstance = await NFTs_Collections.new({from:owner});
        });

        it("Test...", async () => {
            //await NFTs_CollectionsInstance.xxx({from:owner});

            //await expectRevert(NFTs_CollectionsInstance.xxx(owner, {from:owner}), "xx");
        });
    });

});