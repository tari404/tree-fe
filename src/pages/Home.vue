<template>
  <div id="home" :style="{ height: pageHeight }">
    <div id="post-list">
      <ul :style="{ transform: `translateY(${-realScrollY}px)` }">
        <li v-for="(post, pidx) in posts" :key="pidx" class="post" :latest="pidx ? undefined : true">
          <p class="post-date">{{ post.date }}</p>
          <div class="stems">
            <i class="chapter-symbol"></i>
            <ul>
              <li v-for="(stem, i) in post.stems" :key="i">
                <i v-if="pidx === 0" class="title-symbol">{{ stem.origin }}</i>
                <p class="leaf">{{ stem.origin }}</p>
                <p class="content">{{ stem.body }}</p>
              </li>
            </ul>
          </div>
          <div class="leaves">
            <i class="chapter-symbol"></i>
            <ul>
              <li v-for="(leaf, i) in post.leaves" :key="i">
                <i v-if="pidx === 0" class="title-symbol">{{ leaf }}</i>
                <p class="leaf">{{ leaf }}</p>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div class="scroll-bar-container" @mousedown="touchBar">
      <div class="scroll-bar" :hold="scrollElasticity > 0.15 ? true : undefined"></div>
      <div v-if="sbsc.scrollable" :style="{ transform: `translateY(${scrollBarOffsetY}px)` }" class="scroll-span" />
    </div>
    <div class="right-part">
      <img src="@/assets/images/bud.png" alt="bud" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'

import { debounce, Scrollable, ScrollBarSizeCalculator } from '@/assets/lib'
import { Post } from '@/assets/types/post'

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

      touchY: 0,
      scrollY: 0,
      realScrollY: 0,
      scrollElasticity: 0.1,

      raf: 0,

      scrollBar: null as HTMLElement | null,
      sbsc: new ScrollBarSizeCalculator(0, 60, 0, 12),
      s: undefined as Scrollable | undefined,
    }
  },
  computed: {
    scrollBarOffsetY(): number {
      return this.sbsc.a2b(this.realScrollY)
    },
  },
  mounted() {
    window.addEventListener('resize', this.updateSize)
    this.updateSize()
    this.s = new Scrollable(
      document.body,
      (dy) => {
        this.scrollElasticity = 0.3
        this.scrollY += dy

        // TODO: not grace enough
        return this.sbsc.a2a(this.scrollY) - this.sbsc.a2a(this.scrollY - dy)
        // this.scrollY = this.sbsc.a2a(this.scrollY + dy)
      },
      () => {
        this.scrollElasticity *= 0.6
        this.scrollY = this.sbsc.trim(this.scrollY)
      }
    )
    this.raf = requestAnimationFrame(this.updateWheel)

    this.scrollBar = this.$el.querySelector('.scroll-bar-container') as HTMLElement
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateSize)
    if (this.s) {
      this.s.clear()
    }
    cancelAnimationFrame(this.raf)
  },
  methods: {
    updateSize() {
      this.pageHeight = window.innerHeight + 'px'

      nextTick(() => {
        const list = this.$el.querySelector('#post-list') as HTMLElement
        this.sbsc.updateSize(list.scrollHeight - list.offsetHeight, list.offsetHeight - 42)
        this.scrollY = this.sbsc.trim(this.scrollY)
      })
    },
    checkWheelPos: debounce(function (this: any) {
      this.scrollElasticity *= 0.6
      this.scrollY = this.sbsc.trim(this.scrollY)
    }, 160),

    updateWheel() {
      const scrollY = this.sbsc.a2a(this.scrollY)
      const dis = scrollY - this.realScrollY
      if (Math.abs(dis) > 1) {
        this.realScrollY += dis * this.scrollElasticity + Math.sign(dis)
      } else if (dis) {
        this.realScrollY = scrollY
      }
      this.raf = requestAnimationFrame(this.updateWheel)
    },

    touchBar(e: MouseEvent) {
      if (!this.sbsc.scrollable) {
        return
      }
      this.scrollElasticity = 0.2
      const y = e.pageY - this.scrollBar!.offsetTop - 21
      this.scrollY = this.sbsc.b2a(y)

      document.body.addEventListener('mousemove', this.moveBar)
      document.body.addEventListener('mouseup', this.removeBarEvent)
      document.body.addEventListener('mouseleave', this.removeBarEvent)
    },
    moveBar(e: MouseEvent) {
      if (!this.sbsc.scrollable) {
        return
      }
      e.preventDefault()
      this.scrollElasticity = 0.2
      const y = e.pageY - this.scrollBar!.offsetTop - 21
      this.scrollY = this.sbsc.b2a(y)
    },
    removeBarEvent() {
      this.checkWheelPos()
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
    color $red
    opacity .6
  .leaf
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
  &:hover .scroll-bar
    opacity 1
.scroll-bar
  margin 0 12px
  width 6px
  height 100%
  border-radius 3px
  background-color $green
  opacity .4
  transition opacity .14s
  &[hold]
    opacity 1
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
