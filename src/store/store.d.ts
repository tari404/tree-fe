import { Store } from 'vuex'
import { State } from '.'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $store: Store<State> & {
      _actions: { [key: string]: Function }
    }
  }
}
