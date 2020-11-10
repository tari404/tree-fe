import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'

import ErrorPage from '@/pages/ErrorPage.vue'
import Home from '@/pages/Home.vue'
import Node from '@/pages/Node.vue'

const isServer = typeof window === 'undefined'

let history = isServer ? createMemoryHistory() : createWebHistory()

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/n/:id',
    name: 'Node',
    component: Node,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'ErrorPage',
    component: ErrorPage,
  },
]

export default function () {
  return createRouter({ routes, history })
}
