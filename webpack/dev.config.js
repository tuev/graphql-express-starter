const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const StartServerPlugin = require('start-server-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
  entry: ['./src/index'],
  target: 'node',
  node: {
    __filename: true,
    __dirname: true
  },
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
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new Dotenv({
      path: './.env.development'
    }),
    new webpack.DefinePlugin({
      'process.env': { BUILD_TARGET: JSON.stringify('server') }
    })
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
