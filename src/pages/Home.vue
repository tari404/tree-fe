<template>
  <div id="home">
    <div id="post-list" @mousewheel="onWheel">
      <ul :style="{ transform: `translateY(${-scrollY}px)` }">
        <li v-for="(post, i) in posts" :key="i" class="post" :latest="i ? undefined : true">
          <p class="post-date">{{ post.date }}</p>
          <div class="stems">
            <i class="chapter-symbol"></i>
            <ul>
              <li v-for="(stem, i) in post.stems" :key="i">
                <i class="title-symbol">{{ stem.origin }}</i>
                <p class="origin">{{ stem.origin }}</p>
                <p class="content">{{ stem.body }}</p>
              </li>
            </ul>
          </div>
          <div class="leaves">
            <i class="chapter-symbol"></i>
            <ul>
              <li v-for="(leaf, i) in post.leaves" :key="i">
                <p class="content">{{ leaf }}</p>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div class="scroll-bar-container">
      <div class="scroll-bar"></div>
      <div v-if="overHeight" :style="{ transform: `translateY(${scrollBarOffsetY}px)` }" class="scroll-span"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

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
        origin: '',
        body: `在混用了CDN和modules来进行\`three.js\`的开发时，出现了从modules里引入的\`RawShaderMaterial\`可用，但是从CDN里引入的\`RawShaderMaterial\`工作不正常的问题。`,
      },
    ],
    leaves: ['glsl中noice库函数的工作原理', 'three.js库中包含的UnrealBloomPass是如何在后期产生绚丽的发光效果的'],
  },
]

export default defineComponent({
  name: 'Home',
  data() {
    return {
      posts: testPosts,

      containerHeight: 0,
      overHeight: 0,

      scrollY: 0,
    }
  },
  computed: {
    scrollBarOffsetY(): number {
      if (this.overHeight === 0) {
        return 0
      } else {
        const p = Math.max(0, Math.min(1, this.scrollY / this.overHeight))
        return (this.containerHeight - 42) * p
      }
    },
  },
  mounted() {
    window.addEventListener('resize', this.updateSize)
    this.updateSize()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateSize)
  },
  methods: {
    updateSize() {
      const list = this.$el.querySelector('#post-list') as HTMLElement

      this.containerHeight = list.offsetHeight
      this.overHeight = Math.max(0, list.scrollHeight - list.offsetHeight)
    },
    onWheel(e: WheelEvent) {
      const scrollY = this.scrollY + e.deltaY
      this.scrollY = Math.max(-100, Math.min(this.overHeight + 100, scrollY))
    },
  },
})
</script>

<style lang="stylus" scoped>
@import '~@/color.styl'

#home
  margin auto
  padding 8vh 0
  max-width 1220px
  height 100vh

  display flex

#post-list
  padding 0 40px
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
.stems
  display flex
  line-height 28px
  li
    position relative
    &:not(:first-child)
      margin-top 40px
  .chapter-symbol
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
      margin-top 20px
    padding 0 14px
    color $midGray
  .chapter-symbol
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
  .title-symbol
    position absolute
    content ''
    top 0
    left 0
    padding 3px 16px
    width 100%
    line-height 26px
    font-size 18px
    border-radius 16px
    background-color $green
    color transparent
  .origin
    margin 22px 0 14px
    padding 3px 16px
    line-height 26px
    font-size 18px
    opacity .9

.scroll-bar-container
  padding 0 12px
  position relative
  overflow hidden
  &:hover .scroll-bar
    opacity 1
.scroll-bar
  margin 0 18px
  width 6px
  height 100%
  border-radius 3px
  background-color $green
  opacity .4
  transition opacity .14s
  cursor pointer
.scroll-span
  position absolute
  top 6px
  left 18px
  width 30px
  height 30px
  border-radius 50%
  background-color $green
  border solid 6px $white
  cursor pointer
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
</style>
