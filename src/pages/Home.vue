<template>
  <div id="home" :style="{ height: pageHeight }">
    <div id="post-list">
      <ul :style="{ transform: `translateY(${-scrollY}px)` }">
        <li v-for="(post, pidx) in posts" :key="pidx" class="post" :latest="pidx ? undefined : true">
          <p class="post-date">{{ post.date }}</p>
          <div class="stems">
            <i class="chapter-symbol"></i>
            <ul>
              <li v-for="(stem, i) in post.stems" :key="i">
                <i v-if="pidx === 0" class="title-symbol">{{ stem.origin }}</i>
                <router-link to="/n/1" class="leaf">{{ stem.origin }}</router-link>
                <p class="content">{{ stem.body }}</p>
              </li>
            </ul>
          </div>
          <div class="leaves">
            <i class="chapter-symbol"></i>
            <ul>
              <li v-for="(leaf, i) in post.leaves" :key="i">
                <i v-if="pidx === 0" class="title-symbol">{{ leaf }}</i>
                <router-link to="/n/1" class="leaf">{{ leaf }}</router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div class="scroll-bar-container" :disabled="scrollable ? null : true" @mousedown="touchBar">
      <div class="scroll-bar" :hold="holdBar ? true : null"></div>
      <div v-if="scrollable" :style="{ transform: `translateY(${scrollBarY}px)` }" class="scroll-span" />
    </div>
    <div class="right-part">
      <img src="@/assets/images/bud.png" alt="bud" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'

import { ScrollBar, Scrollable } from '@/assets/lib'
import { Post } from '@/assets/types'

const testPosts: Post[] = [
  {
    date: '10.5',
    stems: [
      {
        origin: 'glsl中noice库函数的工作原理',
        body: `初步了解了\`Perlin Noise\`和\`Simplex Noise\`算法的基本概念和步骤：已知坐标->定位与其相邻的若干顶点->获得顶点伪随机梯度值->插值获得坐标的具体值。目前对于每一步计算时的具体参数的推导，以及计算生成随机梯度的算法没有理解透彻。计划做一些实际的demo来直观的看到每一步的计算对于最终结果的影响。`,
      },
      {
        origin: 'three.js库中包含的UnrealBloomPass是如何在后期产生绚丽的发光效果的',
        body: `知道问题后解决方案就很清晰了，在使用CDN优化three.js库加载速度的情况下，应该从\`three/examples/js/\`目录下引入其他资源，使其在全局的THREE上获取必要的依赖并注入。之前错误的CDN、modules混用的做法不仅导致了bug的出现，也徒增了打包的js文件大小。`,
      },
    ],
    leaves: ['理解并能够复写一个simplex noise算法'],
  },
  {
    date: '10.4',
    stems: [
      {
        origin: 'glsl中noice库函数的工作原理',
        body: `在混用了CDN和modules来进行\`three.js\`的开发时，出现了从modules里引入的\`RawShaderMaterial\`可用，但是从CDN里引入的\`RawShaderMaterial\`工作不正常的问题。`,
      },
    ],
    leaves: ['glsl中noice库函数的工作原理', 'three.js库中包含的UnrealBloomPass是如何在后期产生绚丽的发光效果的'],
  },
]
for (let i = 0; i < 2; i++) {
  testPosts.push(...testPosts)
}

export default defineComponent({
  name: 'Home',
  data() {
    return {
      posts: testPosts,

      pageHeight: window.innerHeight + 'px',

      scrollY: 0,
      scrollBarY: 0,

      scrollBarEl: null as HTMLElement | null,
      holdBar: false,
      s: undefined as Scrollable | undefined,
      sb: undefined as ScrollBar | undefined,
      scrollable: false,
    }
  },
  mounted() {
    this.s = new Scrollable(this.$el.querySelector('#post-list') as HTMLElement, {
      bindEventAt: document.body,
      overflow: 60,
      onstart: () => {
        this.holdBar = true
      },
      onscroll: (y) => {
        this.scrollY = y
        this.scrollBarY = this.sb!.y
      },
      onstable: () => {
        this.holdBar = false
      },
    })
    this.sb = this.s!.bindScrollBar()
    window.addEventListener('resize', this.updateSize)
    this.updateSize()

    this.scrollBarEl = this.$el.querySelector('.scroll-bar-container') as HTMLElement
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateSize)
    this.s!.clear()
  },
  beforeRouteLeave(to, from, next) {
    this.$emit('leave', to, from, next)
  },
  methods: {
    updateSize() {
      // this.pageHeight = window.innerHeight + 'px'
      this.pageHeight = '100%'
      nextTick(() => {
        const [h] = this.s!.updateSize()
        this.scrollable = this.s!.scrollable
        this.sb!.setSize(h - 42, 12)
        this.scrollBarY = this.sb!.y
      })
    },

    touchBar(e: MouseEvent) {
      if (!this.scrollable) {
        return
      }
      const y = e.pageY - this.scrollBarEl!.offsetTop - 21
      this.sb!.setY(y)

      document.body.addEventListener('mousemove', this.moveBar)
      document.body.addEventListener('mouseup', this.removeBarEvent)
      document.body.addEventListener('mouseleave', this.removeBarEvent)
    },
    moveBar(e: MouseEvent) {
      e.preventDefault()
      const y = e.pageY - this.scrollBarEl!.offsetTop - 21
      this.sb!.setY(y)
    },
    removeBarEvent() {
      this.s!.checkOffsetY()
      document.body.removeEventListener('mousemove', this.moveBar)
      document.body.removeEventListener('mouseup', this.removeBarEvent)
      document.body.removeEventListener('mouseleave', this.removeBarEvent)
    },
  },
})
</script>

<style lang="stylus" scoped>
@import '~@/color.styl'

#home
  margin auto
  padding 8vh 0
  max-width 1400px
  height 100vh

  display flex

#post-list
  padding 0 40px
  max-width 100%
  flex 0 0 600px
  overflow hidden
.post
  &:not(:first-child)
    margin-top 100px
  .post-date
    margin-bottom 32px
    font-family 'Quicksand'
    font-weight 600
    font-size 36px
    line-height 1.25em
    color $red
    opacity .6
  .leaf
    display block
    font-size 18px
    margin-bottom 16px
    position relative
    text-decoration underline
    cursor pointer
.stems
  display flex
  line-height 28px
  li
    position relative
    &:not(:first-child)
      margin-top 40px
  .chapter-symbol, .title-symbol
    background-color $green
  .content
    padding 0 14px
    color $midGray
.leaves
  margin-top 40px
  display flex
  line-height 28px
  li
    position relative
    &:not(:first-child)
      margin-top 16px
  .chapter-symbol, .title-symbol
    background-color $orange

.post[latest]
  .post-date
    font-weight 400
    font-size 54px
    opacity 1
  .chapter-symbol
    margin 0 20px 0 0
    flex 0 0 60px
    height 60px
    justify-content center
    align-items center
    font-family 'remixicon' !important
    font-style normal
    &:before
      color $white
      font-size 40px
  .stems .chapter-symbol:before
      content '\eea2'
  .leaves .chapter-symbol:before
      content '\f0d4'
  .leaf
    margin-top 22px
    padding 3px 16px
    line-height 26px
    text-decoration none
    // opacity .8

.scroll-bar-container
  margin 0 18px
  position relative
  overflow hidden
  cursor pointer
  &[disabled]
    cursor default
    .scroll-bar
      opacity .4 !important
  &:hover .scroll-bar
    opacity 1
    transition .14s
.scroll-bar
  margin 0 12px
  width 6px
  height 100%
  border-radius 3px
  background-color $green
  opacity .4
  transition opacity .8s .14s
  &[hold]
    opacity 1
    transition .14s
.scroll-span
  position absolute
  top 6px
  left 0
  width 30px
  height 30px
  border-radius 50%
  background-color $green
  border solid 6px $white
  &:before
    content ''
    position absolute
    top 6px
    left 6px
    width 6px
    height 6px
    border-radius 50%
    background-color $white

// common
.chapter-symbol
  margin 8px 44px 8px 24px
  flex 0 0 12px
  height 12px
  display flex
  border-radius 50%
.title-symbol
  position absolute
  content ''
  top 0
  left 0
  padding 3px 16px
  line-height 26px
  font-size 18px
  border-radius 16px
  color transparent
  opacity .4

// right
.right-part
  flex 1 1 auto
  display flex
  justify-content center
  align-items center
  opacity .8

@media screen and (max-width 800px)
  #home
    padding 0
  .scroll-bar-container, .right-part
    display none
</style>
