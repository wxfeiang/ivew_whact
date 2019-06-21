import { $Toast } from '@/utils/iview';
<template>
  <web-view :src="linkUrl"></web-view>
</template>

<script>
export default {
  data() {
    return {
      linkUrl: 'https://www.gsunis.cn/'
    }
  },
  methods: {},
  mounted () {
    this.linkUrl = this.$root.$mp.query.links || 'https://www.gsunis.cn/'
  }
}
</script>
<style scoped lang='stylus'>
</style>
