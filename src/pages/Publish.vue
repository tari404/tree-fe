<template>
  <div id="publish">
    <div class="control-panel">
      <div>
        <span class="label">标题</span>
        <div class="input-title">
          <div class="input-button" @click="useExistedLeaf = !useExistedLeaf">
            <i :class="useExistedLeaf ? 'ri-close-line' : 'ri-links-line'"></i>
          </div>
          <input type="text" v-model="inputTitle" :disabled="useExistedLeaf" />
        </div>
        <span class="label">日期</span>
        <span class="date">{{ today }}</span>
        <div class="control-panel-bg"></div>
        <router-link to="/" class="tree-button-add"></router-link>
      </div>
    </div>
    <div class="edit">
      <p class="edit-label">标签</p>
      <input type="text" class="prime-input input-tag" />
      <p class="edit-label">正文</p>
      <textarea v-model="inputContent" autofocus class="prime-input main-textarea" />
      <div class="edit-buttons">
        <div>发 布</div>
        <div><i class="ri-save-3-fill"></i>保 存</div>
      </div>
    </div>
    <div class="edit-to-preview"></div>
    <div class="preview">
      <h1>{{ inputTitle }}</h1>
      <div id="preview-html">
        <div :style="{ transform: `translateY(${-scrollY}px)` }" class="markdown" v-html="inputHTML"></div>
      </div>
      <div class="mask"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'
import marked from 'marked'

import { Scrollable } from '@/assets/lib'

export default defineComponent({
  name: 'Publish',
  data() {
    return {
      useExistedLeaf: false,
      inputTitle: '',

      inputContent: '',
      inputHTML: '',

      today: `${new Date().getMonth() + 1}.${new Date().getDate()}`,

      scrollY: 0,
      s: undefined as Scrollable | undefined,
    }
  },
  mounted() {
    this.inputTitle = sessionStorage.getItem('SAVED_BLOG_TITLE') || ''
    this.inputContent = sessionStorage.getItem('SAVED_BLOG_DRAFT') || ''

    const preview = this.$el.querySelector('#preview-html') as HTMLElement
    this.s = new Scrollable(preview, {
      bindEventAt: this.$el.querySelector('.preview') as HTMLElement,
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
  watch: {
    inputTitle(s: string) {
      sessionStorage.setItem('SAVED_BLOG_TITLE', s)
    },
    inputContent(s: string) {
      this.inputHTML = marked(s)
      nextTick(this.updateSize)
      sessionStorage.setItem('SAVED_BLOG_DRAFT', s)
    },
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

#publish
  margin auto
  padding 100px 20px 8vh
  max-width 1400px
  height 100%

  display flex

.edit
  flex 1 1 100px
  display flex
  flex-direction column
  .edit-label
    margin 16px 0 4px
    color $midGray
    font-size 14px
    &:first-child
      margin-top 0
  .edit-buttons
    margin-top 40px
    display flex
    >div
      margin-right 20px
      width 160px
      height 44px
      border-radius 3px
      display flex
      justify-content center
      align-items center
      background-color $midGreen
      color $white
      cursor pointer
      transition background-color .2s
      &:hover
        background-color $green - 20%
      i
        margin-right 8px

.input-tag
  font-family 14px
.main-textarea
  padding 15px 19px
  font-family 14px
  width 100%
  height 100%
  resize none

.edit-to-preview
  margin 0 30px
  flex 0 0 1px
  background-image linear-gradient(to bottom, rgba($green, .1), rgba($green, 1), rgba($green, .1))
  position relative
.preview
  flex 1 1 100px
  display flex
  flex-direction column
  position relative
  h1
    font-size 30px
    line-height 40px
    font-weight 500
    margin 20px 0 40px
    color $fontGreen
  .mask
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    background-image linear-gradient(to right, rgba($white, .9), rgba($white, 0))
    transition opacity .8s
    &:hover
      opacity 0

#preview-html
  flex 1 1 auto
  overflow hidden

.control-panel
  position fixed
  top 0
  left 0
  width 100%
  height 80px
  color $white
  background-image linear-gradient(to right, #7bb50f, #beca13)
  overflow hidden
  >div
    margin auto
    padding 20px
    max-width 1400px
    height 100%
    position relative
    perspective 5000px
    display flex
    align-items center
  .control-panel-bg
    position absolute
    top -50%
    left -10px
    padding 0 10px
    height 201%
    width 100%
    box-sizing content-box
    background-color $midGreen
    border-radius 0 0 10px 10px / 20px
    transform rotateX(-60deg)
    z-index -1
  .label
    margin-right 20px
    font-size 20px
    &:not(:first-child)
      margin-left 40px
  .date
    padding-bottom 2px
    line-height 38px
    font-family 'Quicksand'
    font-size 40px

.input-title
  position relative
  >input
    margin-right 50px
    padding 0 24px
    width 360px
    height 40px
    border-radius 20px
    font-size 18px
    font-family inherit
    color $midGray
    border none
    outline none
    position relative
    background-color $white
    transition color .2s, background-color .2s
    &:disabled
      background-color $green + 80%
      color $fontGreen
  .input-button
    position absolute
    top 0
    right 0
    padding 0 14px
    height 40px
    border-radius 20px
    width 90px
    display flex
    justify-content flex-end
    align-items center
    color $deepGreen
    font-size 24px
    background-color $green
    cursor pointer

.tree-button-add
  position absolute
  top 20px
  right 10px
  transform rotate(45deg)
</style>
