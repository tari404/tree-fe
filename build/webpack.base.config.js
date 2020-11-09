'use strict'

/* */

const webpack = require('webpack')
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const isProd = process.env.NODE_ENV !== 'development'

module.exports = {
  mode: isProd ? 'production' : 'development',
  // devtool: isProd ? 'source-map' : 'eval-cheap-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: isProd ? '[name].[chunkhash].js' : '[name].js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      vue: 'vue/dist/vue.runtime.esm-bundler.js',
    },
    extensions: ['.vue', '.ts', '.js'],
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            envName: isProd ? 'prod' : 'dev',
          },
        },
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: ['\\.vue$'],
              happyPackMode: false,
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: require.resolve('vue-loader'),
          },
        ],
      },
      {
        test: /\.styl(us)?$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './dist',
            },
          },
          'css-loader',
          'postcss-loader',
          'stylus-loader',
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 4096,
            fallback: {
              loader: 'file-loader',
              options: {
                publicPath: '/dist/',
                name: 'img/[name].[hash:8].[ext]',
              },
            },
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  publicPath: '/dist/',
                  name: 'fonts/[name].[hash:8].[ext]',
                },
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: isProd ? true : false,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        parallel: true,
      }),
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new ESLintPlugin(),
    new MiniCssExtractPlugin({
      filename: isProd ? 'css/[name].[contenthash:8].css' : '[name].css',
      chunkFilename: isProd ? 'css/[name].[contenthash:8].chunk.css' : '[name].chunk.css',
    }),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
    }),
  ],
}
