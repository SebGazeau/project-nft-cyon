const CYONToken= artifacts.require('CYONToken');
// 10_000_000__000_000_000_000_000_000
module.exports = async function (deployer, accounts) {
    await deployer.deploy(CYONToken, '10000000000000000000000000');
    const instance = await CYONToken.deployed();
    const test =await instance.transfer(instance.address, '10000000000000000000000000');
};