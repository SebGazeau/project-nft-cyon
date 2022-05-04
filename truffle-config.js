// const HDWalletProvider = require('@truffle/hdwallet-provider');
// require('dotenv').config();
const path = require("path");
module.exports = {
  /**
   * $ truffle test --network <network-name>
   */

  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    // kovan: {
    //     provider: () => new HDWalletProvider({
    //       mnemonic: {
    //         phrase: `${process.env.MNEMONIC}`,
    //       },
    //       providerOrUrl: `https://kovan.infura.io/v3/${process.env.INFURA_ID}`
    //   }),
    //   network_id: 42,
    // },

    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.13",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: false,
         runs: 200
       },
      //  evmVersion: "byzantium"
      }
    }
  },
};
