'use strict'

/* */

const path = require('path')
const webpack = require('webpack')
const chalk = require('chalk')
const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')

const readFile = (fs, file) => {
  try {
    return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
  } catch (e) {}
}

module.exports = function setupDevServer(app, cb) {
  let bundle, clientManifest, ready

  const readyPromise = new Promise((r) => {
      ready = r
    }),
    update = () => {
      if (bundle && clientManifest) {
        ready()
        cb(bundle, { clientManifest })
      }
    }

  clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())

  const clientCompiler = webpack(clientConfig)
  // prevent webpack-dev-middleware log
  clientCompiler.infrastructureLogger = () => {}
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: '/dist/',
  })

  app.use(devMiddleware)

  clientCompiler.hooks.done.tap('stats', (stats) => {
    stats = stats.toJson()
    stats.errors.forEach((err) => console.error(err))
    stats.warnings.forEach((err) => console.warn(err))
    if (stats.errors.length) return
    console.log(chalk.green('● Client Manifest updated!'))

    clientManifest = JSON.parse(readFile(clientCompiler.outputFileSystem, 'vue-ssr-client-manifest.json'))
    update()
  })

  app.use(require('webpack-hot-middleware')(clientCompiler, { heartbeat: 5000 }))

  const serverCompiler = webpack(serverConfig)
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    if (stats.errors.length) return
    console.log(chalk.cyan('● Server Budle updated!'))

    bundle = JSON.parse(readFile(serverCompiler.outputFileSystem, 'vue-ssr-server-bundle.json'))
    update()
  })

  return readyPromise
}
