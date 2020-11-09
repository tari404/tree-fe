import { createSSRApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import routes from './routes'

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
