const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
//const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: "./src/index.tsx",
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  output: {
    publicPath: "/",
    path: path.join(__dirname, "dist"),
    filename: "bundle.min.js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },
      {
        test: /\.(scss|css)?$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          //MiniCssExtractPlugin.loader,
          "css-loader?modules=true",
          "postcss-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    //new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [autoprefixer()]
      }
    }),
    new CopyPlugin([
      { from: "./src/manifest.json", to: "./dist/manifest.json" },
      {
        from: "./src/firebase-messaging-sw.js",
        to: "./dist/firebase-messaging-sw.js"
      }
    ])
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    historyApiFallback: {
      index: "/"
    }
  }
};
