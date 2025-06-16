// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.24",
//    networks: {
//     sepolia: {
//       chainId: 11155111,
//       url: 'https://eth-sepolia.g.alchemy.com/v2/lQtnnsSVGsY_7HNuG-WvAOHn1xiVsqOj',
//       accounts: ['b3741e62cb358ed89d2022fd2232424737164e1ed93a4dfff7d6fd265a5c7c9e'],
//     },
//   },
// };

require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {},
    ganache: {
      url: "http://127.0.0.1:7545", // sesuai RPC yang diberika Ganache
      accounts: [ "0x6812ca9884ba1d8f26080b27ef5d1c51c2ed8c1cb3245fdd2bfbf9c1b50ea58a" ],
    },
  },
};

