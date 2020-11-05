<template>
  <div id="node">
    <div class="node-menu">
      <router-link to="/">返回</router-link>
    </div>
    <div class="node-content">
      <div class="markdown" v-html="bodyHTML"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import marked from 'marked'

window.marked = marked

const testNode = {
  body: `在混用了CDN和modules来进行\`three.js\`(lib)的开发时，出现了从modules里引入的\`RawShaderMaterial\`可用，但是从CDN里引入的\`RawShaderMaterial\`工作不正常的问题。

起初观察到问题出现，是在添加post processing的时候，\`RawShaderMaterial\`没有像预期的一样工作——片段和面元着色器前均仍被加上了\`three.js\`(lib)的预置前缀。起初以为是引入的CDN资源有问题、版本不匹配，但是更换CDN确认版本后问题没有被定位到。

最终是从分析代码发现了这个愚蠢的错误：我使用的\`RawShaderMaterial\`来自CDN全局引入的THREE对象，但是\`ShaderPass\`是从\`three/examples/jsm/...\`引入的。在\`ShaderPass\`中通过\`shader instanceof ShaderMaterial\`来判断传入的参数是一组参数还是一个Material。而显然，虽然同为\`RawShaderMaterial\`，但全局的THREE和从modules中引入的是不同的类，因此\`ShaderPass\`将我传入的\`RawShaderMaterial\`对象当成一组参数解析，并重新生成了一个\`ShaderMaterial\`，导致了预期外的效果。

知道问题后解决方案就很清晰了，在使用CDN优化\`three.js\`(lib)库加载速度的情况下，应该从\`three/examples/js/\`目录下引入其他资源，使其在全局的THREE上获取必要的依赖并注入。之前错误的CDN、modules混用的做法不仅导致了bug的出现，也徒增了打包的js文件大小。`,
}

export default defineComponent({
  name: 'Node',
  data() {
    return {
      id: this.$route.params.id as string,
      node: testNode,
    }
  },
  computed: {
    bodyHTML(): string {
      return marked(this.node.body)
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$emit('leave', to, from, next)
  },
})
</script>

<style lang="stylus" scoped>
@import '~@/color.styl'

$dev = 0

#node
  margin auto
  padding 8vh 0
  max-width 1400px
  height 100vh
  display flex
  background-color rgba(green, $dev)

.node-menu
  padding 0 30px
  flex 0 0 200px
  background-color $green - 30%
  color $white
  position relative
  &:before
    content ''
    position absolute
    right 0
    top -8vh
    width 100vw
    height 100vh
    background-color $green - 30%
    z-index -1

.node-content
  flex 1 1 auto
  display flex
  justify-content center
  background-color rgba(yellow, $dev)
  animation move-up .5s forwards
  >div
    padding 0 20px
    max-width 760px
    background-color rgba(green, $dev)

@keyframes move-up
  from
    transform translateY(20px)
  to
    transform translateY(0)

@media screen and (max-width 800px)
  .node-menu
    flex 0 0 100px
</style>
