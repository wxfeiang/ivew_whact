<template>
  <div class="service">
    <div class="service-icon">
      <image src="/static/images/logo.png" class="img"></image>
    </div>
    <div class="service-content">
      <div class="service-content-main">用户登录</div>
      <div class="service-content-sub">登录后可获得完整体验</div>
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
      <div class="service-button-view" @click="bindBtn">绑定</div>
    </div>
    <i-toast id="toast"/>
    <i-modal title="绑定成功" :visible="showMask"  :show-cancel="showCancel" @ok="handleSuccess"></i-modal>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import { mapState, mapMutations } from 'vuex'
import * as types from '@/store/mutation-types'
import { smsSend, smsVerify, userSave } from '@/api/user'
import { carBindList } from '@/api/car'
export default {
  data() {
    return {
      showMask: false,
      showCancel: false,
      mobilePhone: '',
      verifyCode: '',
      sendAuthCode: false,
      auth_time: 0
    }
  },
  computed: {
    ...mapState(['openid', 'user'])
  },
  methods: {
    bindBtn() {
      if (!/^[1]([3-9])[0-9]{9}$/.test(this.mobilePhone)) {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请填写正确的手机号码!'
        })
        return false
      }
      if (!this.mobilePhone || !this.verifyCode) {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请输入验证码!'
        })
        return false
      }
      this.toSmsVerify()
    },
    async getAuthCode() {
      if (!this.mobilePhone) {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请输入手机号!'
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
            content: '短信发送失败!'
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
    async toSmsVerify() {
      wx.showLoading({ title: '加载中', mask: true })
      let params = {
        smsCode: this.verifyCode || '',
        mobile: this.mobilePhone || ''
      }
      try {
        let iReturn = await smsVerify(params)
        wx.hideLoading()
        if (iReturn.status === 200 && iReturn.data === 'SUCCESS') {
          this.saveMobile(this.mobilePhone)
          this.toSaveUser()
        } else {
          $Toast({
            type: 'error',
            duration: 3,
            content: '短信验证码校验失败!'
          })
        }
      } catch (err) {
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 3,
          content: `短信验证码校验失败: ${err}`
        })
      }
    },
    async toSaveUser() {
      let params = {
        mobile: this.mobilePhone || '',
        signature: this.signature || '',
        openid: this.openid || '',
        encryptedData: this.encryptedData || '',
        user: this.user || '',
        iv: this.iv || '',
        sessionKey: this.sessionKey || ''
      }
      try {
        let iReturn = await userSave(params)
        wx.hideLoading()
        if (iReturn.status === 200 && iReturn.data) {
          this.getCarList()
          this.showMask = true
        }
      } catch (err) {
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 4,
          content: '绑定失败,请重试!'
        })
      }
    },
    handleSuccess() {
      this.showMask = false
      wx.redirectTo({
        url: '../bindMain/main'
      })
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
          if (iReturn.data.length > 0) {
            let tmpNewList = []
            iReturn.data.forEach((item, index) => {
              item.parkService = item.parkService === 1
              tmpNewList.push(item)
            })
            this.saveCar(tmpNewList)
          } else {
            this.saveCar(iReturn.data)
          }
        }
      } catch (err) {
        wx.hideLoading()
        console.log('App.vue 获取车辆数据失败!')
      }
    },
    ...mapMutations({
      saveMobile: types.SYSTEM_MOBILE,
      saveCar: types.SYSTEM_CAR
    })
  }
}
</script>
<style lang="stylus">
.view-button
  width 100% !important
  height 80% !important
  line-height 36px !important
  margin 1px !important
  background #22ad38 !important
  color #ffffff !important
</style>
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
