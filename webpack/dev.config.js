const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const StartServerPlugin = require('start-server-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
  entry: ['./src/index'],
  // watch: true,
  devtool: 'sourcemap',
  target: 'node',
  node: {
    __filename: true,
    __dirname: true
  },
  externals: [nodeExternals({ whitelist: ['webpack/hot/poll?1000'] })],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: ['@babel/preset-env'],
              plugins: [
                '@babel/plugin-transform-regenerator',
                '@babel/plugin-transform-runtime'
              ]
            }
          }
        ],
        exclude: ['/node_modules/', '/dist', '/generated']
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'graphql-tag/loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new StartServerPlugin('server.js'),
    new webpack.NamedModulesPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new CleanWebpackPlugin(),
    new Dotenv({
      path: './.env.development'
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
  output: { path: path.join(__dirname, 'dist'), filename: 'server.js' },
  mode: 'production',
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@middlewares': path.resolve(__dirname, 'src/api/middlewares/'),
      '@scalars': path.resolve(__dirname, 'src/api/scalars')
    }
  }
}
