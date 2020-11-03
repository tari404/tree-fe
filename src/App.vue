<template>
  <div>
    <div id="container">
      <router-view @leave="beforePageLeave"></router-view>
    </div>
    <div id="animation"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NavigationGuardNext } from 'vue-router'
import { TransitionElement } from '@/assets/types'

export default defineComponent({
  name: 'App',
  data() {
    return {
      container: null as HTMLElement | null,
      animationLayer: null as HTMLElement | null,
    }
  },
  mounted() {
    this.container = this.$el.querySelector('#container') as HTMLElement
    this.animationLayer = this.$el.querySelector('#animation') as HTMLElement
  },
  methods: {
    beforePageLeave(next: NavigationGuardNext, transElements: TransitionElement[] = []) {
      const c = this.container!
      const al = this.animationLayer!
      al.style.zIndex = '0'
      al.style.opacity = '1'
      for (const item of transElements) {
        const el = document.createElement('div')
        el.className = item.type
        el.style.left = item.x + 'px'
        el.style.top = item.y + 'px'
        el.style.width = item.width + 'px'
        el.style.height = item.height + 'px'
        al.appendChild(el)
      }
      al.style.transition = 'opacity .1s'
      if (transElements.length) {
        c.style.transition = 'transform .1s'
        c.style.transform = 'scale(.9)'
      }
      al.ontransitionend = () => {
        al.style.transition = 'opacity .2s'
        c.style.transition = ''
        c.style.transform = 'scale(1)'
        next()
        setTimeout(() => {
          al.style.opacity = '0'
          al.ontransitionend = () => {
            al.style.transition = ''
            al.innerHTML = ''
            al.style.zIndex = '-1'
            al.ontransitionend = null
          }
        }, 400)
      }
    },
  },
})
</script>

<style lang="stylus">
@import '~@/color.styl'

#app
  height 100vh
  font-family 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color $black
  background-color $white

*
  box-sizing border-box
body, ul, p
  margin 0
  padding 0
ul
  list-style none
a
  color inherit

#animation, #container
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  overflow hidden

#animation
  background-color $white
  opacity 0
  z-index -1
  .scroll-bar
    position absolute
    border-radius 3px
    background-color $green
    animation scroll-bar .5s ease .02s forwards

@keyframes scroll-bar
  30%
    transform scale(0.5, 1.3)
    background-color $green - 30%
  40%
    transform scale(0.5, 1.3)
    background-color $green - 30%
  100%
    transform translateX(-436px) scale(0.5, 2)
    background-color $green - 30%

@font-face
  font-family 'Quicksand'
  src url('~@/assets/font/Quicksand-SemiBold.ttf')
  font-weight 400
@font-face
  font-family 'Quicksand'
  src url('~@/assets/font/Quicksand-Bold.ttf')
  font-weight 600

.markdown
  font-size 16px
  line-height 28px
  color $midGray
  p
    margin 1em 0
  code
    color #e65100
    padding 4px 6px
    margin 0 2px
    font-size 14px
    background-color #afb5ac1a
    border-radius 6px
  code[tag=lib]
    color #0288d1
</style>
