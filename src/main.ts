import { createSSRApp } from 'vue'
import createRouter from './router'
import createStore from './store'
import App from './App.vue'

export default function () {
  const app = createSSRApp(App),
    router = createRouter(),
    store = createStore()

  app.use(router).use(store)

  return { app, router, store }
}
