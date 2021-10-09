require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// import { PROJECT_ID } from './config';
// require('dotenv').config();
const fs = require('fs');
const project_id = "de44c9ce897b440bbab04356491fcd5f";
const private_key = fs.readFileSync(".secret").toString();

module.exports = {
  networks: {
    hardhat:{
      chainid: 31337
    },
    mumbai:{
      url: `https://polygon-mumbai.infura.io/v3/${project_id}`,
      accounts: [private_key]
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${project_id}`,
      accounts: [private_key]
    }
  },
  solidity:{
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

// require("@nomiclabs/hardhat-waffle")
// const fs = require('fs')
// const privateKey = fs.readFileSync(".secret").toString().trim() || "01234567890123456789"

// module.exports = {
//   defaultNetwork: "hardhat",
//   networks: {
//     hardhat: {
//       chainId: 1337
//     },
//     mumbai: {
//       url: "https://rpc-mumbai.matic.today",
//       accounts: [privateKey]
//     }
//   },
//   solidity: {
//     version: "0.8.4",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 200
//       }
//     }
//   }
// }