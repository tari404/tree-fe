import { createSSRApp } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from './App.vue'
import { SSRContext } from './assets/types'
import routes from './routes'

export default async (ssrContext: SSRContext) => {
  const app = createSSRApp(App)
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })
  app.use(router)
  const { url } = ssrContext

  router.push(url)

  await router.isReady()

  ssrContext.state = { hello: 'world' }

  return app
}
