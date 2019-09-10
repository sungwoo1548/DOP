const dop_contract_test = artifacts.require("dop_contract_test");

module.exports = function(deployer) {
  deployer.deploy(dop_contract_test);
};
