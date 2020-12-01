import { State } from '@/store'

export interface Leaf {
  id: string
  title: string
}

export interface Stem {
  id: string
  title: string
  body: string
}

export interface Post {
  date: string
  stems: Stem[]
  leaves: Leaf[]
}

declare global {
  interface Window {
    __INITIAL_STATE__?: State
    __INITIALIZED__?: boolean
  }
}
