import { createStore } from 'vuex'
import { Post, Stem } from '@/types'
import { getPanel, getStem, hello } from '@/fetcher'

type RouteParams = Record<string, string | string[]>

export interface State {
  posts: Post[]
  node?: Stem

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
          date: p.day.match(/\d+-\d+$/)[0],
          stems: p.stems.nodes,
          leaves: p.leaves.nodes,
        }))
      },
      async PRELOAD_PAGE_STEM({ state }, params: RouteParams) {
        const id = params.id
        if (typeof id === 'string') {
          const stem = await getStem(id)
          if (stem) {
            state.node = stem
          }
        }
      },
    },
  })
}
