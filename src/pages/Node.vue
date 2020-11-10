<template>
  <div id="node">
    <div class="node-menu">
      <router-link to="/">返回</router-link>
    </div>
    <div id="node-body" class="node-content">
      <div :style="{ transform: `translateY(${-scrollY}px)` }">
        <div class="markdown" v-html="bodyHTML"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'
import marked from 'marked'

import { Scrollable } from '@/assets/lib'

export default defineComponent({
  name: 'Node',
  data() {
    return {
      id: this.$route.params.id as string,

      scrollY: 0,
      s: undefined as Scrollable | undefined,
    }
  },
  computed: {
    node() {
      return this.$store.state.node
    },
    bodyHTML(): string {
      return this.node ? marked(this.node.body) : ''
    },
  },
  mounted() {
    const node = this.$el.querySelector('#node-body') as HTMLElement
    if (window.__INITIALIZED__) {
      node.style.animation = 'move-up .5s forwards'
    }
    this.s = new Scrollable(node, {
      bindEventAt: document.body,
      overflow: 0,
      onscroll: (y) => {
        this.scrollY = y
      },
    })
    window.addEventListener('resize', this.updateSize)
    this.updateSize()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateSize)
    this.s!.clear()
  },
  methods: {
    updateSize() {
      this.s!.updateSize()
    },
  },
})
</script>

<style lang="stylus" scoped>
@import '~@/color.styl'

#node
  margin auto
  padding 8vh 0
  max-width 1400px
  height 100vh
  display flex

.node-menu
  padding 10px 30px
  flex 0 0 200px
  background-color $midGreen
  color $white
  position relative
  &:before
    content ''
    position absolute
    right 0
    top -8vh
    width 100vw
    height 100vh
    background-color $midGreen
    z-index -1

.node-content
  flex 1 1 auto
  display flex
  justify-content center
  overflow hidden
  >div
    padding 0 20px
    max-width 760px
    height fit-content

@media screen and (max-width 800px)
  #node
    padding 0
  .node-menu
    flex 0 0 100px
</style>

<style lang="stylus">
@keyframes move-up
  from
    transform translateY(20px)
  to
    transform translateY(0)
</style>
