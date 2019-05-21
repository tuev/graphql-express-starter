const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: ['./src/index'],
  // externals: [nodeExternals({ whitelist: ['webpack/hot/poll?1000'] })],
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
  output: { path: path.join(__dirname, 'dist'), filename: 'server.js' },
  plugins: [new webpack.EnvironmentPlugin(['NODE_ENV'])],
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@middlewares': path.resolve(__dirname, 'src/api/middlewares/'),
      '@scalars': path.resolve(__dirname, 'src/api/scalars')
    }
  }
}
