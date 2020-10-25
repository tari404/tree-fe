export class ScrollBarSizeCalculator {
  public effectiveScrollH: number
  public bufferH: number
  public scrollBarH: number
  public scrollBarBufferH: number

  private k: number
  private l: number

  constructor(a: number, b: number, c: number, d: number) {
    this.effectiveScrollH = a
    this.bufferH = b
    this.scrollBarH = c
    this.scrollBarBufferH = d

    this.k = a / c
    this.l = b / d
  }

  public get scrollable() {
    return this.effectiveScrollH > 0
  }

  public updateSize(eScrollHeight: number, scrollBarHeight: number) {
    this.effectiveScrollH = eScrollHeight
    this.scrollBarH = scrollBarHeight
    this.k = eScrollHeight / scrollBarHeight
  }

  public trim(offsetY: number) {
    return Math.max(0, Math.min(offsetY, this.effectiveScrollH))
  }

  public a2a(offsetY: number) {
    if (offsetY < 0) {
      return Math.max(offsetY, -this.bufferH)
    } else if (offsetY > this.effectiveScrollH) {
      return Math.min(offsetY, this.bufferH + this.effectiveScrollH)
    } else {
      return offsetY
    }
  }

  public a2b(offsetY: number) {
    if (!this.scrollable) {
      return 0
    }
    if (offsetY < 0) {
      return Math.max(offsetY, -this.bufferH) / this.l
    } else if (offsetY > this.effectiveScrollH) {
      return this.scrollBarH + Math.min(offsetY - this.effectiveScrollH, this.bufferH) / this.l
    } else {
      return offsetY / this.k
    }
  }

  public b2a(scrollY: number) {
    if (!this.scrollable) {
      return 0
    }
    if (scrollY < 0) {
      return Math.max(scrollY, -this.scrollBarBufferH) * this.l || 0
    } else if (scrollY > this.scrollBarH) {
      return this.effectiveScrollH + Math.min(scrollY - this.scrollBarH, this.scrollBarBufferH) * this.l || 0
    } else {
      return scrollY * this.k
    }
  }
}
