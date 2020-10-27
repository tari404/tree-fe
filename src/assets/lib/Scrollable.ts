interface ScrollBarOptions {
  height?: number
  overflow?: number
}

interface ScrollableOptions {
  bindEventAt?: HTMLElement
  overflow?: number
  onstart?: () => any
  onscroll: (y: number) => any
  onstable?: (y: number) => any
  shakable?: boolean
}

export class ScrollBar {
  private container: Scrollable
  private height: number
  private overflow: number

  constructor(c: Scrollable, options?: ScrollBarOptions) {
    this.container = c
    this.height = options ? options.height || 0 : 0
    this.overflow = options ? options.overflow || 0 : 0
  }

  get y() {
    const c = this.container
    if (c.y < 0) {
      return (Math.max(c.y, -c.overflow) / c.overflow || 1) * this.overflow
    } else if (c.y > c.effectiveScrollH) {
      return this.height + (Math.min(c.y - c.effectiveScrollH, c.overflow) / c.overflow || 1) * this.overflow
    } else {
      return (c.y / c.effectiveScrollH) * this.height
    }
  }

  public setSize(height: number, overflow: number = 0) {
    this.height = height
    this.overflow = overflow
  }

  public setY(y: number, e = 0.2) {
    this.container.setTargetYRelatively(this.y2ry(y), e)
  }

  private y2ry(y: number) {
    if (y < 0) {
      return Math.max(-this.overflow, y) / (this.overflow || 1) // [-1, 0)
    } else if (y > this.height) {
      return 1 + Math.min(this.overflow, y - this.height) / (this.overflow || 1) // (1, 2]
    } else {
      return y / (this.height || 1) // [0, 1]
    }
  }
}

export class Scrollable {
  private el: HTMLElement
  private bindAt: HTMLElement

  public effectiveScrollH = 0
  public overflow: number
  public y = 0

  private v = 0

  private scrollElasticity = 0.1
  private targetY = 0

  private onstart?: () => any
  private onscroll: (y: number) => any
  private onstable?: (y: number) => any

  private onTouch: (this: HTMLElement, ev: TouchEvent) => any
  private onTouchMove: (this: HTMLElement, ev: TouchEvent) => any
  private onTouchEnd: (this: HTMLElement) => any

  private onWheel: (this: HTMLElement, ev: WheelEvent) => any

  private update: (timer: number) => any

  private shakable = true

  private stableTimer = 0
  private raf = 0
  private lastFrame = 0
  private running = false

  constructor(target: HTMLElement, options: ScrollableOptions) {
    this.el = target
    this.bindAt = options.bindEventAt || target

    this.update = (timer: number) => {
      const dt = this.lastFrame ? timer - this.lastFrame : 16
      this.lastFrame = timer

      if (this.v) {
        const fa = -0.0007 * Math.sign(this.v)
        const aa = -0.001 * Math.sign(this.v) * this.v ** 2
        const a = fa + aa
        const dy = this.v * dt + dt ** 2 * a
        this.v += a * dt
        this.targetY += dy
      }

      const stY = this.standardize(this.targetY)

      const dis = stY - this.y
      if (Math.abs(dis) > 1) {
        this.y += dis * this.scrollElasticity + Math.sign(dis)
        this.raf = requestAnimationFrame(this.update)
      } else if (this.v) {
        this.y = stY
        this.checkOffsetY()
        this.raf = requestAnimationFrame(this.update)
      } else {
        this.y = stY
        this.raf = 0
      }

      this.onscroll(this.y)
    }

    const self = this

    let touchY = 0
    let touchT = 0
    let v = 0
    this.onTouchMove = function (this: HTMLElement, e: TouchEvent) {
      e.preventDefault()
      const t = Date.now()
      const dy = -(e.touches[0].pageY - touchY)
      const dt = t - touchT
      self.targetY += dy
      v = dy / (dt || 1)
      touchY = e.touches[0].pageY
      touchT = Date.now()
      self.run()
    }
    this.onTouchEnd = function (this: HTMLElement) {
      self.bindAt.removeEventListener('touchmove', self.onTouchMove)
      self.bindAt.removeEventListener('touchend', self.onTouchEnd)
      self.v = v || 1e-10
      self.run()
    }
    this.onTouch = function (this: HTMLElement, e: TouchEvent) {
      if (!self.shakable && !self.scrollable) {
        return
      }
      e.preventDefault()
      self.scrollElasticity = 0.2
      v = 0
      self.v = 0

      touchY = e.touches[0].pageY
      touchT = Date.now()
      self.bindAt.addEventListener('touchmove', self.onTouchMove, { passive: false })
      self.bindAt.addEventListener('touchend', self.onTouchEnd)
    }

    this.onWheel = function (this: HTMLElement, e: WheelEvent) {
      if (!self.shakable && !self.scrollable) {
        return
      }
      self.scrollElasticity = 0.2
      self.targetY += e.deltaY
      self.run()
      clearTimeout(self.stableTimer)
      self.stableTimer = setTimeout(() => {
        self.checkOffsetY()
      }, 160)
    }

    this.bindAt.addEventListener('touchstart', this.onTouch, { passive: false })
    this.bindAt.addEventListener('wheel', this.onWheel)

    this.updateSize()

    this.overflow = options.overflow || 0
    if (typeof options.shakable !== 'undefined') {
      this.shakable = options.shakable
    }
    this.onstart = options.onstart
    this.onscroll = options.onscroll
    this.onstable = options.onstable
  }

  get scrollable() {
    return this.effectiveScrollH > 0
  }

  public updateSize(): [number, number] {
    this.effectiveScrollH = Math.max(0, this.el.scrollHeight - this.el.offsetHeight)
    if (this.y > this.effectiveScrollH) {
      this.y = this.effectiveScrollH
      this.onscroll(this.y)
    }
    return [this.el.offsetHeight, this.el.scrollHeight]
  }

  public setTargetY(ty: number, e = 0.2) {
    this.scrollElasticity = e
    this.targetY = ty
    this.run()
  }

  public setTargetYRelatively(r: number, e = 0.2) {
    const k = ((Math.exp(4) - 1) * this.overflow) / 4
    this.scrollElasticity = e
    this.targetY = r < 0 ? r * k : r > 1 ? this.effectiveScrollH + (r - 1) * k : this.effectiveScrollH * r
    this.run()
  }

  public bindScrollBar(options?: ScrollBarOptions) {
    return new ScrollBar(this, options)
  }

  public checkOffsetY() {
    this.v = 0
    this.scrollElasticity = 0.1
    if (this.targetY < 0) {
      this.targetY = 0
    } else if (this.targetY > this.effectiveScrollH) {
      this.targetY = this.effectiveScrollH
    }
    if (this.onstable) {
      this.onstable(this.standardize(this.targetY))
    }
    this.run(true)
  }

  public clear() {
    this.bindAt.removeEventListener('touchstart', this.onTouch)
    this.bindAt.removeEventListener('touchmove', this.onTouchMove)
    this.bindAt.removeEventListener('touchend', this.onTouchEnd)

    this.bindAt.removeEventListener('wheel', this.onWheel)

    clearTimeout(this.stableTimer)

    cancelAnimationFrame(this.raf)
  }

  private run(toStop?: boolean) {
    if (!toStop && this.onstart && !this.running) {
      this.onstart()
    }
    this.running = !toStop
    if (!this.raf) {
      this.lastFrame = 0
      this.raf = requestAnimationFrame(this.update)
    }
  }

  private standardize(offsetY: number) {
    const k = this.overflow * 0.25
    if (offsetY < 0) {
      const x = Math.abs(offsetY)
      const y = k ? Math.log(x / k + 1) * k : 0
      return -y
    } else if (offsetY > this.effectiveScrollH) {
      const x = offsetY - this.effectiveScrollH
      const y = k ? Math.log(x / k + 1) * k : 0
      return y + this.effectiveScrollH
    } else {
      return offsetY
    }
  }
}
