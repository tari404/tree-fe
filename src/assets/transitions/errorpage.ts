import { Ruler } from '@/assets/lib'
import { defaultIn, transitionInput } from '.'

export default (r: Ruler) => ({
  out: (input: transitionInput): Promise<boolean> => {
    const aL = input.animLayer
    const cL = input.contentLayer

    aL.style.opacity = '1'

    const msgEl = cL.querySelector('#error-message') as HTMLElement
    msgEl.style.transition = 'transform 1s'
    msgEl.style.transform = 'translateY(100px)'

    const pageWidth = r.base('100vw').value()
    const pageHeight = r.base('100vh').value()

    let cover = 0
    let maxTime = 0
    while (cover < pageWidth) {
      const dx = Math.round(20 * Math.random())
      const r = Math.round((pageWidth / 14) * (Math.random() * 1.2 + 0.4))

      cover -= dx

      const time = Math.round(Math.random() * 300 + 100)
      const delay = Math.round(Math.random() * 360)

      maxTime = Math.max(maxTime, time + delay)

      const item = document.createElement('div')
      item.style.position = 'absolute'
      item.style.bottom = '100vh'
      item.style.left = cover + 'px'
      item.style.width = 2 * r + 'px'
      item.style.height = 2 * pageHeight + 'px'
      item.style.borderRadius = r + 'px'
      item.style.backgroundColor = '#fdfbf8'
      item.style.transition = `transform ${time + delay}ms ${delay}ms`

      aL.appendChild(item)

      item.offsetWidth
      item.style.transform = 'translateY(150vh)'

      cover += r * 2
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        msgEl.style.transition = ''
        msgEl.style.transform = ''
        resolve(true)
      }, maxTime)
    })
  },
  in: defaultIn,
})
