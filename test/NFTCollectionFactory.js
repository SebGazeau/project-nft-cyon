const NFTCollectionFactory = artifacts.require("./contracts/NFTCollectionFactory.sol");
const {BN, expectRevert, expectEvent} = require('../node_modules/@openzeppelin/test-helpers');
const {expect} = require('chai');

contract('NFTCollectionFactory', accounts => {
    //Address used for test
    const owner = accounts[0];
    let NFTCollectionFactoryInstance;

    describe.skip("### ** **", function () {
        before(async function () {
            NFTCollectionFactoryInstance = await NFTCollectionFactory.new({from:owner});
        });

        it("Test...", async () => {
            await NFTCollectionFactoryInstance.createNFTCollection("Collection 1 Test","Collection 1 Test",{from:owner});

            //await expectRevert(NFTCollectionFactoryInstance.xxx(owner, {from:owner}), "xx");
        });
    });

});