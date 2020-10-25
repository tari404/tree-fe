export class Scrollable {
  public el: HTMLElement

  private touchY = 0
  private touchT = 0
  private v = 0

  private onscroll: (dy: number) => number
  private onstable?: () => any

  private onTouch: (this: HTMLElement, ev: TouchEvent) => any
  private onTouchMove: (this: HTMLElement, ev: TouchEvent) => any
  private onTouchEnd: (this: HTMLElement) => any

  private onWheel: (this: HTMLElement, ev: WheelEvent) => any

  private stableTimer = 0

  private lastFrame = 0
  private raf = 0

  constructor(target: HTMLElement, onscroll: (dy: number) => number, onstable?: () => any) {
    this.el = target

    const self = this

    const update = (timer: number) => {
      const dt = self.lastFrame ? timer - self.lastFrame : 16
      self.lastFrame = timer

      const fa = -0.0007 * Math.sign(self.v)
      const aa = -0.001 * Math.sign(self.v) * self.v ** 2
      const a = fa + aa
      const dy = self.v * dt + dt ** 2 * a
      self.v += a * dt

      const actualDy = self.onscroll(dy)

      if (self.v * a >= 0 || Math.abs(actualDy) < 0.2) {
        if (self.onstable) {
          self.onstable()
        }
        return
      }

      self.raf = requestAnimationFrame(update)
    }

    this.onTouchMove = function (this: HTMLElement, e: TouchEvent) {
      e.preventDefault()
      const t = Date.now()
      const dy = -(e.touches[0].pageY - self.touchY)
      const dt = t - self.touchT
      self.onscroll(dy)
      self.v = dy / dt
      self.touchY = e.touches[0].pageY
      self.touchT = Date.now()
    }
    this.onTouchEnd = function (this: HTMLElement) {
      self.el.removeEventListener('touchmove', self.onTouchMove)
      self.el.removeEventListener('touchend', self.onTouchEnd)
      self.raf = requestAnimationFrame(update)
    }
    this.onTouch = function (this: HTMLElement, e: TouchEvent) {
      e.preventDefault()
      self.lastFrame = 0
      self.v = 0
      cancelAnimationFrame(self.raf)

      self.touchY = e.touches[0].pageY
      self.touchT = Date.now()
      self.el.addEventListener('touchmove', self.onTouchMove, { passive: false })
      self.el.addEventListener('touchend', self.onTouchEnd)
    }

    this.onWheel = function (this: HTMLElement, e: WheelEvent) {
      self.onscroll(e.deltaY)
      clearTimeout(self.stableTimer)
      self.stableTimer = setTimeout(() => {
        if (self.onstable) {
          self.onstable()
        }
      }, 160)
    }

    this.el.addEventListener('touchstart', this.onTouch, { passive: false })
    this.el.addEventListener('wheel', this.onWheel)

    this.onscroll = onscroll
    this.onstable = onstable
  }

  public clear() {
    this.el.removeEventListener('touchstart', this.onTouch)
    this.el.removeEventListener('touchmove', this.onTouchMove)
    this.el.removeEventListener('touchend', this.onTouchEnd)

    this.el.removeEventListener('wheel', this.onWheel)
  }
}
