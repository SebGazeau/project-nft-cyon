const NFTCollections = artifacts.require("./contracts/NFTCollections.sol");
const {BN, expectRevert, expectEvent} = require('../node_modules/@openzeppelin/test-helpers');
const {expect} = require('chai');

contract('NFTCollections', accounts => {
     //Address used for test
    const owner = accounts[0];
    let NFTCollectionsInstance;

    describe.skip("### ** **", function () {
        before(async function () {
            NFTCollectionsInstance = await NFTCollections.new({from:owner});
        });

        it("Test...", async () => {
            //await NFTCollectionsInstance.xxx({from:owner});

            //await expectRevert(NFTCollectionsInstance.xxx(owner, {from:owner}), "xx");
        });
    });

});