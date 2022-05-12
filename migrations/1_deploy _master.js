const Master = artifacts.require("Master");
const CYONToken= artifacts.require('CYONToken');
const NFTCollectionFactory= artifacts.require('NFTCollectionFactory');
module.exports = async function(deployer) {
  await deployer.deploy(CYONToken, '10000000000000000000000000');
  const instance = await CYONToken.deployed();
  await instance.transfer(instance.address, '10000000000000000000000000');
  await deployer.deploy(Master, instance.address);
  await deployer.deploy(NFTCollectionFactory);
};
