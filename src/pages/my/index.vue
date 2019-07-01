<template>
  <div class="my">
    <div class="info" @click="gotoNavi('userInfo')">
      <div class="pic">
        <img class="img" :src="user.avatarUrl" v-if="user">
        <img class="img" src="/static/images/zhxx.png" v-else>
      </div>
      <div class="person">
        <div class="name" v-if="user">{{user.nickName}}</div>
        <div class="name" v-else>未登录</div>
        <div class="tel"  v-if="mobile">{{mobile}}</div>
        <div class="tel" v-else>请绑定用户</div>
      </div>
      <div class="more"><i class="icon iconfont icon-right img"></i></div>
    </div>
    <div class="core">
      <!-- <div class="item" @click="gotoNavi('wallet')">
        <div class="icon packet"><i class="icon iconfont icon-accountbook-fill img"></i></div>
        <div class="content">在线充值</div>
        <div class="more"><i class="icon iconfont icon-right img"></i></div>
      </div>
      <div class="splice"></div> -->
      <!-- <div class="item" @click="gotoNavi('scan')">
        <div class="icon scan"><i class="icon iconfont icon-fukuanma img"></i></div>
        <div class="content">扫码支付</div>
        <div class="more"><i class="icon iconfont icon-right img"></i></div>
      </div>
      <div class="splice"></div>
      <div class="item" @click="gotoNavi('scanPay')">
        <div class="icon scan"><i class="icon iconfont icon-fukuanma img"></i></div>
        <div class="content">付款码</div>
        <div class="more"><i class="icon iconfont icon-right img"></i></div>
      </div>
      <div class="splice"></div> -->
      <div class="item" @click="gotoNavi('car')">
        <div class="icon car"><i class="icon iconfont icon-dkw_qiche img"></i></div>
        <div class="content">我的车辆</div>
        <div class="more"><i class="icon iconfont icon-right img"></i></div>
      </div>
      <!-- <div class="splice"></div>
      <div class="item" @click="gotoNavi('card')">
        <div class="icon card"><i class="icon iconfont icon-creditcard-fill img"></i></div>
        <div class="content">我的ETC卡</div>
        <div class="more"><i class="icon iconfont icon-right img"></i></div>
      </div> -->
      <div class="splice"></div>
      <div class="item" @click="gotoNavi('consum')">
        <div class="icon packet"><i class="icon iconfont icon-yiliaozhuanruchaxun img"></i></div>
        <div class="content">消费记录</div>
        <div class="more"><i class="icon iconfont icon-right img"></i></div>
      </div>
      <div class="splice"></div>
      <div class="item" @click="gotoNavi('order')">
        <div class="icon order"><i class="icon iconfont icon-gerenjibenxinxichaxunxiugai img"></i></div>
        <div class="content">我的订单</div>
        <div class="more"><i class="icon iconfont icon-right img"></i></div>
      </div>
      <div class="splice"></div>
      <div class="item" @click="gotoNavi('debet')">
        <div class="icon debet"><i class="icon iconfont icon-yibaoyue img"></i></div>
        <div class="content">垫资还款</div>
        <div class="more"><i class="icon iconfont icon-right img"></i></div>
      </div>
    </div>

    <!-- <div class="record">
      <div class="item" @click="gotoNavi('consum')">
        <div class="icon consum"><i class="icon iconfont icon-number1 img"></i></div>
        <div class="content">我的订单</div>
        <div class="more"><i class="icon iconfont icon-right img"></i></div>
      </div>
    </div> -->

    <div class="help">
      <div class="item" @click="gotoNavi('about')">
        <div class="icon about"><i class="icon iconfont icon-moduanwangdian img"></i></div>
        <div class="content">关于我们</div>
        <div class="more"><i class="icon iconfont icon-right img"></i></div>
      </div>
    </div>

    <div class="getuserinfo" v-if="!authenticated">
      <button class="button" @getuserinfo="bindGetUserInfo" open-type="getUserInfo"></button>
    </div>
    <i-toast id="toast"/>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import {mapState} from 'vuex'
import * as types from '@/store/mutation-types'
import * as cp from '../../utils/handleLogin'
import { queryDebt } from '@/api/pay'
export default {
  data () {
    return {
      userInfo: {
        sales: '0',
        credit: '0'
      }
    }
  },
  computed: {
    ...mapState([
      'openid',
      'user',
      'mobile',
      'authenticated'
    ])
  },
  methods: {
    bindGetUserInfo (e) {
      if (e.mp.detail.userInfo) {
        cp.login(() => {
        })
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
        'scan': '../pimp/scanPay/main',
        'scanPay': '../pimp/payCode/main',
        'userInfo': '../pimp/userInfo/main',
        'balance': '../pcore/recharge/main',
        'coupon': '../pimp/coupon/main',
        'bonus': '../pimp/bonus/main',
        'wallet': '../pimp/wallet/main',
        'car': '../pcore/bindMain/main',
        'card': '../pimp/card/main',
        'consum': '../pimp/consum/main',
        'help': '../pimp/help/main',
        'about': '../pimp/about/main',
        'issue': '../pimp/issue/main',
        'order': '../pimp/etcList/main',
        'debet': ''
      }
      // cp.isLogin(() => {
      // wx.navigateTo({
      //   url: dest[which]
      // })
      // })
      if (!this.mobile) {
        wx.navigateTo({
          url: '../pcore/bindUser/main'
        })
      } else {
        if (which === 'traffic') {
          wx.navigateTo({
            url: '../pimp/traffic/main?type=all'
          })
        } else if (which === 'debet') {
          this.queryRepapment()
        } else {
          wx.navigateTo({
            url: dest[which]
          })
        }
      }
    },
    async queryRepapment() {
      try {
        let iparam = {
          channel: 'wx_repay',
          openid: this.openid
        }
        let iReturn = await queryDebt(iparam)
        console.log('垫资还款返回:  ' + JSON.stringify(iReturn))
        if (iReturn.status === 200 && iReturn.data) {
          if (iReturn.data !== -1) {
            wx.navigateToMiniProgram({
              appId: iReturn.data.app_id,
              path: iReturn.data.app_id === 'wx71ed9a74b2a75c42' ? 'pages/index/main' : 'pages/invest_list/invest_list',
              extraData: iReturn.data,
              envVersion: 'develop',
              success: res => {
                console.log('跳转垫资还款小程序成功: ' + iReturn.data.app_id + '' + JSON.stringify(res))
              },
              fail: res => {
                console.log('跳转垫资还款小程序失败: ' + iReturn.data.app_id + ' ' + JSON.stringify(res))
                $Toast({
                  type: 'warning',
                  duration: 4,
                  content: `请允许跳转垫资还款小程序!`
                })
              }
            })
          } else {
            $Toast({
              type: 'success',
              duration: 4,
              content: '您的信用良好,暂无欠费!'
            })
          }
        } else {
          console.log('查询垫资欠费失败: ' + JSON.stringify(iReturn))
        }
      } catch (err) {
        console.log('查询垫资欠费异常: ' + JSON.stringify(err))
      }
    }
  }
}
</script>
<style scoped lang="stylus">
.my
  background-color bg-color
  width 100%
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items flex-start
  .info
    width 100%
    height 110px
    background-color main-color
    display flex
    flex-flow row nowrap
    justify-content center
    align-items center
    .pic
      width 25%
      height 100%
      display flex
      flex-flow row nowrap
      justify-content flex-end
      align-items center
      .img
        width 66px
        height 66px
        border-radius 50px
        border 1px #ffffff solid
        background-color #ffffff
    .person
      width 60%
      height 100%
      display flex
      flex-flow column nowrap
      justify-content center
      align-items center
      color #ffffff
      padding-left 10px
      .name
        width 100%
        height 50%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items flex-end
        font-size 20px
      .tel
        width 100%
        height 50%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items flex-start
        font-size 15px
    .more
      width 15%
      height 100%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      color #ffffff
  .core
    width 100%
    flex 1
    background-color #ffffff
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    .splice
      width 100%
      height 1px
      border-bottom 1px #efefef solid
    .item
      width 100%
      height 50px
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      .icon
        width 15%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        .img
          line-height 90%
          font-size 30px
        &.order
          color #437dff
        &.packet
          color #ff745d
        &.car
          color #4ba0e0
        &.card
          color #b196c1
        &.debet
          color #b196c1
      .content
        width 70%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        font-size 18px
        color main-font
      .more
        width 15%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        color #9b9b9b
  .record
    width 100%
    height 50px
    margin-top 5px
    background-color #ffffff
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    .splice
      width 100%
      height 1px
      border-bottom 1px #efefef solid
    .item
      width 100%
      height 100%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      .icon
        width 15%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        .img
          font-size 30px
        &.consum
          color #4ba0e0
        &.traffic
          color #ffb14a
      .content
        width 70%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        font-size 18px
        color main-font
      .more
        width 15%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        color #9b9b9b
  .help
    width 100%
    height 50px
    margin-top 5px
    background-color #ffffff
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    .splice
      width 100%
      height 1px
      border-bottom 1px #efefef solid
    .item
      width 100%
      height 100%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      .icon
        width 15%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        .img
          font-size 30px
        &.service
          color #4ba0e0
        &.about
          color #8fc273
      .content
        width 70%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        font-size 18px
        color main-font
      .more
        width 15%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        color #9b9b9b
  .getuserinfo
    width 100%
    height 100vh
    position fixed
    z-index 9999
    .button
      width 100%
      height 100%
      opacity 0
</style>
