import { State } from '@/store'

export interface Post {
  date: string
  stems: { origin: string; body: string }[]
  leaves: string[]
}

export interface Node {
  body: string
}

declare global {
  interface Window {
    __INITIAL_STATE__?: State
    __INITIALIZED__?: boolean
  }
}
