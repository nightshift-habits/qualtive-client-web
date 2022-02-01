const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: path.resolve(__dirname, "src", "index.ts"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  mode: "development",
  resolve: {
    extensions: [".js", ".ts"],
    modules: [path.join(__dirname, "./src"), "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: path.resolve(__dirname, "node_modules/"),
        use: ["ts-loader"],
      },
      {
        test: /\.html/,
        use: ["html-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
    }),
  ],
  devServer: {
    host: "0.0.0.0",
    port: 3030,
    historyApiFallback: true,
    hot: true,
  },
}
