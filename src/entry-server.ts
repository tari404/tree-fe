import { createSSRApp } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from './App.vue'
import routes from './routes'

export default async (ssrContext: any) => {
  const app = createSSRApp(App)
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })
  app.use(router)
  const { url } = ssrContext

  router.push(url)

  await router.isReady()

  return app
}
