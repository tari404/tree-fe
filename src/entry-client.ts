import { createSSRApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { SSRContext } from './assets/types'
import routes from './routes'

export type Context = Window & { __INITIAL_STATE__?: SSRContext }

const w = (window as any) as Context
if (w.__INITIAL_STATE__) {
  console.log(w.__INITIAL_STATE__)
}

const app = createSSRApp(App)
const router = createRouter({
  history: createWebHistory(),
  routes,
})
app.use(router)
;(async (r, a) => {
  await r.isReady()
  a.mount('#app', true)
})(router, app)
