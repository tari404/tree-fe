import { Ruler } from '@/assets/lib'

import home2node from './home2node'
import errorpage from './errorpage'

export interface transitionInput {
  contentLayer: HTMLElement
  animLayer: HTMLElement
}

type transitionLib = {
  [key: string]:
    | {
        out: (input: transitionInput) => Promise<boolean>
        in: (input: transitionInput) => Promise<boolean>
      }
    | undefined
}

const r = new Ruler([800])

export const defaultOut = (input: transitionInput) => {
  const aL = input.animLayer

  aL.style.transition = 'background-color .15s'
  aL.style.backgroundColor = '#fdfbf8'
  aL.style.opacity = '1'

  return new Promise((resolve) => {
    aL.ontransitionend = (e) => {
      if (e.target !== aL) {
        return
      }
      aL.style.transition = ''
      aL.ontransitionend = null
      resolve(true)
    }
  })
}

export const defaultIn = (input: transitionInput) => {
  const aL = input.animLayer

  aL.style.transition = 'opacity .15s'
  aL.style.opacity = '0'

  return new Promise((resolve) => {
    aL.ontransitionend = (e) => {
      if (e.target !== aL) {
        return
      }
      aL.style.transition = ''
      aL.style.backgroundColor = 'transparent'
      aL.innerHTML = ''
      aL.ontransitionend = null
      resolve(true)
    }
  })
}

export const transitonLib = {
  'Home-Node': home2node(r),
  ErrorPage: errorpage(r),
} as transitionLib
