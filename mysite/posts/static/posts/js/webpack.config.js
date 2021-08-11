const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
module.exports = {
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index_bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|pdf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.svg/,
        type: "asset/inline",
        generator: {
          dataUrl: (content) => {
            content = content.toString();
            return content;
          },
        },
      },
    ],
  },
  devServer: {
    contentBase: "./dist",
    watchContentBase: true,
    hot: true,
    inline: true,
  },
  entry: path.resolve(__dirname, "main.js"),
  plugins: [new HtmlWebpackPlugin()],
};
