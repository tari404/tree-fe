import { Ruler } from '@/assets/lib'
import { decorate, defaultIn, transitionInput } from '.'

export default (r: Ruler) => ({
  out: (input: transitionInput): Promise<boolean> => {
    const aL = input.animLayer
    const cL = input.contentLayer

    decorate(aL, { transition: 'background-color .15s', backgroundColor: '#fdfbf8', opacity: '1' })
    decorate(cL, { transition: 'transform .15s', transform: 'scale(.9)' })

    const size = {
      right: r.margin('100vw', 1400).add(10).value(),
      fromY: r.base('8vh').add(10).value(),
      toY: 20,
    }

    const oldButton = cL.querySelector('.tree-button-add') as HTMLElement

    const button = document.createElement('div')
    button.className = 'tree-button-add'
    decorate(button, {
      position: 'absolute',
      top: size.fromY + 'px',
      right: size.right + 'px',
      transition: 'transform .5s',
    })

    aL.appendChild(button)

    button.offsetWidth
    decorate(button, { transform: `translateY(${size.toY - size.fromY}px) rotate(45deg)` })
    oldButton.remove()

    return new Promise((resolve) => {
      button.ontransitionend = (e) => {
        if (e.target !== button) {
          return
        }
        decorate(cL, { transition: '', transform: '' })
        decorate(aL, { transition: '' })
        button.ontransitionend = null
        resolve(true)
      }
    })
  },
  in: defaultIn,
})
