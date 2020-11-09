'use strict'

/* */

const webpack = require('webpack')
const { merge } = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.config')
const VueSSRServerPlugin = require('./lib/server.plugin')
const registerComponent = require.resolve('./lib/registerComponent')

module.exports = merge(baseConfig, {
  target: 'node',
  entry: './src/entry-server.ts',
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      // This loader registers components for async chunk inferrence
      {
        test: /\.ts$/,
        resourceQuery: /^\?vue/,
        use: registerComponent,
      },
    ],
  },
  externals: nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    allowlist: /\.css$/,
  }),
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new VueSSRServerPlugin(),
  ],
})
