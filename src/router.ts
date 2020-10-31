import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/pages/Home.vue'
import Node from '@/pages/Node.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
  ],
})

export default router
