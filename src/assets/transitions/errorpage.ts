import { Ruler } from '@/assets/lib'
import { decorate, defaultIn, transitionInput } from '.'

export default (r: Ruler) => ({
  out: (input: transitionInput): Promise<boolean> => {
    const aL = input.animLayer
    const cL = input.contentLayer

    decorate(aL, { opacity: '1' })

    const msgEl = cL.querySelector('#error-message') as HTMLElement
    decorate(msgEl, {
      transition: 'transform 1s',
      transform: 'translateY(100px)',
    })

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
      decorate(item, {
        position: 'absolute',
        bottom: '100vh',
        left: cover + 'px',
        width: 2 * r + 'px',
        height: 2 * pageHeight + 'px',
        borderRadius: r + 'px',
        backgroundColor: '#fdfbf8',
        transition: `transform ${time + delay}ms ${delay}ms`,
      })

      aL.appendChild(item)

      item.offsetWidth
      decorate(item, { transform: 'translateY(150vh)' })

      cover += r * 2
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        decorate(msgEl, { transition: '', transform: '' })
        resolve(true)
      }, maxTime)
    })
  },
  in: defaultIn,
})
