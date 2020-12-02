const fs = require('fs'),
  path = require('path'),
  resolve = (file) => path.resolve(__dirname, file)

const express = require('express')
const proxy = require('express-http-proxy')
const favicon = require('serve-favicon')

const app = express()

const serialize = require('serialize-javascript')
const { createBundleRenderer } = require('vue-bundle-renderer')
const chalk = require('chalk')

const isProd = process.env.NODE_ENV !== 'development'

function createRenderer(bundle, options) {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      runInNewContext: false,
      vueServerRenderer: require('@vue/server-renderer'),
      basedir: resolve('./dist'),
      publicPath: '/dist/',
    })
  )
}

let renderer, readyPromise

if (isProd) {
  const bundle = require('./dist/vue-ssr-server-bundle.json'),
    clientManifest = require('./dist/vue-ssr-client-manifest.json')

  renderer = createRenderer(bundle, { clientManifest })
} else {
  readyPromise = require('./build/setup-dev-server')(app, (bundle, options) => {
    renderer = createRenderer(bundle, options)
  })
}

const serve = (path, cache) =>
  express.static(resolve(path), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0,
  })

app.use(favicon('./src/assets/logo.png'))
app.use('/dist', serve('./dist', true))
app.use('/static', serve('./static', true))

app.use('/api', proxy('http://localhost:4000/'))

async function render(req, res) {
  const handleError = (err) => {
    if (err.code && typeof err.code === 'number') {
      res.sendStatus(err.code)
    } else {
      res.sendStatus(500)
    }
    console.error(chalk.red(`Error during render: ${req.url}`))
    console.error(err)
  }

  const renderState = (context) => {
    const contextKey = 'state'
    const windowKey = '__INITIAL_STATE__'
    const state = serialize(context[contextKey])
    const autoRemove =
      ';(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());'
    var nonceAttr = context.nonce ? ' nonce="' + context.nonce + '"' : ''
    return context[contextKey]
      ? '<script' + nonceAttr + '>window.' + windowKey + '=' + state + autoRemove + '</script>'
      : ''
  }

  const context = {
    url: req.url,
  }

  const page = await renderer.renderToString(context).catch((err) => {
    handleError(err)
    return ''
  })
  if (!page) {
    return
  }

  let { renderStyles, renderResourceHints, renderScripts } = context

  // TODO: Use loadash template
  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=500,user-scalable=no">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <title>Tree</title>
  <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet">
  ${renderResourceHints()}
  ${renderStyles()}
  </head>
  <body>
    <div id="app">${page}</div>
    ${renderScripts()}
    ${renderState(context)}
  </body>
</html>`

  // print page to file for inspection
  if (!isProd) {
    fs.writeFile('dev/rendered.html', html, (err) => {
      if (err) {
        throw err
      }
    })
  }
  res.setHeader('Content-Type', 'text/html')
  res.send(html)
}

app.get(
  '*',
  isProd
    ? render
    : async (req, res) => {
        await readyPromise

        render(req, res)
      }
)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server started at localhost:${port}`)
})
