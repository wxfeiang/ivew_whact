<template>
  <div class="dialog" v-show="showMask">
    <div class="dialog-container">
      <div class="dialog-title">{{title}}</div>
      <div class="dialog-content">
          <div class="ccontent" style="white-space: pre-wrap;" v-html="content"></div>
      </div>
      <div class="btns">
        <div v-if="type != 'tips'" class="default-btn" @click="closeBtn">
          {{cancelText}}
        </div>
        <div class="bsplice" v-if="type != 'tips'"></div>
        <div class="confirm-btn" @click="confirmBtn">
          {{confirmText}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {},
    // 类型包括 tips 默认提示， confirm 确认，
    type: {
      type: String,
      default: 'tips'
    },
    content: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    bindText: {
      type: String,
      default: '确认'
    },
    confirmText: {
      type: String,
      default: '确认'
    }
  },
  watch: {
    value (newVal, oldVal) {
      this.showMask = newVal
    },
    showMask (val) {
      this.$emit('input', val)
    }
  },
  data () {
    return {
      showMask: false
    }
  },
  methods: {
    closeMask () {
      this.showMask = false
    },
    closeBtn () {
      this.$emit('cancel')
      this.closeMask()
    },
    confirmBtn () {
      this.$emit('confirm')
      this.closeMask()
    }
  },
  mounted () {
    this.showMask = this.value
  }
}
</script>
<style lang="stylus" scoped>
.dialog
  position: fixed
  top 0
  bottom 0
  left 0
  right 0
  background rgba(0, 0, 0, 0.6)
  z-index 9999
  .dialog-container
    width 80%
    height 28%
    background #ffffff
    position: absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    border-radius 8px
    position relative
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    .dialog-title
      width 100%
      height 60px
      font-size 18px
      color #202336
      // font-weight 600
      padding 16px 20px 0 20px
      box-sizing border-box
      display flex
      flex-flow row nowrap
      justify-content center
      align-items flex-start
    .dialog-content
      width 100%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      .ccontent
        width 100%
        flex 1
        color #838790
        padding 0 20px
        box-sizing border-box
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        font-size 15px
    .btns
      width 100%
      height 50px
      position absolute
      bottom 0
      left 0
      text-align right
      padding 0 16px
      box-sizing border-box
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      border-top 1px #e9eaec solid
      .bsplice
        width 1px
        height 100%
        background-color #e9eaec
      .default-btn
        width 90%
        height 100%
        color sub-font
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
      .confirm-btn
        width 90%
        height 100%
        color main-color
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
</style>