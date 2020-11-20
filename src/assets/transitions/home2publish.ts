import { Ruler } from '@/assets/lib'
import { decorate, defaultIn, transitionInput } from '.'

export default (r: Ruler) => ({
  out: (input: transitionInput): Promise<boolean> => {
    const aL = input.animLayer
    const cL = input.contentLayer

    decorate(aL, {
      transition: 'background-color .15s',
      backgroundColor: '#fdfbf8',
      opacity: '1',
      perspective: '5000px',
      perspectiveOrigin: 'center 40px',
    })
    decorate(cL, { transition: 'transform .15s', transform: 'scale(.9)' })

    const w = r.base('100vw').value()
    const size = {
      right: r.margin('100vw', 1400).add(10).value(),
      fromY: r.base('8vh').add(10).value(),
      toY: 20,
      scale: Math.min(1380, w) / w,
    }

    const oldButton = cL.querySelector('.tree-button-add') as HTMLElement

    const nav = document.createElement('div')
    decorate(nav, {
      position: 'absolute',
      top: '0',
      left: '0',
      backgroundImage: 'linear-gradient(90deg,#7bb50f,#beca13)',
      width: '100%',
      height: '80px',
      transform: `scaleX(${size.scale})`,
      opacity: '0',
      transition: 'all .2s .3s',
    })
    aL.appendChild(nav)

    nav.offsetWidth
    decorate(nav, { transform: 'scaleX(1)', opacity: '1' })

    const navBg = document.createElement('div')
    decorate(navBg, {
      position: 'absolute',
      top: '-40px',
      left: '50%',
      height: '161px',
      width: '1420px',
      backgroundColor: '#73a810',
      borderRadius: '0 0 10px 10px/20px',
      transform: 'translateX(-50%) rotateX(-60deg) translateY(-100%)',
      transition: 'transform .16s .14s',
    })
    aL.appendChild(navBg)

    navBg.offsetWidth
    decorate(navBg, { transform: 'translateX(-50%) rotateX(-60deg)' })

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
      nav.ontransitionend = (e) => {
        if (e.target !== nav) {
          return
        }
        decorate(cL, { transition: '', transform: '', perspective: '', perspectiveOrigin: '' })
        decorate(aL, { transition: '' })
        nav.ontransitionend = null
        resolve(true)
      }
    })
  },
  in: defaultIn,
})
