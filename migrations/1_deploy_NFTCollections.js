var Migrations = artifacts.require("./NFTCollections.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
