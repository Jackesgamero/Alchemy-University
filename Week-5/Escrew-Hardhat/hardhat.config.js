require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();


module.exports = {
  solidity: "0.8.4",
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_TESTNET_RPC_URL,
    },
  },
  paths: {
    artifacts: "./app/src/artifacts",
  }
};

