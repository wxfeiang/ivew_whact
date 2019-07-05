<template>
    <div class="comp-navbar">
        <!-- 占位栏 -->
        <div class="placeholder-bar" :style="{height: navBarHeight + 'px'}"> </div>
        <!-- 导航栏主体 -->
        <div class="navbar" :style="{height: navBarHeight + 'px',backgroundColor:navBackgroundColor}">
            <!-- 状态栏 -->
            <div class="nav-statusbar" :style="{height: statusBarHeight + 'px'}"></div>
            <!-- 标题栏 -->
            <div class="nav-titlebar" :style="{height: titleBarHeight + 'px' }">
                <!-- home及后退键 -->
                <div class="bar-options">
                    <div v-if="backVisible" class="opt opt-back" @click="backClick">
                    <image class="back-image" src="/static/images/left.png"></image>
                    </div>
                    <div class="line" v-if="backVisible && homePath"></div>
                    <div v-if="homePath" class="opt opt-home" @click="homeClick">
                    <image class="home-image" src="/static/images/ihome.png"></image>
                    </div>
                </div>
                <!-- 标题 -->
                <div class="bar-title" :style="[{color:titleColor}]">{{title}}</div>
            </div>
        </div>
        <i-toast id="toast"/>
    </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
export default {
  props: {
    // 导航栏背景色
    navBackgroundColor: {
      default: '#009efb'
    },
    // 标题颜色
    titleColor: {
      default: '#ffffff'
    },
    // 标题文字
    title: {
      required: false,
      default: '选择办理方式'
    },
    // 是否显示后退按钮
    backVisible: {
      required: false,
      default: false
    },
    // home按钮的路径
    homePath: {
      required: false,
      default: '/pages/index/main'
    }
  },
  data() {
    return {
      statusBarHeight: '', // 状态栏高度
      titleBarHeight: '', // 标题栏高度
      navBarHeight: '', // 导航栏总高度
      platform: '',
      model: '',
      brand: '',
      system: ''
    }
  },
  onLoad() {
    const self = this
    wx.getSystemInfo({
      success(system) {
        console.log(`system:`, system)
        self.statusBarHeight = system.statusBarHeight
        self.platform = system.platform
        self.model = system.model
        self.brand = system.brand
        self.system = system.system
        let platformReg = /ios/i
        if (platformReg.test(system.platform)) {
          self.titleBarHeight = 44
        } else {
          self.titleBarHeight = 48
        }
        self.navBarHeight = self.statusBarHeight + self.titleBarHeight
      }
    })
  },
  methods: {
    backClick() {
      // eslint-disable-next-line no-undef
      if (getCurrentPages().length > 1) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请完成办理方式选择!'
        })
      }
    },
    homeClick() {
      console.log('homeClick')
      wx.switchTab({
        url: this.homePath
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.comp-navbar
  width 100vw
  .navbar
    position: fixed
    left: 0
    top: 0
    width: 100%
    .nav-titlebar
      width: 100%
      display: flex
      align-items: center
      justify-content: center
      position: relative
      .bar-options
        width: 170rpx
        height: 62rpx
        display: flex
        box-sizing: border-box
        align-items: center
        justify-content: space-around
        position: absolute
        left: 7px
        display: flex
        align-items: center
        background-color: #1788d4
        border-radius: 27px
        padding-right: 5rpx
        .opt
          width: 50rpx
          height: 50rpx
          display: flex
          justify-content: center
          align-items: center
        .opt-back
          .back-image
            width: 28rpx
            height: 30rpx
        .line
          display: block
          height: 30rpx
          width: 1px
          background-color: #4da6de
        .opt-home
          .home-image
            width: 40rpx
            height: 40rpx
      .bar-title
        width: 45%
        font-size: 14px
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        text-align: center
  .placeholder-bar
    background-color: transparent
    width: 100%
</style>
