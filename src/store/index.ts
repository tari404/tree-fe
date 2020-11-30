import { createStore } from 'vuex'
import { Post, Node } from '@/types'
import { getPanel, hello } from '@/fetcher'

const testPosts: Post[] = [
  {
    date: '10.5',
    stems: [
      {
        origin: 'glsl中noice库函数的工作原理',
        body: `初步了解了\`Perlin Noise\`和\`Simplex Noise\`算法的基本概念和步骤：已知坐标->定位与其相邻的若干顶点->获得顶点伪随机梯度值->插值获得坐标的具体值。目前对于每一步计算时的具体参数的推导，以及计算生成随机梯度的算法没有理解透彻。计划做一些实际的demo来直观的看到每一步的计算对于最终结果的影响。`,
      },
      {
        origin: 'three.js库中包含的UnrealBloomPass是如何在后期产生绚丽的发光效果的',
        body: `知道问题后解决方案就很清晰了，在使用CDN优化three.js库加载速度的情况下，应该从\`three/examples/js/\`目录下引入其他资源，使其在全局的THREE上获取必要的依赖并注入。之前错误的CDN、modules混用的做法不仅导致了bug的出现，也徒增了打包的js文件大小。`,
      },
    ],
    leaves: ['理解并能够复写一个simplex noise算法'],
  },
  {
    date: '10.4',
    stems: [
      {
        origin: 'glsl中noice库函数的工作原理',
        body: `在混用了CDN和modules来进行\`three.js\`的开发时，出现了从modules里引入的\`RawShaderMaterial\`可用，但是从CDN里引入的\`RawShaderMaterial\`工作不正常的问题。`,
      },
    ],
    leaves: ['glsl中noice库函数的工作原理', 'three.js库中包含的UnrealBloomPass是如何在后期产生绚丽的发光效果的'],
  },
]
for (let i = 0; i < 2; i++) {
  testPosts.push(...testPosts)
}

export interface State {
  posts: Post[]
  node?: Node

  memoryStore: {
    homePageScrollY: number
  }
}

const state = () => {
  const s: State = {
    posts: [],
    node: undefined,
    memoryStore: {
      homePageScrollY: 0,
    },
  }
  return s
}

export default function () {
  return createStore({
    state,
    getters: {},
    mutations: {
      STORE_HOMEPAGE_SCROLLY(state, y: number) {
        state.memoryStore.homePageScrollY = y
      },
    },
    actions: {
      async HELLO() {
        const info = await hello()
        return info
      },
      async PRELOAD_PAGE_HOME({ state }) {
        const panel = await getPanel()
        state.posts = panel.posts.map((p: any) => ({
          date: p.day,
          stems: p.stems.nodes.map((n: any) => ({
            origin: n.title,
            body: n.body,
          })),
          leaves: p.leaves.nodes.map((l: any) => l.title),
        }))
      },
      async PRELOAD_PAGE_NODE({ state }) {
        const node = await new Promise((r: (p: Node) => void) => {
          setTimeout(() => {
            r(testPosts[0].stems[0])
          }, Math.random() * 0 + 0)
        })
        state.node = node
      },
    },
  })
}
