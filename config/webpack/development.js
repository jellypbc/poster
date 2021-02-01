/* eslint-disable @typescript-eslint/no-var-requires */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const environment = require('./environment')

module.exports = environment.toWebpackConfig()

// compile time type checking
// const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
// const path = require("path");

// environment.plugins.append(
//   "ForkTsCheckerWebpackPlugin",
//   new ForkTsCheckerWebpackPlugin({
//     typescript: {
//       configFile: path.resolve(__dirname, "../../tsconfig.json"),
//     },
//     async: false,
//   })
// );
