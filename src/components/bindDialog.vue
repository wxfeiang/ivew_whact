<template>
  <div class="dialog" v-show="showMask">
    <div class="dialog-container">
      <div class="dialog-title">{{title}}</div>
      <div class="dialog-content">
        <div class="ccontent">
          <div class="mobile">
            <input class="minput" v-model="mobilePhone" type="number" mode="wrapped" maxlength="11" placeholder="请输入手机号" />
          </div>
          <div class="splice"></div>
          <div class="code">
            <div class="content">
              <input class="cinput" v-model="verifyCode" type="number" mode="wrapped" maxlength="6" placeholder="请输入短信验证码" />
            </div>
            <div class="verify">
              <span class="send" @click="getAuthCode" v-if="!sendAuthCode">获取验证码</span>
              <span class="send" v-if="sendAuthCode">{{auth_time}}s</span>
            </div>
          </div>
        </div>
      </div>
      <div class="btns">
        <div class="default-btn" @click="closeBtn">
          {{cancelText}}
        </div>
        <div class="bsplice"></div>
        <div class="bind-btn" @click="bindBtn">
          {{bindText}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import * as types from '@/store/mutation-types'
import {smsSend, smsVerify, userSave} from '@/api/user'
export default {
  props: {
    value: {},
    // 类型 只有 bind 绑定，用户用户绑定
    type: {
      type: String,
      default: 'bind'
    },
    title: {
      type: String,
      default: '请绑定手机号'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    bindText: {
      type: String,
      default: '绑定'
    }
  },
  computed: {
    ...mapState([
      'openid',
      'user'
    ])
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
      showMask: false,
      mobilePhone: '',
      verifyCode: '',
      sendAuthCode: false,
      auth_time: 0,
      authTimer: ''
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
    bindBtn () {
      if (!(/^1[34578]\d{9}$/.test(this.mobilePhone))) {
        wx.showToast({title: `请填写正确的手机号码!`, icon: 'none', duration: 4000})
        return false
      }
      if (!this.mobilePhone || !this.verifyCode) {
        wx.showToast({title: `请输入验证码`, icon: 'none', duration: 4000})
        return false
      }
      this.toSendSMS()
    },
    async getAuthCode () {
      if (!this.mobilePhone) {
        wx.showToast({title: `请输入手机号`, icon: 'none', duration: 4000})
        return false
      }
      if (!(/^1[34578]\d{9}$/.test(this.mobilePhone.replace(/\s+/g, '')))) {
        wx.showToast({title: `请输入正确的手机号码`, icon: 'none', duration: 4000})
        return false
      }
      wx.showLoading({title: '加载中', mask: true})
      try {
        let params = {
          openid: this.openid || '',
          mobile: this.mobilePhone
        }
        let iReturn = await smsSend(params)
        wx.hideLoading()
        if (iReturn.status === 200) {
          this.sendAuthCode = true
          this.verifyCode = iReturn.data
          // 设置倒计时秒
          this.auth_time = 60
          this.authTimer = setInterval(() => {
            this.auth_time--
            if (this.auth_time <= 0) {
              this.sendAuthCode = false
              clearInterval(this.authTimer)
            }
          }, 1000)
        } else {
          wx.showToast({title: `获取验证码失败,请重试!`, icon: 'none', image: '../../../static/images/error.png', duration: 4000})
        }
      } catch (err) {
        wx.hideLoading()
        wx.showToast({title: `${err}`, icon: 'none', duration: 4000})
      }
    },
    async toSendSMS () {
      wx.showLoading({title: '加载中', mask: true})
      let params = {
        smsCode: this.verifyCode || '',
        mobile: this.mobilePhone || ''
      }
      try {
        let iReturn = await smsVerify(params)
        if (iReturn.status === 200) {
          this.saveMobile(this.mobilePhone)
          this.toSaveUser()
        }
      } catch (err) {
        wx.hideLoading()
        wx.showToast({title: `${err}`, icon: 'none', duration: 4000})
      }
    },
    async toSaveUser () {
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
        if (iReturn.status === 200) {
          this.$emit('bind')
          this.closeMask()
        }
      } catch (err) {
        wx.hideLoading()
        wx.showToast({title: `${err}`, icon: 'none', duration: 4000})
      }
    },
    ...mapMutations({
      saveMobile: types.SYSTEM_MOBILE
    })
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
    height 45%
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
    .btns
      width 100%
      height 60px
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
      .bind-btn
        width 90%
        height 100%
        color main-color
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
      .confirm-btn
        color main-color
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
</style>