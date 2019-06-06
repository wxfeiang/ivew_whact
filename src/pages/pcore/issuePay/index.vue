<template>
  <div class="pay">
    <div class="pimg">
      <img class="ppimg" :src="goods.deviceImg">
    </div>
    <div class="ptips">
      <div class="ttmoney">
        <span class="left">ETC电子标签设备</span>
        <span class="right">{{goods.deviceMoney}}元</span>
      </div>
      <div class="tmark">
        <span class="tmdot"></span>
        <span class="tmm">产品图片仅供参考，请以实际收货为准</span>
      </div>
    </div>
    <div class="pmoney">
      <!-- <div class="item">
        <span class="left">高速通行卡</span>
        <span class="right">{{goods.cardMoney}}元</span>
      </div> -->
      <div class="item">
        <span class="left">运费</span>
        <span class="right">{{goods.deliverMoney}}元</span>
      </div>
      <div class="item">
        <span class="left">合计</span>
        <span class="tright">{{goods.totalMoney}}元</span>
      </div>
    </div>
    <div class="pprotcol">
      <span class="pptitle">
        <span class="ppc">甘肃紫光将为您承担运费</span>
        <!-- <i class="icon iconfont icon-xuanze-fangkuang-tianchong ipcon"></i> -->
        <!-- <span class="ppc">已阅读并同意《用户服务协议》及《电子标签使用协议》</span> -->
      </span>
    </div>
    <div class="pbutton">
      <button class="bbutton"  @click="pay()">立即付款</button>
    </div>
    <i-toast id="toast"/>
    <i-modal title="请确认支付金额" :visible="showMask"  @cancel="clickCancel" @ok="clickConfirm">
      <view>支付金额: 0元</view>
    </i-modal>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import { goodsList } from '@/api/goods'
import { unifiedOrder, payment, paymentResult, walletQuery } from '@/api/pay'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      showMask: false,
      goods: {
        deviceImg: '',
        totalMoney: '0',
        deviceMoney: '0',
        cardMoney: '0',
        deliverMoney: '0'
      }
    }
  },
  computed: {
    ...mapState([
      'openid',
      'mobile'
    ])
  },
  methods: {
    clickCancel() {
      this.showMask = false
    },
    clickConfirm() {
      this.showMask = false
      wx.navigateTo({
        url: '../issueUpload/main'
      })
    },
    pay() {
      this.showMask = true
      // if (Number(this.goods.totalMoney) > 0) {
      //   this.toUnifiedOrder(this.goods.totalMoney)
      // }
    },
    async getGoods() {
      wx.showLoading({title: '加载中', mask: true})
      try {
        let gRetrun = await goodsList()
        wx.hideLoading()
        if (gRetrun.status === 200 && gRetrun.data && gRetrun.data.goodsInfo.length > 0) {
          this.goods.totalMoney = gRetrun.data.total
          for (let item of gRetrun.data.goodsInfo) {
            if (item.gname === '蓝牙盒子套装') {
              this.goods.deviceMoney = item.gprice
              this.goods.deviceImg = item.imgUrl
            }
            if (item.gname === '陇通卡') {
              this.goods.cardMoney = item.gprice
            }
            if (item.gname === '快递费') {
              this.goods.deliverMoney = item.gprice
            }
          }
        } else {
          wx.hideLoading()
          $Toast({
            type: 'warning',
            duration: 4,
            content: '商品信息未返回数据!'
          })
        }
      } catch (err) {
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 4,
          content: '获取商品信息失败!'
        })
      }
    },
    async toUnifiedOrder (totalMoney) {
      wx.showLoading({title: '支付中', mask: true})
      try {
        let params = {
          tradeType: 'JSAPI',
          openid: this.openid || '',
          ip: '127.0.0.1',
          signType: 'MD5',
          totalFee: totalMoney,
          body: '甘肃高速e付在线发行',
          channel: 'wx_jsapi',
          mchNo: '1000',
          payType: 12 // VIP(1, "会员支付"),ETC(2, "ETC支付"),PLATE(3, "无感支付"),NATIVE(4, "扫码支付"),MONEY(5, "现金支付"),FREE(6, "免费支付"),ADVANCE(7, "提前支付"),MWEB(8, "H5支付"),MICRO(9, "付款码支付"),NO_PAY(10, "未支付"),ETC_CHARGE(11, "ETC 充值"),EMS(12, "邮政费用")
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
          content: `网络异常,请稍后重试!${err}`
        })
      }
    },
    async toPayment (param, resultParams) {
      let that = this
      try {
        let params = {
          signType: 'MD5',
          channel: 'wx_jsapi',
          payType: 12, // VIP(1, "会员支付"),ETC(2, "ETC支付"),PLATE(3, "无感支付"),NATIVE(4, "扫码支付"),MONEY(5, "现金支付"),FREE(6, "免费支付"),ADVANCE(7, "提前支付"),MWEB(8, "H5支付"),MICRO(9, "付款码支付"),NO_PAY(10, "未支付"),ETC_CHARGE(11, "ETC 充值"),EMS(12, "邮政费用")
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
              wx.navigateTo({
                url: '../issueUpload/main'
              })
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
          content: `支付异常,请稍后重试! ${err}`
        })
      }
    },
    paymentNotice (resultParams) {
      try {
        this.balanceQuery()
        paymentResult(resultParams)
      } catch (err) {
        console.log(`paymentNotice error: ${err}`)
      }
    }
  },
  mounted () {
    this.getGoods()
  }
}
</script>
<style scoped lang='stylus'>
.pay
  width 100%
  height 100%
  background-color white-color
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  .pimg
    width 100%
    height 200px
    display flex
    flex-flow column nowrap
    justify-content center
    align-items center
    .ppimg
      width 100%
      height 100%
  .ptips
    width 100%
    height 90px
    display flex
    flex-flow column nowrap
    justify-content center
    align-items center
    .ttmoney
      width 90%
      height 30px
      display flex
      flex-flow row nowrap
      justify-content space-between
      align-items center
      .left
        width 60%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        font-size 15px
        color main-font
      .right
        width 40%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-end
        align-items center
        font-size 15px
        color main-color
    .tmark
      width 90%
      height 30px
      display flex
      flex-flow row nowrap
      justify-content space-around
      align-items center
      .tmdot
        width 5px
        height 5px
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        font-size 15px
        color sub-font
        background-color bg-color
        border-radius 5px
      .tmm
        width 99%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        font-size 12px
        color sub-font
        text-indent 5px
  .pmoney
    width 100%
    height 200px
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    .item
      width 90%
      height 30%
      display flex
      flex-flow row nowrap
      justify-content space-between
      align-items center
      border-bottom 1px bg-color solid
      .left
        width 50%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        font-size 15px
        color main-font
      .right
        width 50%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-end
        align-items center
        font-size 15px
        color sub-font
      .tright
        width 50%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-end
        align-items center
        font-size 15px
        color main-color
        text-decoration line-through
  .pprotcol
    width 100%
    height 30px
    display flex
    flex-flow row nowrap
    justify-content center
    align-items center
    font-size 10px
    color sub-font
    .pptitle
      width 100%
      height 100%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      .ipcon
        line-height 100%
        font-size 15px
        color main-color
      .ppc
        color #FF8C00
        font-size 15px
        font-weight 600
  .pbutton
    width 90%
    height 130px
    display flex
    flex-flow column nowrap
    justify-content center
    align-items center
    .bbutton
      width 100%
      height 50px
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      background-color main-color
      font-size 15px
      color white-color
      border-radius 25px
</style>
