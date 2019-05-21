const merge = require('webpack-merge')
const baseConfig = require('./base.config')
const webpack = require('webpack')
const StartServerPlugin = require('start-server-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = merge(baseConfig, {
  // watch: true,
  devtool: 'sourcemap',
  target: 'node',
  node: {
    __filename: true,
    __dirname: true
  },
  plugins: [
    // new StartServerPlugin('server.js'),
    new webpack.NamedModulesPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new CleanWebpackPlugin(),
    new Dotenv({
      path: './.env.production'
    }),
    new webpack.DefinePlugin({
      'process.env': { BUILD_TARGET: JSON.stringify('server') }
    })
    // new webpack.BannerPlugin({
    //   banner: 'require("source-map-support").install();',
    //   raw: true,
    //   entryOnly: false
    // })
  ],
  mode: 'production',
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@middlewares': path.resolve(__dirname, 'src/api/middlewares/'),
      '@scalars': path.resolve(__dirname, 'src/api/scalars')
    }
  }
})
