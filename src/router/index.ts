import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'

import ErrorPage from '@/pages/ErrorPage.vue'
import Home from '@/pages/Home.vue'
import Node from '@/pages/Node.vue'
import Publish from '@/pages/Publish.vue'

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
    path: '/p',
    name: 'Publish',
    component: Publish,
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
