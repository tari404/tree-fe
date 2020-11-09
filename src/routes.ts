import Home from '@/pages/Home.vue'
import Node from '@/pages/Node.vue'

export default [
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
]
