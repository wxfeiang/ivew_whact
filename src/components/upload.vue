<template>
  <div class="modals" v-if="hideModal" @touchmove.stop="touchmoveHandler">
    <div class="modals-cancel" @click="hideJectModal"></div>
    <div class="bottom-dialog-body" :animation="animationData">
      <div class="mclose" @click="hideJectModal">
        <i class="icon iconfont icon-guanbi mcimg"></i>
      </div>
      <div class="mbimg">
        <image class="mimg" :src="content"></image>
      </div>
      <!-- <div class="bbutton" @click="confirmBtn">上传</div> -->
      <button class="bbutton" :loading="setLoading" @click="confirmBtn">{{setTitle}}</button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
      required: true
    },
    content: {
      type: String,
      default: '',
      required: true
    },
    type: {
      type: String,
      default: '',
      required: true
    },
    setLoading: {
      type: Boolean,
      default: false,
      required: true
    },
    setTitle: {
      type: String,
      default: '拍照',
      required: true
    }
  },
  watch: {
    value (newVal, oldVal) {
      console.log('watch value:   ' + newVal)
      this.hideModal = newVal
    },
    hideModal (val) {
      console.log('watch hideModal:   ' + val)
    }
  },
  data () {
    return {
      hideModal: false,
      animationData: null
    }
  },
  methods: {
    touchmoveHandler() {},
    showJectModal() {
      var that = this
      this.hideModal = true
      let animation = wx.createAnimation({
        duration: 600,
        timingFunction: 'ease'
      })
      this.animation = animation
      setTimeout(function() {
        that.fadeIn()
      }, 400)
    },
    hideJectModal() {
      let that = this
      let animation = wx.createAnimation({
        duration: 700,
        timingFunction: 'ease'
      })
      this.animation = animation
      this.fadeDown() // 调用隐藏动画
      setTimeout(function() {
        that.animationData = null
        that.hideModal = false
        that.$emit('cancel')
      }, 500) // 先执行下滑动画，再隐藏模块
    },
    fadeIn() {
      this.animation.translateY(300).step()
      this.animationData = this.animation.export()
    },
    fadeDown() {
      this.animation.translateY(300).step()
      this.animationData = this.animation.export()
    },
    confirmBtn () {
      this.$emit('confirm', this.type)
    }
  },
  mounted () {
    console.log('mounted value:   ' + this.value)
    this.hideModal = this.value
  }
}
</script>
<style lang='stylus' scoped>
.modals
  width 100%
  height 300px
  position fixed
  left 0
  bottom 0
  overflow hidden
  z-index 111
  box-shadow 0px -5px 5px #888888
  .modals-cancel
    position fixed
    z-index 1000
    top 0
    left 0
    right 0
    bottom 0
    background rgba(136, 136, 136, 0.6)
    width 100%
    height 100vh
  .bottom-dialog-body
    position relative
    z-index 10001
    bottom 0
    left 0
    right 0
    height 100%
    width 100%
    background-color #fff
    .mclose
      width 100%
      height 5px
      display flex
      flex-flow row nowrap
      justify-content flex-end
      align-items center
      .mcimg
        font-size 30px
        color main-color
        line-height 100%
        margin-top 25px
    .mbimg
      height 220px
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      .mimg
        width 70%
        height 100%
    .bbutton
      width 90%
      height 45px
      z-index 9999
      bottom 0
      border 0
      color #fff
      font-size 20px
      background-color #069ff8
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
</style>
