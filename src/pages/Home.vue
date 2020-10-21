<template>
  <div id="home">
    <ul class="post-list">
      <li v-for="post in posts" :key="post.data" class="post">
        <p class="post-date">{{ post.date }}</p>
        <div class="stems">
          <i class="chapter-symbol"></i>
          <ul>
            <li v-for="(stem, i) in post.stems" :key="i">
              <i class="title-symbol"></i>
              <p class="origin"></p>
              <p class="content">{{ stem.body }}</p>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <div class="scroll-bar"></div>
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
    }
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

.post-list
  padding 0 40px
  flex 0 0 600px
  overflow hidden
  >li:not(:first-child)
    margin-top 100px
.post-date
  margin-bottom 32px
  font-family 'Quicksand'
  font-size 54px
  color $red
.stems
  display flex
  line-height 28px
  li
    position relative
    &:not(:first-child)
      margin-top 40px
  .chapter-symbol
    background-color $green
  .title-symbol
    position absolute
    content ''
    top 0
    left 0
    width 100%
    height 32px
    border-radius 16px
    background-color $green
  .origin
    margin 22px 0 16px
    padding 0 16px
    min-height 30px
    line-height 30px
    font-size 18px
    font-weight 600
    position relative
  .content
    padding 0 14px
    color $midGray

.scroll-bar
  margin 0 18px
  width 6px
  height 100%
  border-radius 3px
  background-color $green
  opacity .4
  transition opacity .14s
  &:hover
    opacity 1

// common
.chapter-symbol
  margin-right 20px
  flex 0 0 60px
  height 60px
  display block
  border-radius 50%
</style>
