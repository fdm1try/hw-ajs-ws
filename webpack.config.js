const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin } = require('webpack');

module.exports = (env, argv) => {
  const SERVER_HOST = { production: '1', development: 'localhost' };
  const SERVER_PORT = { production: '1', development: '8123' };

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader, 'css-loader',
          ],
        },
        {
          test: /\.png$/,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/,
          type: 'asset',
        },
      ],
    },
    plugins: [
      new DefinePlugin({
        SERVER_HOST: JSON.stringify(SERVER_HOST[argv.mode]),
        SERVER_PORT: JSON.stringify(SERVER_PORT[argv.mode]),
      }),
      new HtmlWebPackPlugin({
        template: './src/index.html',
        filename: './index.html',
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ],
  };
};
