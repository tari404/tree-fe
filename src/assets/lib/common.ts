export const debounce = <T extends any[]>(fn: (...args: T) => any, time: number): ((...args: T) => void) => {
  let timer: number = 0
  let hold = false
  const dfn = function (this: any, ...arg: T) {
    hold = true
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      hold = false
      fn.call(this, ...arg)
    }, time)
  }
  return dfn
}

export const throttle = <T extends any[]>(fn: (...args: T) => any, time: number): ((...args: T) => void) => {
  let locked = false
  const tfn = function (this: any, ...args: T) {
    if (locked) return
    locked = true
    fn.call(this, ...args)
    setTimeout(() => {
      locked = false
    }, time)
  }
  return tfn
}
