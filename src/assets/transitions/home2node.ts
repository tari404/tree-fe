import { Ruler } from '@/assets/lib'
import { decorate, defaultIn, transitionInput } from '.'

export default (r: Ruler) => ({
  out: (input: transitionInput): Promise<boolean> => {
    const cL = input.contentLayer
    const aL = input.animLayer

    decorate(aL, { transition: 'opacity .15s', backgroundColor: '#fdfbf8', opacity: '1' })
    decorate(cL, { transition: 'transform .15s', transform: 'scale(.9)' })

    const scrollBar = {
      x: r.margin('100vw', 1400).add(630).value(),
      y: r.base([0, '8vh']).value(),
      width: 6,
      height: r.base(['100vh', '84vh']).value(),
    }
    const nodeMenu = {
      x: 0,
      y: 0,
      width: r
        .margin('100vw', 1400)
        .add(r.base([100, 200]))
        .value(),
      height: r.base('100vh').value(),
    }

    const box = document.createElement('div')
    box.className = 'transition-item'
    decorate(box, {
      top: '0',
      left: '0',
      width: scrollBar.x + 3 + 'px',
      height: nodeMenu.height + 'px',
      backgroundColor: 'transparent',
      transition: 'transform .46s .28s, background-color .46s .38s',
    })

    aL.appendChild(box)

    const bar = document.createElement('div')
    bar.className = 'transition-item'
    decorate(bar, {
      top: scrollBar.y + 'px',
      right: '-3px',
      width: '6px',
      height: scrollBar.height + 'px',
      backgroundColor: '#a2ea1d',
      transition: 'transform .26s 60ms, background-color .4s .3s',
    })

    box.appendChild(bar)

    box.offsetWidth
    decorate(box, {
      transform: `translateX(-${scrollBar.x + 6 - nodeMenu.width}px)`,
      backgroundColor: '#73a810',
    })

    bar.offsetWidth
    decorate(bar, {
      transform: 'scale(1, 1.2)',
      backgroundColor: '#73a810',
    })

    return new Promise((resolve) => {
      aL.ontransitionend = (e) => {
        if (e.target !== aL) {
          return
        }
        decorate(cL, { transition: '', transform: '' })
        decorate(aL, { transition: '' })
        aL.ontransitionend = null
      }
      box.ontransitionend = (e) => {
        if (e.target !== box) {
          return
        }
        box.ontransitionend = null
        resolve(true)
      }
    })
  },
  in: defaultIn,
})
