const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
//const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.tsx',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.min.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.(scss|css)?$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    //MiniCssExtractPlugin.loader,
                    'css-loader?modules=true',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
      //new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html'
      }),
      new webpack.LoaderOptionsPlugin({
          options: {
              postcss: [
                  autoprefixer()
              ]
          }
      })
    ],
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000
    }
}
