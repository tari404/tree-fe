<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
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

@font-face
  font-family 'Quicksand'
  src url('~@/assets/font/Quicksand-SemiBold.ttf')
  font-weight 400
@font-face
  font-family 'Quicksand'
  src url('~@/assets/font/Quicksand-Bold.ttf')
  font-weight 600
</style>
