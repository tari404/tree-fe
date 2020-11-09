'use strict'

/*  */

const { Compilation } = require('webpack')

const isJS = function (file) {
  return /\.js(\?[^.]+)?$/.test(file)
}

const onEmit = function (compiler, name, hook) {
  if (compiler.hooks) {
    // Webpack >= 4.0.0
    compiler.hooks.make.tap(name, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name,
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        () => {
          hook(compilation)
        }
      )
    })
  } else {
    // Webpack < 4.0.0
    compiler.plugin('emit', hook)
  }
}

const VueSSRServerPlugin = function VueSSRServerPlugin(options) {
  if (options === void 0) options = {}

  this.options = Object.assign(
    {
      filename: 'vue-ssr-server-bundle.json',
    },
    options
  )
}

VueSSRServerPlugin.prototype.apply = function apply(compiler) {
  const this$1 = this

  onEmit(compiler, 'vue-server-plugin', function (compilation) {
    const stats = compilation.getStats().toJson()
    const entryName = Object.keys(stats.entrypoints)[0]
    const entryInfo = stats.entrypoints[entryName]

    const entryAssets = entryInfo.assets.map(({ name }) => name).filter(isJS)

    if (entryAssets.length > 1) {
      throw new Error(
        'Server-side bundle should have one single entry file. ' +
          'Avoid using CommonsChunkPlugin in the server config.'
      )
    }

    const entry = entryAssets[0]
    if (!entry || typeof entry !== 'string') {
      throw new Error('Entry "' + entryName + '" not found. Did you specify the correct entry option?')
    }

    const bundle = {
      entry: entry,
      files: {},
      maps: {},
    }

    stats.assets.forEach(function (asset) {
      if (isJS(asset.name)) {
        bundle.files[asset.name] = compilation.assets[asset.name].source()
      } else if (asset.name.match(/\.js\.map$/)) {
        bundle.maps[asset.name.replace(/\.map$/, '')] = JSON.parse(compilation.assets[asset.name].source())
      }
      // do not emit anything else for server
      delete compilation.assets[asset.name]
    })

    const json = JSON.stringify(bundle, null, 2)
    const filename = this$1.options.filename

    compilation.assets[filename] = {
      source: function () {
        return json
      },
      size: function () {
        return json.length
      },
    }
  })
}

module.exports = VueSSRServerPlugin
