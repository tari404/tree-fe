import createApp from './main'
import { State } from './store'

export interface SSRContext {
  url: string
  state: State
}

export default async (ssrContext: SSRContext) => {
  const { app, router, store } = createApp()
  const { url } = ssrContext

  router.push(url)

  await router.isReady()

  const matched = router.currentRoute.value.matched
  if (!matched.length) {
    throw { code: 404 }
  }

  ssrContext.state = store.state

  return app
}
