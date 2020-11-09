import createApp from './main'

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
  window.__INITIAL_STATE__ = undefined

  // to skip page transition animation
  setTimeout(() => {
    window.__INITIALIZED__ = true
  }, 500)
}

router.isReady().then(() => {
  app.mount('#app', true)
})
