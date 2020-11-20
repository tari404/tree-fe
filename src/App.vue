<template>
  <div>
    <div id="container">
      <router-view></router-view>
    </div>
    <div id="animation"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { defaultOut, defaultIn, transitonLib } from '@/assets/transitions'

export default defineComponent({
  name: 'App',
  async serverPrefetch() {
    const pageName = this.$route.name as string
    const action = 'PRELOAD_PAGE_' + pageName.toUpperCase()
    if (this.$store._actions[action]) {
      await this.$store.dispatch(action)
    }
  },
  data() {
    return {
      contentLayer: null as HTMLElement | null,
      animationLayer: null as HTMLElement | null,
    }
  },
  mounted() {
    this.contentLayer = this.$el.querySelector('#container') as HTMLElement
    this.animationLayer = this.$el.querySelector('#animation') as HTMLElement
    this.$router.beforeEach(this.beforePageLeave)
    this.$router.afterEach(this.afterPageLeave)
  },
  methods: {
    getPagesNames(to: RouteLocationNormalized, from: RouteLocationNormalized): [string, string] {
      return [(to.name || '').toString(), (from.name || '').toString()]
    },
    async beforePageLeave(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
      const cL = this.contentLayer!
      const aL = this.animationLayer!

      let transOut = defaultOut

      const [t, f] = this.getPagesNames(to, from)
      const path = f + '-' + t
      if (transitonLib[path]) {
        transOut = transitonLib[path]!.out
      } else if (transitonLib[f]) {
        transOut = transitonLib[f]!.out
      }

      aL.style.zIndex = '0'
      await transOut({
        contentLayer: cL,
        animLayer: aL,
      })

      const action = 'PRELOAD_PAGE_' + t.toUpperCase()
      if (this.$store._actions[action]) {
        await this.$store.dispatch(action)
      }

      next()
    },
    async afterPageLeave(to: RouteLocationNormalized, from: RouteLocationNormalized) {
      const cL = this.contentLayer!
      const aL = this.animationLayer!

      let transIn = defaultIn

      const [t, f] = this.getPagesNames(to, from)
      const path = f + '-' + t
      if (transitonLib[path]) {
        transIn = transitonLib[path]!.in
      } else if (transitonLib[t]) {
        transIn = transitonLib[t]!.in
      }

      await transIn({
        contentLayer: cL,
        animLayer: aL,
      })
      aL.style.zIndex = '-1'
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
  background-color transparent
  opacity 0
  z-index -1

.transition-item
  position absolute

@font-face
  font-family 'Quicksand'
  src url('~@/assets/font/Quicksand-Light.ttf')
  font-weight 200
@font-face
  font-family 'Quicksand'
  src url('~@/assets/font/Quicksand-Medium.ttf')
  font-weight 400
@font-face
  font-family 'Quicksand'
  src url('~@/assets/font/Quicksand-SemiBold.ttf')
  font-weight 600
@font-face
  font-family 'Quicksand'
  src url('~@/assets/font/Quicksand-Bold.ttf')
  font-weight 900

.markdown
  font-size 16px
  line-height 28px
  color $midGray
  p
    margin 1em 0
    &:first-child
      margin-top 0
  code
    color #e65100
    padding 4px 6px
    margin 0 2px
    font-size 14px
    background-color #afb5ac1a
    border-radius 6px
  code[tag=lib]
    color #0288d1

.prime-input
  padding 7px 19px
  border-radius 6px
  border solid 1px $gray
  font-family inherit
  color $midGray
  line-height 24px
  transition border-color .2s, box-shadow .2s
  outline none
  &:focus
    border-color $orange
    box-shadow 0 0 4px $orange

.tree-button-add
  width 40px
  height 40px
  display block
  border-radius 50%
  background-color $green
  cursor pointer
  // opacity .8
  transition opacity .2s
  position relative
  &:before, &:after
    content ''
    position absolute
    top 50%
    left 50%
    width 26px
    height 6px
    border-radius 3px
    background-color $green + 80%
    transform translate3d(-50%, -50%, 0)
  &:after
    transform translate3d(-50%, -50%, 0) rotate(90deg)
  // &:hover
  //   opacity 1
</style>
