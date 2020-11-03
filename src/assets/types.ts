export interface Post {
  date: string
  stems: { origin: string; body: string }[]
  leaves: string[]
}

export interface TransitionElement {
  type: string
  x: number
  y: number
  width: number
  height: number
}

export interface MaskAttribute {
  x: number
  y: number
  width: number
  height: number
}

export interface TransitionOption {
  action: string
  mask?: { [key: string]: MaskAttribute }
}
