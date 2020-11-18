import { Ruler } from '@/assets/lib'

import home2node from './home2node'
import home2publish from './home2publish'
import errorpage from './errorpage'

export interface transitionInput {
  contentLayer: HTMLElement
  animLayer: HTMLElement
}

type Optional<T> = { [K in keyof T]?: T[K] }

type transitionLib = {
  [key: string]:
    | {
        out: (input: transitionInput) => Promise<boolean>
        in: (input: transitionInput) => Promise<boolean>
      }
    | undefined
}

const r = new Ruler([800])

export const decorate = (el: HTMLElement, style: Optional<CSSStyleDeclaration>) => {
  for (const key in style) {
    el.style[key] = style[key]!
  }
}

export const defaultOut = (input: transitionInput) => {
  const aL = input.animLayer

  decorate(aL, { transition: 'opacity .15s', backgroundColor: '#fdfbf8', opacity: '1' })

  return new Promise((resolve) => {
    aL.ontransitionend = (e) => {
      if (e.target !== aL) {
        return
      }
      decorate(aL, { transition: '' })
      aL.ontransitionend = null
      resolve(true)
    }
  })
}

export const defaultIn = (input: transitionInput) => {
  const aL = input.animLayer

  decorate(aL, { transition: 'opacity .15s', opacity: '0' })

  return new Promise((resolve) => {
    aL.ontransitionend = (e) => {
      if (e.target !== aL) {
        return
      }
      decorate(aL, { transition: '', backgroundColor: 'transparent' })
      aL.innerHTML = ''
      aL.ontransitionend = null
      resolve(true)
    }
  })
}

export const transitonLib = {
  'Home-Node': home2node(r),
  'Home-Publish': home2publish(r),
  ErrorPage: errorpage(r),
} as transitionLib
