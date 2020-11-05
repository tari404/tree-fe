type inputSize = number | string | Array<number | string> | Size

export class Ruler {
  private divider: number[]
  constructor(divider: number[] = []) {
    this.divider = divider
  }

  base(s: inputSize): Size {
    if (s instanceof Size) {
      return s
    } else if (Array.isArray(s)) {
      let i = 0
      const w = window.innerWidth
      while (this.divider[i] && this.divider[i] < w) {
        i++
      }
      return new Size(s[i])
    } else {
      return new Size(s)
    }
  }

  margin(outside: inputSize, inside: inputSize): Size {
    const o = this.base(outside).value()
    const i = this.base(inside).value()
    if (i > o) {
      return new Size(0)
    } else {
      return new Size((o - i) / 2)
    }
  }
}

export class Size {
  private v: number
  private w: number
  private h: number
  constructor(v: string | number, w?: number, h?: number) {
    this.w = w || window.innerWidth
    this.h = h || window.innerHeight
    if (typeof v === 'number') {
      this.v = v
    } else {
      const matchAry = v.toLowerCase().match(/^([\d\.]+)([a-z]{2,3})$/)
      if (!matchAry) {
        throw new Error('invalid size')
      }
      const n = Number(matchAry[1])
      const unit = matchAry[2]
      switch (unit) {
        case 'px':
          this.v = n
          break
        case 'vw':
          this.v = this.w * n * 0.01
          break
        case 'vh':
          this.v = this.h * n * 0.01
          break
        default:
          throw new Error(`unknow unit: ${unit}`)
      }
    }
  }

  public value() {
    return this.v
  }

  public size() {
    return this.v + 'px'
  }

  public add(v: string | number | Size) {
    const s = v instanceof Size ? v : new Size(v, this.w, this.h)
    this.v += s.value()
    return this
  }

  public sub(v: string | number | Size) {
    const s = v instanceof Size ? v : new Size(v, this.w, this.h)
    this.v -= s.value()
    return this
  }
}
