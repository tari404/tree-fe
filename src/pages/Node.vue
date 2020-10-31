<template>
  <div>
    <router-link to="/">返回</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Node',
  data() {
    return {
      id: this.$route.params.id as string,
    }
  },
})
</script>
