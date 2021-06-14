const webpack = require('webpack')
const { resolve } = require('path')
const { PROJECT_PATH, shouldOpenAnalyzer, ANALYZER_SERVER_HOST, ANALYZER_SERVER_PORT } = require('../constant')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const glob = require('glob')
const PurgeCSSPlugin = require('purgecss-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new PurgeCSSPlugin({
      paths: glob.sync(`${resolve(PROJECT_PATH, './src')}/**/*.{tsx,scss,less,css}`, { nodir: true }),
      whitelist: ['html', 'body']
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css'
    }),
    new webpack.BannerPlugin({
      raw: true,
      banner: '/** @preserve Powered by ts_react_template */'
    }),
    shouldOpenAnalyzer &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'server', // 开一个本地服务查看报告
        analyzerHost: ANALYZER_SERVER_HOST, // host 设置
        analyzerPort: ANALYZER_SERVER_PORT // 端口号设置
      })
  ].filter(Boolean)
})
