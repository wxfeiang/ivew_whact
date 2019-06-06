<template>
  <div class="bind">
    <div class="title">
      <div class="content">
        <div class="money">￥{{balance}}</div>
        <div class="title">账户余额</div>
      </div>
    </div>
    <div class="mark">
      <span class="mdivider">请选择充值金额</span>
    </div>
    <div class="money">
      <div class="imoney">
        <div class="item" v-for="(item, index) in rechargeList" :key="item.id" @click="selectRecharge(item.id, index)" :class="{isSel: item.isSel}">
          {{item.name}}元
        </div>
      </div>
      <!-- <div class="other">
        <div class="otitle">其他金额</div>
        <div class="omoney">
          <input placeholder="最低充值金额100元" maxlength="4" type="digit" v-model="otherMoney"/>
        </div>
      </div> -->
    </div>
    <div class="info">充值后,余额将进入钱包,由钱包发起圈存扣款!</div>
    <div class="rbutton">
      <button class="bbutton"  @click="recharge()">充值</button>
    </div>
    <!-- <d-dialog v-model="showUModal" type="confirm" :title="mTitle" :content="mContent" v-on:cancel="clickCancel()" @confirm="clickConfirm()" confirmText="充值"></d-dialog> -->
    <i-toast id="toast"/>
    <i-modal title="请确认充值金额是否正确" :visible="showMask"  @cancel="clickCancel" @ok="clickConfirm">
      <view>{{mContent}}</view>
    </i-modal>
  </div>
</template>

<script>
import {unifiedOrder, payment, paymentResult, walletQuery} from '@/api/pay'
import {mapState, mapMutations} from 'vuex'
import * as types from '@/store/mutation-types'
import { $Toast } from '@/utils/iview'
export default {

  data () {
    return {
      rechargeList: [
        {
          id: 1001,
          name: 100,
          isSel: true
        },
        {
          id: 1002,
          name: 300,
          isSel: false
        },
        {
          id: 1003,
          name: 500,
          isSel: false
        },
        {
          id: 1004,
          name: 700,
          isSel: false
        },
        {
          id: 1005,
          name: 1000,
          isSel: false
        },
        {
          id: 1006,
          name: 1300,
          isSel: false
        },
        {
          id: 1007,
          name: 1500,
          isSel: false
        },
        {
          id: 1008,
          name: 1700,
          isSel: false
        },
        {
          id: 1009,
          name: 2000,
          isSel: false
        }
      ],
      rechargeMoney: 100,
      mContent: '',
      showMask: false
      // otherMoney: ''
    }
  },
  // watch: {
  //   otherMoney: function (val) {
  //     if (val > 0) {
  //       this.rechargeList.forEach(element => {
  //         element.isSel = false
  //       })
  //     }
  //     // this.otherMoney = this.otherMoney.replace(/\b(0+)/gi, '')
  //   }
  // },
  computed: {
    ...mapState([
      'openid',
      'mobile',
      'balance'
    ])
  },
  methods: {
    clickCancel () {
      this.showMask = false
    },
    clickConfirm () {
      this.showMask = false
      this.toUnifiedOrder()
    },
    selectRecharge (id, index) {
      this.rechargeList.forEach(element => {
        element.isSel = false
      })
      this.rechargeList[index].isSel = true
      this.rechargeMoney = this.rechargeList[index].name
      // if (this.otherMoney > 0) {
      //   this.otherMoney = ''
      // }
    },
    recharge () {
      // this.rechargeMoney = this.calMoney()
      // if (this.rechargeMoney < 100 || this.rechargeMoney > 5000) {
      //   wx.showToast({title: `余额充值100-5000元之间!`, icon: 'none', duration: 4000})
      //   return
      // }
      // if (this.rechargeMoney % 100 !== 0) {
      //   wx.showToast({title: `充值金额为100元的整数倍!`, icon: 'none', duration: 4000})
      //   return
      // }
      if (!this.rechargeMoney || this.rechargeMoney === 0) {
        $Toast({
          type: 'error',
          duration: 3,
          content: '充值金额为空,请重试!'
        })
        return false
      }
      this.mContent = `充值金额: ￥${this.rechargeMoney}`
      this.showMask = true
    },
    async toUnifiedOrder () {
      // TODO: 金额写死1分钱
      this.rechargeMoney = '0.01'
      wx.showLoading({title: '加载中', mask: true})
      try {
        let params = {
          tradeType: 'JSAPI',
          openid: this.openid || '',
          ip: '127.0.0.1',
          signType: 'MD5',
          totalFee: this.rechargeMoney,
          body: '甘肃高速e付etc充值',
          channel: 'wx_jsapi',
          mchNo: '1000',
          payType: 11 // VIP(1, "会员支付"),ETC(2, "ETC支付"),PLATE(3, "无感支付"),NATIVE(4, "扫码支付"),MONEY(5, "现金支付"),FREE(6, "免费支付"),ADVANCE(7, "提前支付"),MWEB(8, "H5支付"),MICRO(9, "付款码支付"),NO_PAY(10, "未支付"),ETC_CHARGE(11, "ETC 充值")
        }
        let iReturn = await unifiedOrder(params)
        if (iReturn.status === 200 && iReturn.data && iReturn.data.prepayId) {
          let resultParams = {
            prepayid: iReturn.data.prepayId,
            totalFee: this.rechargeMoney,
            openid: this.openid,
            mobile: this.mobile,
            channel: 'wx_jsapi'
          }
          this.toPayment(iReturn, resultParams)
        } else {
          wx.hideLoading()
          $Toast({
            type: 'error',
            duration: 4,
            content: '支付失败: 未返回prepayId!'
          })
        }
      } catch (err) {
        console.log('unifiedOrder 失败: ' + JSON.stringify(err))
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 4,
          content: `接口异常${err}`
        })
      }
    },
    async toPayment (param, resultParams) {
      let that = this
      try {
        let params = {
          signType: 'MD5',
          channel: 'wx_jsapi',
          payType: 11, // VIP(1, "会员支付"),ETC(2, "ETC支付"),PLATE(3, "无感支付"),NATIVE(4, "扫码支付"),MONEY(5, "现金支付"),FREE(6, "免费支付"),ADVANCE(7, "提前支付"),MWEB(8, "H5支付"),MICRO(9, "付款码支付"),NO_PAY(10, "未支付"),ETC_CHARGE(11, "ETC 充值")
          packages: param.data.prepayId,
          openid: this.openid,
          outTradeNo: param.data.outTradeNo,
          payAccount: this.openid
        }
        let iReturn = await payment(params)
        wx.hideLoading()
        if (iReturn.status === 200 && iReturn.data && iReturn.data.packages) {
          wx.requestPayment({
            timeStamp: iReturn.data.timeStamp,
            nonceStr: iReturn.data.nonceStr,
            package: iReturn.data.packages,
            signType: iReturn.data.signType,
            paySign: iReturn.data.paySign,
            success (res) {
              resultParams.success = res.errMsg
              resultParams.outTradeNo = param.data.outTradeNo
              that.paymentNotice(resultParams)
            },
            fail (res) {
              resultParams.success = res.errMsg
              resultParams.outTradeNo = param.data.outTradeNo
              that.paymentNotice(resultParams)
              $Toast({
                type: 'error',
                duration: 4,
                content: `支付失败 ${res.errMsg}`
              })
            }
          })
        } else {
          $Toast({
            type: 'error',
            duration: 4,
            content: '支付失败:未返回packages!'
          })
        }
      } catch (err) {
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 4,
          content: `支付异常 ${err}`
        })
      }
    },
    paymentNotice (resultParams) {
      try {
        paymentResult(resultParams)
        this.balanceQuery()
      } catch (err) {
        console.log(`paymentNotice error: ${err}`)
      }
    },
    async balanceQuery () {
      try {
        let params = {
          openid: this.openid || ''
        }
        let iReturn = await walletQuery(params)
        if (iReturn.status === 200 && iReturn.data) {
          let tmpBalance = iReturn.data
          this.saveBalance(tmpBalance)
        }
      } catch (err) {
        console.log(`balanceQuery error: ${err}`)
      }
    },
    ...mapMutations({
      saveBalance: types.SYSTEM_BALANCE
    })
    // calMoney () {
    //   return this.otherMoney > 0 ? this.otherMoney : this.rechargeList.filter(item => item.isSel)[0].name
    // }
  }
}
</script>
<style lang="stylus" scoped>
.mark /deep/ ._i-divider
  width 90%
  height 100%
.mark /deep/ .mdivider
  width 100%
  height 100%
</style>
<style scoped lang="stylus">
.bind
  width 100%
  height 100%
  background-color bg-color
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  .title
    width 100%
    height 20%
    background-color main-color
    display flex
    flex-flow row nowrap
    justify-content center
    align-items center
    .content
      width 100%
      height 50%
      position relative // absolute
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      .money
        width 100%
        height 50%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        font-size 30px
        color #ffffff
      .title
        width 100%
        height 50%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        font-size 13px
        color #ffffff
  .mark
    width 100%
    height 10%
    display flex
    flex-flow row nowrap
    justify-content center
    align-items flex-end
    font-size 15px
    color sub-font
    .mdivider
      width 100%
      height 100%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
  .money
    width 100%
    height 36%
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    font-size 15px
    color main-font
    .imoney
      width 90%
      height 100%
      display flex
      flex-flow row wrap
      justify-content space-around
      align-items center
      .item
        width 30%
        height 25%
        border 1px #efefef solid
        border-radius 5px
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        border 1px #dddddd solid
        background-color #ffffff
      .isSel
        background-color main-color
        color #ffffff
    .other
      width 90%
      height 15%
      display flex
      flex-flow row wrap
      justify-content space-around
      align-items center
      .otitle
        width 20%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
      .omoney
        width 70%
        height 100%
        display flex
        flex-flow row wrap
        justify-content flex-start
        align-items center
        border 1px #efefef solid
        border-radius 5px
        border 1px #dddddd solid
        background-color #ffffff
  .info
    width 88%
    height 10%
    display flex
    flex-flow row wrap
    justify-content flex
    align-items center
    font-size 15px
    color sub-font
  .rbutton
    width 90%
    height 15%
    display flex
    flex-flow column nowrap
    justify-content center
    align-items center
    .bbutton
      width 100%
      height 50%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      background-color main-color
      font-size 15px
      color white-color
</style>
