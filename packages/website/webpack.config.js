/*
This is a minimal webpack config file for using python-wasm in a frontend
Javascript project that uses WebPack 5 (and Typescript).   There are two
small things that you must:

- The NodePolyfillPlugin is needed because python-wasm
  uses memfs, which requires several polyfilled libraries.

- The wasm and zip asset/resource rules are needed so python-wasm
  can import the python wasm binary and zip filesystem.

*/

const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const mode =
  process.env.NODE_ENV == "production" ? "production" : "development";

module.exports = {
  mode,
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  output: {
    filename: "[name].bundle.js",
    path: resolve(__dirname, "dist"),
    clean: true,
    filename:
      mode == "production" ? "[name]-[chunkhash].js" : "[id]-[chunkhash].js",
    chunkFilename:
      mode == "production" ? "[chunkhash].js" : "[id]-[chunkhash].js",
    hashFunction: "sha256",
  },
  plugins: [
    new NodePolyfillPlugin() /* required for python-wasm */,
    new HtmlWebpackPlugin({
      title: "python-wasm Terminal",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.wasm$|\.zip$/ /* required for python-wasm */,
        type: "asset/resource",
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    // allowedHosts: 'all',
    // host: '0.0.0.0',
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
};
