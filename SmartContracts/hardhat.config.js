require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const liskSepoliaAccount = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
      },
      {
        version: "0.4.24",
      },
    ],
  },
  networks: {
    'lisk-sepolia': {
      url: 'https://rpc.sepolia-api.lisk.com',
      accounts: [liskSepoliaAccount],
      gasPrice: 1000000000,
    },
  },
};
