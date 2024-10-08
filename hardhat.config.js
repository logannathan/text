
// require("@nomicfoundation/hardhat-toolbox");

// module.exports = {
//   solidity: "0.8.19",
//   networks: {
//     hardhat: {
//       chainId: 1337, // Đảm bảo đúng cú pháp: chainId
//     },
//   },
// };

require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Tối ưu hóa code Solidity để giảm chi phí gas
      },
    },
  },
  networks: {
    hardhat: {
      chainId:1337, // Mạng mặc định của Hardhat
    },
    localhost: {
      url: "http://127.0.0.1:8545", // URL để kết nối với mạng localhost
      chainId: 1337, // Đảm bảo chainId khớp với mạng localhost của bạn (1337 là chainId mặc định)
    },
  },
};



