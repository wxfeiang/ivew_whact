<template>
  <div class="detail">
    <div class="head">
      <div class="hlogo">
        <image class="iimg" src="/static/images/logo.png"></image>
      </div>
      <span class="hname">甘肃省高速公路电子不停车收费(ETC)服务中心</span>
      <span class="hmoney">￥{{orderDetail.amount}}</span>
    </div>
    <div class="content">
      <div class="ititle">
        <span class="left">商品</span>
        <span class="right">{{orderDetail.body}}</span>
      </div>
      <div class="ititle">
        <span class="left">支付状态</span>
        <span class="right">{{orderDetail.payType}}</span>
      </div>
      <div class="ititle">
        <span class="left">支付时间</span>
        <span class="right">{{orderDetail.pbTime}}</span>
      </div>
      <div class="ititle">
        <span class="left">支付类型</span>
        <span class="right">{{orderDetail.billType}}</span>
      </div>
      <div class="ititle">
        <span class="left">交易单号</span>
        <span class="right">{{orderDetail.mainId}}</span>
      </div>
      <div class="ititle">
        <span class="left">商户号</span>
        <span class="right">{{orderDetail.mchId}}</span>
      </div>
      <div class="ititle" v-if="orderDetail.payType === '支付失败'">
        <span class="left">失败原因</span>
        <span class="right">{{orderDetail.errMsg}}</span>
      </div>
    </div>
    <i-toast id="toast"/>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import { orderDetail } from '@/api/pay'
export default {
  data() {
    return {
      mchOrderId: '',
      orderDetail: {
        mchId: '',
        mainId: '',
        amount: '',
        body: '',
        pbTime: '',
        payType: '',
        billType: '',
        errMsg: ''
      }
    }
  },
  methods: {
    async getOrderDetail() {
      wx.showLoading({ title: '加载中', mask: true })
      let params = {
        id: this.mainId || '',
        channel: 'wx_jsapi'
      }
      try {
        let iReturn = await orderDetail(params)
        wx.hideLoading()
        if (iReturn.status === 200) {
          this.orderDetail.mchId = iReturn.data[0].mchId || ''
          this.orderDetail.mainId = iReturn.data[0].id || ''
          this.orderDetail.amount = iReturn.data[0].amount || ''
          this.orderDetail.body = iReturn.data[0].body || ''
          this.orderDetail.pbTime = iReturn.data[0].pbTime || ''
          this.orderDetail.payType = iReturn.data[0].payType || ''
          this.orderDetail.billType = iReturn.data[0].billType || ''
          this.orderDetail.errMsg = iReturn.data[0].errMsg || ''
        }
      } catch (err) {
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 4,
          content: '获取详情失败!'
        })
      }
    }
  },
  mounted() {
    this.mainId = this.$root.$mp.query.id
    this.getOrderDetail()
  }
}
</script>
<style scoped lang="stylus">
.detail
  width 100%
  height 100%
  background-color white-color
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  .head
    width 90%
    height 30%
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    border-bottom 1px bg-color solid
    .hlogo
      width 100%
      height 40%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items flex-end
      .iimg
        width 50px
        height 50px
    .hname
      width 100%
      height 20%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items flex-end
      font-size 13px
      color main-font
    .hmoney
      width 100%
      height 40%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items flex-start
      font-size 25px
      color main-font
      font-weight 600
  .content
    width 90%
    height 70%
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    margin-top 10px
    .ititle
      width 100%
      height 40px
      display flex
      flex-flow row nowrap
      justify-content space-around
      align-items center
      font-size 14px
      .left
        width 20%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        color sub-font
      .right
        width 75%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        color main-font
</style>
