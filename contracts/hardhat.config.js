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
      accounts: [ "0x7cc9067878ac75bd5179e0c77cb94dede1f30ca4ac5fee72f11aa9cc715cf323" ],
    },
    sepolia: {
      chainId: 11155111,
      url: 'https://eth-sepolia.g.alchemy.com/v2/lQtnnsSVGsY_7HNuG-WvAOHn1xiVsqOj',
      accounts: ['18251005caee1ee2204e0d9c916715e8447e74c839957100bdf11e86c45389a9'],
    },
  },
};

