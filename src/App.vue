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

export default defineComponent({
  name: 'App',
  methods: {
    beforePageLeave(next: NavigationGuardNext) {
      next()
    },
  },
})
</script>

<style lang="stylus">
@import '~@/color.styl'

#app
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

#container
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  overflow hidden

@font-face
  font-family 'Quicksand'
  src url('~@/assets/font/Quicksand-SemiBold.ttf')
  font-weight 400
@font-face
  font-family 'Quicksand'
  src url('~@/assets/font/Quicksand-Bold.ttf')
  font-weight 600
</style>
