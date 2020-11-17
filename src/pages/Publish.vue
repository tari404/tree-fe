<template>
  <div id="publish">
    <div class="edit">
      <textarea v-model="inputContent" class="main-textarea" />
    </div>
    <div class="edit-to-preview"></div>
    <div class="preview">
      <div class="markdown" v-html="inputHTML"></div>
    </div>
    <div class="control-panel">
      <div>
        <router-link to="/">返回</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import marked from 'marked'

export default defineComponent({
  name: 'Publish',
  data() {
    return {
      inputContent: '',
      inputHTML: '',
    }
  },
  mounted() {
    this.inputContent = sessionStorage.getItem('SAVED_BLOG_DRAFT') || ''
  },
  watch: {
    inputContent(s: string) {
      this.inputHTML = marked(s)
      sessionStorage.setItem('SAVED_BLOG_DRAFT', s)
    },
  },
})
</script>

<style lang="stylus" scoped>
@import '~@/color.styl'

#publish
  margin auto
  padding 180px 20px 8vh
  max-width 1400px
  height 100%

  display flex

.main-textarea
  padding 15px 19px
  width 100%
  height 100%
  resize none
  border-radius 6px
  border solid 1px $gray
  font-family inherit
  font-size 14px
  color $midGray
  line-height 24px
.edit
  flex 1 1 100px
.edit-to-preview
  margin 0 20px
  flex 0 0 80px
  background-color $green + 80%
.preview
  flex 1 1 200px
  padding 16px 0

.control-panel
  position fixed
  top 0
  left 0
  width 100%
  height 160px
  color $white
  >div
    margin auto
    padding 20px
    max-width 1400px
    height 100%
    border-radius 0 0 10px 10px
    background-color $deepGreen
</style>
