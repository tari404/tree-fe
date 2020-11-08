import { Ruler } from '@/assets/lib'
import { defaultIn, transitionInput } from '.'

export default (r: Ruler) => ({
  out: (input: transitionInput): Promise<boolean> => {
    const cL = input.contentLayer
    const aL = input.animLayer

    aL.style.transition = 'opacity .15s'
    aL.style.backgroundColor = '#fdfbf8'
    aL.style.opacity = '1'

    cL.style.transition = 'transform .15s'
    cL.style.transform = 'scale(.9)'

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
    box.style.top = '0'
    box.style.left = '0'
    box.style.width = scrollBar.x + 3 + 'px'
    box.style.height = nodeMenu.height + 'px'
    box.style.backgroundColor = 'transparent'
    box.style.transition = 'transform .46s .28s, background-color .46s .38s'

    aL.appendChild(box)

    const bar = document.createElement('div')
    bar.className = 'transition-item'
    bar.style.top = scrollBar.y + 'px'
    bar.style.right = '-3px'
    bar.style.width = '6px'
    bar.style.height = scrollBar.height + 'px'
    bar.style.backgroundColor = '#a2ea1d'
    bar.style.transition = 'transform .26s 60ms, background-color .4s .3s'

    box.appendChild(bar)

    box.offsetWidth
    box.style.transform = `translateX(-${scrollBar.x + 6 - nodeMenu.width}px)`
    box.style.backgroundColor = '#73a810'

    bar.offsetWidth
    bar.style.transform = 'scale(1, 1.2)'
    bar.style.backgroundColor = '#73a810'

    return new Promise((resolve) => {
      aL.ontransitionend = (e) => {
        if (e.target !== aL) {
          return
        }
        cL.style.transition = ''
        cL.style.transform = ''
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
