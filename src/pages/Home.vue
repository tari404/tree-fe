<template>
  <div id="home">
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
      <router-link to="/about">
        <img src="@/assets/images/bud.png" alt="bud" />
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { ScrollBar, Scrollable } from '@/assets/lib'

export default defineComponent({
  name: 'Home',
  data() {
    return {
      scrollY: 0,
      scrollBarY: 0,

      scrollBarEl: null as HTMLElement | null,
      holdBar: false,
      s: undefined as Scrollable | undefined,
      sb: undefined as ScrollBar | undefined,
      scrollable: false,
    }
  },
  computed: {
    posts() {
      return this.$store.state.posts
    },
  },
  mounted() {
    this.s = new Scrollable(this.$el.querySelector('#post-list') as HTMLElement, {
      bindEventAt: document.body,
      scrollY: this.$store.state.memoryStore.homePageScrollY,
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

    this.scrollBarEl = this.$el.querySelector('.scroll-bar-container') as HTMLElement

    window.addEventListener('resize', this.updateSize)
    this.updateSize()
  },
  beforeUnmount() {
    this.$store.commit('STORE_HOMEPAGE_SCROLLY', this.scrollY)
    window.removeEventListener('resize', this.updateSize)
    this.s!.clear()
  },
  methods: {
    updateSize() {
      const [h] = this.s!.updateSize()
      this.scrollable = this.s!.scrollable
      this.sb!.setSize(h - 42, 12)
      this.scrollBarY = this.sb!.y
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
  height 100%

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
