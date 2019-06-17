<template>
  <div class="index">
    <div class="bg">
      <img class="fimg" src="/static/images/index.png" alt="">
    </div>
    <div class="ccfunc">
      <div class="ctop">
        <div class="cleft" @click="gotoNavi('car')">
          <div class="citem">
            <div class="cimg"><img class="ccimg" src="/static/images/car.png" alt=""></div>
            <span class="cititle">绑定</span>
          </div>
        </div>
        <div class="ccenter" @click="gotoNavi('issue')">
          <div class="citem" :animation="animationData">
            <div class="cititle">
              <span class="cito">在线</span>
              <span class="citt">申办</span>
            </div>
          </div>
        </div>
        <div class="cright" @click="gotoNavi('load')">
          <div class="citem">
            <div class="cimg"><img class="ccimg" src="/static/images/load.png" alt=""></div>
            <span class="cititle">圈存</span>
          </div>
        </div>
      </div>
      <div class="cdown">
        <div class="cdtop">
          <div class="cdto">
            <div class="cdtot"><span class="cdimg"></span></div>
            高速ETC·申请流程
            <div class="cdtob"><span class="cdimg"></span></div>
          </div>
          <span class="cdtc">快速办理·高速相伴·快乐同行</span>
        </div>
        <div class="cddown">
          <div class="cditem">
            <span class="cdit">设备类型</span>
            <span class="cdid">记账卡先通行后付费</span>
          </div>
          <div class="cditem">
            <span class="cdit">上传资料</span>
            <span class="cdid">上传个人证件照片</span>
          </div>
          <div class="cditem">
            <span class="cdit">安装ETC</span>
            <span class="cdid">免费发货即刻送达</span>
          </div>
        </div>
      </div>
    </div>
    <div class="getuserinfo" v-if="!authenticated">
      <button class="ibutton" @getuserinfo="bindGetUserInfo" open-type="getUserInfo"></button>
    </div>
    <i-toast id="toast"/>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import {mapState} from 'vuex'
import * as types from '@/store/mutation-types'
import global from '../../utils/global'
import * as cp from '../../utils/handleLogin'
export default {
  data () {
    return {
      noData: false,
      animationData: ''
    }
  },
  methods: {
    bindGetUserInfo (e) {
      if (e.mp.detail.userInfo) {
        cp.login(() => {})
      } else {
        $Toast({
          type: 'warning',
          duration: 3,
          content: '为了您更好的体验,请先同意授权!'
        })
      }
    },
    gotoNavi (which) {
      let dest = {
        'car': '../pcore/bindMain/main',
        'recharge': '../pcore/recharge/main',
        'load': '../pimp/wallet/main',
        'issue': '../pcore/issue/main'
      }
      // cp.isLogin(() => {
      //   // this.modalVisible = true
      // wx.navigateTo({
      //   url: dest[which]
      // })
      // })
      if (!this.mobile) {
        wx.navigateTo({
          url: '../pcore/bindUser/main'
        })
      } else {
        wx.navigateTo({
          url: dest[which]
        })
      }
    }
  },
  computed: {
    ...mapState([
      'openid',
      'user',
      'authenticated',
      'mobile',
      'identityId'
    ])
  },
  onShareAppMessage () {
    return {
      title: '甘肃高速e付',
      desc: '甘肃高速e付为解决安装ETC设备的车辆在进出停车场时，无须再停车、现金交费，“停车难、缴费慢” 而产生便捷服务',
      imageUrl: '/static/images/wdcl-bj.jpg',
      path: '/pages/index/main'
    }
  },
  onShow() {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    this.animation = animation
    var next = true
    setInterval(function () {
      if (next) {
        this.animation.scale(0.98).step()
        next = !next
      } else {
        this.animation.scale(1).step()
        next = !next
      }
      this.animationData = animation.export()
    }.bind(this), 500)
  }
}
</script>
<style scoped lang="stylus">
.index
  background-color white-color
  width 100%
  height 100%
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  position relative
  .bg
    width 100%
    height 60%
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    z-index 8
    .fimg
      width 100%
      height 100%
      z-index 1
  .ccfunc
    width 100%
    height 50%
    display flex
    flex-flow column wrap
    justify-content flex-start
    align-items center
    position absolute
    top 50%
    bottom 0
    z-index 9
    .ctop
      width 100%
      height 60%
      display flex
      flex-flow row wrap
      justify-content space-around
      align-items center
      .cleft
        width 30%
        height 100%
        display flex
        flex-flow row wrap
        justify-content center
        align-items center
        .citem
          width 60px
          height 60px
          border 1px bg-color solid
          border-radius 50%
          display flex
          flex-flow column wrap
          justify-content flex-start
          align-items center
          font-size 13px
          color main-color
          margin-top 25px
          box-shadow #dddddd 0 0 5px
          .cititle
            width 100%
            height 40%
            display flex
            flex-flow row wrap
            justify-content center
            align-items flex-start
          .cimg
            width 100%
            height 60%
            display flex
            flex-flow row wrap
            justify-content center
            align-items center
            .ccimg
              width 24px
              height 24px
              font-size 20px
      .ccenter
        width 40%
        height 100%
        display flex
        flex-flow row wrap
        justify-content center
        align-items center
        .citem
          width 120px
          height 120px
          border 1px bg-color solid
          border-radius 50%
          display flex
          flex-flow row wrap
          justify-content center
          align-items center
          box-shadow #dddddd 0 0 5px
          background linear-gradient(to right top,#009EFB 20%,#72C9FD 60%)
          .cititle
            width 50%
            height 100%
            display flex
            flex-flow column wrap
            justify-content space-around
            align-items center
            font-size 20px
            color white-color
            .cito
              width 100%
              height 50%
              display flex
              flex-flow row wrap
              justify-content center
              align-items flex-end
            .citt
              width 100%
              height 50%
              display flex
              flex-flow row wrap
              justify-content center
              align-items flex-start
      .cright
        width 30%
        height 100%
        display flex
        flex-flow row wrap
        justify-content center
        align-items center
        .citem
          width 60px
          height 60px
          border 1px bg-color solid
          border-radius 50%
          display flex
          flex-flow column wrap
          justify-content flex-start
          align-items center
          font-size 13px
          color main-color
          margin-top 25px
          box-shadow #dddddd 0 0 5px
          .cititle
            width 100%
            height 40%
            display flex
            flex-flow row wrap
            justify-content center
            align-items flex-start
          .cimg
            width 100%
            height 60%
            display flex
            flex-flow row wrap
            justify-content center
            align-items center
            .ccimg
              width 24px
              height 24px
              font-size 20px
    .cdown
      width 100%
      height 40%
      display flex
      flex-flow column wrap
      justify-content flex-start
      align-items center
      position absolute
      top 58%
      .cdtop
        width 100%
        height 30%
        display flex
        flex-flow row wrap
        justify-content center
        align-items center
        .cdto
          width 100%
          height 60%
          display flex
          flex-flow row wrap
          justify-content space-around
          align-items flex-end
          font-size 13px
          color #7B7B7B
          .cdtot
            width 30%
            height 50%
            display flex
            flex-flow row wrap
            justify-content flex-end
            align-items center
            .cdimg
              width 50%
              height 1px
              background-color sub-font
              display flex
              flex-flow row wrap
              justify-content center
              align-items center
          .cdtob
            width 30%
            height 50%
            display flex
            flex-flow row wrap
            justify-content flex-start
            align-items center
            .cdimg
              width 50%
              height 1px
              background-color sub-font
              display flex
              flex-flow row wrap
              justify-content center
              align-items center
        .cdtc
          width 100%
          height 40%
          display flex
          flex-flow row wrap
          justify-content center
          align-items flex-start
          font-size 10px
          color sub-font
      .cddown
        width 95%
        height 70%
        display flex
        flex-flow row wrap
        justify-content space-around
        align-items center
        .cditem
          width 30%
          height 100%
          display flex
          flex-flow column wrap
          justify-content center
          align-items center
          .cdit
            width 100%
            height 60%
            display flex
            flex-flow row wrap
            justify-content center
            align-items flex-end
            font-size 13px
            color #7B7B7B
          .cdid
            width 100%
            height 40%
            display flex
            flex-flow row wrap
            justify-content center
            align-items center
            font-size 10px
            color sub-font
  .getuserinfo
    width 100%
    height 100vh
    position fixed
    z-index 9999
    .ibutton
      width 100%
      height 100%
      opacity 0
  .loadmore
    width 100%
    height 50px
</style>
