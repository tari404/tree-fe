'use strict'

/*  */

const { Compilation } = require('webpack')

const isJS = function (file) {
  return /\.js(\?[^.]+)?$/.test(file)
}

const isCSS = function (file) {
  return /\.css(\?[^.]+)?$/.test(file)
}

const onEmit = function (compiler, name, hook) {
  if (compiler.hooks) {
    // Webpack >= 4.0.0
    compiler.hooks.make.tap(name, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
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

const hash = require('hash-sum')
const uniq = require('lodash.uniq')

const VueSSRClientPlugin = function VueSSRClientPlugin(options) {
  if (options === void 0) options = {}

  this.options = Object.assign(
    {
      filename: 'vue-ssr-client-manifest.json',
    },
    options
  )
}

VueSSRClientPlugin.prototype.apply = function apply(compiler) {
  const this$1 = this

  onEmit(compiler, 'vue-client-plugin', function (compilation) {
    const stats = compilation.getStats().toJson()

    const allFiles = uniq(
      stats.assets.map(function (a) {
        return a.name
      })
    )

    const initialFiles = uniq(
      Object.keys(stats.entrypoints)
        .map(function (name) {
          return stats.entrypoints[name].assets
        })
        .reduce(function (assets, all) {
          return all.concat(assets)
        }, [])
        .map(({ name }) => name)
        .filter(function (file) {
          return isJS(file) || isCSS(file)
        })
    )

    const asyncFiles = allFiles
      .filter(function (file) {
        return isJS(file) || isCSS(file)
      })
      .filter(function (file) {
        return initialFiles.indexOf(file) < 0
      })

    const manifest = {
      publicPath: stats.publicPath,
      all: allFiles,
      initial: initialFiles,
      async: asyncFiles,
      modules: {
        /* [identifier: string]: Array<index: number> */
      },
    }

    const assetModules = stats.modules.filter(function (m) {
      return m.assets.length
    })
    const fileToIndex = function (file) {
      return manifest.all.indexOf(file)
    }
    stats.modules.forEach(function (m) {
      // ignore modules duplicated in multiple chunks
      if (m.chunks.length === 1) {
        const cid = m.chunks[0]
        const chunk = stats.chunks.find(function (c) {
          return c.id === cid
        })
        if (!chunk || !chunk.files) {
          return
        }
        const id = m.identifier.replace(/\s\w+$/, '') // remove appended hash
        const files = (manifest.modules[hash(id)] = chunk.files.map(fileToIndex))
        // find all asset modules associated with the same chunk
        assetModules.forEach(function (m) {
          if (
            m.chunks.some(function (id) {
              return id === cid
            })
          ) {
            files.push.apply(files, m.assets.map(fileToIndex))
          }
        })
      }
    })

    const json = JSON.stringify(manifest, null, 2)
    compilation.assets[this$1.options.filename] = {
      source: function () {
        return json
      },
      size: function () {
        return json.length
      },
    }
  })
}

module.exports = VueSSRClientPlugin
