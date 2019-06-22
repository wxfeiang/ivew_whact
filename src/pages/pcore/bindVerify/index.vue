<template>
  <div class="service">
    <div class="service-icon">
      <image src="/static/images/logo.png" class="img"></image>
    </div>
    <div class="service-content">
      <div class="service-content-main">手机验证</div>
      <div class="service-content-sub">请输入手机号码,获取验证码验证</div>
    </div>
    <div class="ccontent">
          <div class="mobile">
            <input
              class="minput"
              v-model="mobilePhone"
              type="number"
              mode="wrapped"
              maxlength="11"
              placeholder="请输入手机号"
            >
          </div>
          <div class="splice"></div>
          <div class="code">
            <div class="content">
              <input
                class="cinput"
                v-model="verifyCode"
                type="number"
                mode="wrapped"
                maxlength="6"
                placeholder="请输入短信验证码"
              >
            </div>
            <div class="verify">
              <span class="send" @click="getAuthCode" v-if="!sendAuthCode">获取验证码</span>
              <span class="send" v-if="sendAuthCode">{{auth_time}}s</span>
            </div>

          </div>
          <div class="splice"></div>
        </div>
    <div class="service-button">
      <div class="service-button-view" @click="handleComfirm">绑定</div>
    </div>
    <i-toast id="toast"/>
    <i-modal title="车辆绑定成功" :visible="showMask"  :show-cancel="showCancel" @ok="clickConfirm">
      <view>{{mContent}}</view>
    </i-modal>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import { smsSend, smsVerify } from '@/api/user'
import { carBindList, carBind, carServices, carServicesOpen } from '@/api/car'
import { mapState, mapMutations } from 'vuex'
import * as types from '@/store/mutation-types'
export default {
  data() {
    return {
      showMask: false,
      showCancel: false,
      mContent: '',
      mobilePhone: '',
      verifyCode: '',
      sendAuthCode: false,
      auth_time: 0,
      showFinish: false,
      showFailBtn: false,
      plateNumber: ''
    }
  },
  computed: {
    ...mapState(['openid', 'mobile'])
  },
  methods: {
    clickConfirm() {
      this.showMask = false
      this.openCarService()
      // wx.navigateBack({
      //   delta: 2
      // })
    },
    async getCarList() {
      wx.showLoading({ title: '加载中', mask: true })
      let params = {
        openid: this.openid || '',
        mobile: this.mobile || ''
      }
      try {
        let iReturn = await carBindList(params)
        wx.hideLoading()
        if (iReturn.status === 200 && iReturn.data) {
          this.saveCar(iReturn.data)
        }
      } catch (err) {
        console.log('获取车辆列表异常: ', err)
        wx.hideLoading()
      }
    },
    async openCarService() {
      // 车主服务
      wx.showLoading({ title: '加载中', mask: true })
      let params = {
        tradeScene: 'HIGHWAY',
        subOpenid: this.openid || '',
        plateNumber: this.plateNumber || '',
        channelType: 'ETC'
      }
      try {
        let iReturn = await carServices(params)
        console.log('查询状态:   ' + JSON.stringify(iReturn))
        if (iReturn.status === 200 && iReturn.data) {
          // NORMAL 正常用户，已开通车主服务，且已授权访问
          // PAUSED 已暂停车主服务
          // OVERDUE 用户已开通车主服务，但欠费状态。提示用户还款，请跳转到车主服务
          // UNAUTHORIZED 用户未授权使用当前业务，或未开通车主服务。请跳转到授权接口
          if (
            iReturn.data.userState &&
            iReturn.data.userState === 'UNAUTHORIZED' &&
            iReturn.data.path &&
            iReturn.data.path === '/pages/route/index'
          ) {
            let aReturn = await carServicesOpen(params)
            if (aReturn.status === 200 && aReturn.data) {
              this.gotoCarServiceApp(iReturn.data.path, aReturn.data)
            }
          } else {
            wx.navigateBack({
              delta: 2
            })
          }
          wx.hideLoading()
        } else {
          wx.navigateBack({
            delta: 2
          })
        }
      } catch (err) {
        wx.hideLoading()
        wx.navigateBack({
          delta: 2
        })
      }
    },
    gotoCarServiceApp(ipath, iparm) {
      let that = this
      // 车主服务
      wx.hideLoading()
      wx.navigateToMiniProgram({
        appId: 'wxbcad394b3d99dac9',
        path: ipath || '/pages/route/index',
        extraData: iparm.extraData,
        success(res) {
          console.log('bindVerify success: ' + JSON.stringify(res))
        },
        fail(res) {
          console.log('bindVerify fail: ' + JSON.stringify(res))
        },
        complete(res) {
          console.log('bindVerify complete:' + JSON.stringify(res))
          that.savePlateNo(that.plateNumber)
          wx.navigateBack({
            delta: 2
          })
        }
      })
    },
    async getAuthCode() {
      if (!this.mobilePhone) {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请输入手机号码!'
        })
        return false
      }
      if (!/^[1]([3-9])[0-9]{9}$/.test(this.mobilePhone.replace(/\s+/g, ''))) {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请输入正确的手机号码!'
        })
        return false
      }
      wx.showLoading({ title: '加载中', mask: true })
      try {
        let params = {
          userId: this.openid || '',
          mobile: this.mobilePhone
        }
        let iReturn = await smsSend(params)
        wx.hideLoading()
        if (iReturn.status === 200 && iReturn.data === 'SUCCESS') {
          this.sendAuthCode = true
          // 设置倒计时秒
          this.auth_time = 60
          this.authTimer = setInterval(() => {
            this.auth_time--
            if (this.auth_time <= 0) {
              this.sendAuthCode = false
              clearInterval(this.authTimer)
            }
          }, 1000)
          $Toast({
            type: 'success',
            duration: 3,
            content: '短信发送成功!'
          })
        } else {
          $Toast({
            type: 'warning',
            duration: 4,
            content: '发送短信验证码失败!'
          })
        }
      } catch (err) {
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 4,
          content: `网络异常,请稍后再试!`
        })
      }
    },
    async handleComfirm() {
      let that = this
      if (this.mobilePhone === '') {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请输入手机号码!'
        })
        return false
      }
      if (this.verifyCode === '') {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请先获取验证码!'
        })
        return false
      }
      if (!/^[1]([3-9])[0-9]{9}$/.test(this.mobilePhone)) {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请填写正确的手机号码!'
        })
        return false
      }
      wx.showLoading({ title: '加载中', mask: true })
      try {
        let params = {
          smsCode: this.verifyCode,
          mobile: this.mobilePhone
        }
        let iReturn = await smsVerify(params)
        if (iReturn.status === 200 && iReturn.data === 'SUCCESS') {
          let iParams = {
            userId: this.openid || '',
            plateNo: this.plateNumber || '',
            plateColor: '0',
            carType: '1',
            mobile: this.mobile || ''
          }
          let iiReturn = await carBind(iParams)
          if (iiReturn.status === 200 && iiReturn.data === 'SUCCESS') {
            this.getCarList()
            this.showMask = true
            this.mContent = `车牌号: ${that.plateNumber}`
          } else {
            $Toast({
              type: 'error',
              duration: 4,
              content: '车辆绑定失败!'
            })
          }
        } else {
          $Toast({
            type: 'error',
            duration: 4,
            content: '短信验证码错误!'
          })
        }
        wx.hideLoading()
      } catch (err) {
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 4,
          content: `短信验证码校验失败: ${err}`
        })
      }
    },
    ...mapMutations({
      saveCar: types.SYSTEM_CAR,
      savePlateNo: types.SYSTEM_PLATENO
    })
  },
  mounted() {
    this.plateNumber = this.$root.$mp.query.plateNumber
  }
}
</script>
<style scoped lang="stylus">
.service
  width 100%
  height 100%
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  background-color white-color
  &-icon
    width 100%
    height 150px
    color #22ad38
    display flex
    flex-flow row nowrap
    justify-content center
    align-items center
    .img
      width 84px
      height 84px
      font-size 100px
      display flex
      flex-flow row nowrap
      justify-content center
      align-items flex-end
  &-content
    width 100%
    height 100px
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    &-main
      width 100%
      height 50%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items flex-start
      color #1f1f1f
      font-size 25px
    &-sub
      width 100%
      height 50%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items flex-start
      color #707070
      font-size 18px
  &-button
    width 100%
    height 100px
    display flex
    flex-flow row wrap
    justify-content center
    align-items center
    &-view
      width 90%
      height 40%
      background-color main-color
      color #ffffff
      display flex
      flex-flow row wrap
      justify-content center
      align-items center
      border-radius 5px
  .ccontent
    width 100%
    height 150px
    color #838790
    padding 0 20px
    box-sizing border-box
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items flex-start
    .ccccontent
      width 100%
      color #838790
      padding 0 20px
      box-sizing border-box
      display flex
      flex-flow row nowrap
      justify-content flex-start
      align-items center
    .splice
      width 100%
      height 1px
      background-color bg-color
    .mobile
      width 100%
      height 50px
      display flex
      flex-flow row nowrap
      justify-content flex-start
      align-items center
      .minput
        width 100%
        padding-left 8px
        font-size 15px
        color title-font
    .code
      width 100%
      height 50px
      display flex
      flex-flow row nowrap
      justify-content space-between
      align-items center
      margin-top 20px
      .content
        width 60%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        .cinput
          width 100%
          padding-left 8px
          font-size 15px
          color title-font
      .verify
        width 38%
        height 75%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        .send
          width 100%
          height 85%
          // -color sub-color
          border 1px sub-color solid
          color sub-color
          font-size 15px
          border-radius 5px
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
</style>
