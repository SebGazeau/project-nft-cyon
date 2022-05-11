const Master = artifacts.require("./Master.sol");
const CYONToken= artifacts.require('CYONToken');
module.exports = function(deployer) {
  await deployer.deploy(CYONToken, '10000000000000000000000000');
  const instance = await CYONToken.deployed();
  await instance.transfer(instance.address, '10000000000000000000000000');
  deployer.deploy(Master, instance.address);
};
