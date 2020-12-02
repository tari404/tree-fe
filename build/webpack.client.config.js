'use strict'

/* */

const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const WorkBoxPlugin = require('workbox-webpack-plugin')
const VueSSRClientPlugin = require('./lib/client.plugin')

const isProd = process.env.NODE_ENV !== 'development'

module.exports = merge(baseConfig, {
  entry: {
    app: './src/entry-client.ts',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  resolve: {
    fallback: {
      https: false,
    },
  },
  plugins: isProd
    ? [
        new VueSSRClientPlugin(),
        new WorkBoxPlugin.GenerateSW({
          swDest: './service-worker.js',
          exclude: [/\.(?:png|jpg|jpeg|svg)$/],
          runtimeCaching: [
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images',
                expiration: {
                  maxEntries: 10,
                },
              },
            },
          ],
        }),
      ]
    : [new VueSSRClientPlugin()],
})
