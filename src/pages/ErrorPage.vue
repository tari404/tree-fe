<template>
  <div class="error-page">
    <div id="error-message">
      <div>
        <img class="logo" src="@/assets/images/bud_white.png" alt="bud" />
      </div>
      <div>
        <p class="error-code">{{ code }}</p>
        <p>啊哦！你要访问的内容不存在，或者已经移栽…</p>
        <p>
          <router-link to="/">回到首页</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorPage',
  props: {
    code: {
      type: Number,
      default: 404,
    },
  },
  mounted() {
    const node = this.$el.querySelector('#error-message') as HTMLElement
    if (window.__INITIALIZED__) {
      node.style.animation = '.15s linear .1s 2 normal forwards running shake'
    }
  },
})
</script>

<style lang="stylus" scoped>
@import '~@/color.styl'

.error-page
  width 100%
  height 100%
  background-color $deepGreen
  display flex
  justify-content center
  align-items center
  color $white
  font-size 20px
  line-height 24px

#error-message
  padding 20px
  display flex
  .logo
    width 100px
    margin 14px 30px 0 0
  p
    margin 12px 0
  a
    font-size 18px
    display inline-block
    text-decoration none
    border-bottom solid 1px $white

  .error-code
    margin 0 0 24px
    font-family Quicksand
    font-weight 200
    font-size 120px
    line-height 120px
</style>

<style lang="stylus">
@keyframes shake
  0%
    transform translateX(0)
  25%
    transform translateX(4px)
  75%
    transform translateX(-4px)
  100%
    transform translateX(0)
</style>
