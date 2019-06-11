<template>
  <div class="etcorder">
    <div class="etcitem" v-if="hasData">
      <div class="etitle">
        <div class="etitem">
          <span class="left">申请单号</span>
          <span class="right">{{orderDetail.audit.id}}</span>
        </div>
        <div class="splice"></div>
        <div class="etitem">
          <span class="left">办理车牌</span>
          <span class="right">{{orderDetail.audit.plateNumber}}</span>
        </div>
        <div class="splice"></div>
        <div class="etitem">
          <span class="left">申请时间</span>
          <span class="right">{{orderDetail.audit.applyTime}}</span>
        </div>
        <div class="splice"></div>
        <div class="etitem">
          <span class="left">申请结果</span>
          <span class="iwait" v-if="orderDetail.audit.applyStatus === '0'">{{orderDetail.audit.applyStatusName}}</span>
          <span class="isuccess" v-if="orderDetail.audit.applyStatus === '1'">{{orderDetail.audit.applyStatusName}}</span>
          <span class="ifail" v-if="orderDetail.audit.applyStatus === '2'">{{orderDetail.audit.applyStatusName}}</span>
        </div>
      </div>
      <div class="econtent" v-if="orderDetail.ems.length > 0">
        <div class="ecitem" v-for="item in orderDetail.ems" :key="item.id">
          <div class="left">
            <div class="dotline">
              <div class="line"></div>
              <div class="dot">
                <i class="icon iconfont icon-webicon318 dimg"></i>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="rup">
              <span class="run">[{{item.orgfullname}}]</span>
              <span class="rut">{{item.procdate}}</span>
            </div>
            <div class="rdown">
              <span class="rddes">{{item.description}}</span>
              <span class="rdact">{{item.action}}</span>
            </div>
            <!-- <div class="up">
              <div class="uleft"><span class="uutitle">【{{item.orgfullname}}】</span><span class="utitle">{{item.procdate}}</span></div>
              <span class="uright">{{item.action}}</span>
            </div>
            <div class="down">
              <span class="dleft">【{{item.description}}】</span>
            </div> -->
          </div>
        </div>
      </div>
      <div class="mcend"></div>
    </div>
    <div class="ncontent" v-else>
      <div class="iicon">
        <i class="icon iconfont icon-wushuju iimg"></i>
        <span class="iifont">未查询到数据</span>
      </div>
    </div>
    <div class="pbutton" v-if="orderDetail.ems.length > 0 && orderDetail.pay.state !=3">
      <button class="ppbutton" @click="toGot()">确认收货</button>
    </div>
    <div class="pbutton" v-if="orderDetail.audit.applyStatus === '2'">
      <button class="ppbutton" @click="reSupply()">重新提单</button>
    </div>
    <i-toast id="toast"/>
    <i-modal title="是否确认收货" :visible="showMask" @cancel="clickCancel" @ok="clickConfirm">
    </i-modal>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import { queryDetail, confirmReceipt } from '@/api/goods'
import {mapState} from 'vuex'
export default {
  data() {
    return {
      hasData: true,
      showMask: false,
      showCancel: false,
      mchOrderId: '',
      orderDetail: {
        audit: {
          id: '',
          applyTime: '',
          applyStatusName: '',
          plateNumber: '',
          applyStatus: ''
        },
        pay: {
          state: ''
        },
        ems: []
      },
      applyId: ''
    }
  },
  computed: {
    ...mapState(['openid', 'mobile'])
  },
  methods: {
    clickCancel() {
      this.showMask = false
    },
    clickConfirm() {
      this.showMask = false
      this.gotDevice()
    },
    toGot() {
      this.showMask = true
    },
    reSupply() {
      wx.navigateTo({
        url: `../etcSupply/main?applyId=${this.orderDetail.audit.id}`
      })
    },
    async getOrderDetail(applyId) {
      wx.showLoading({ title: '加载中', mask: true })
      let params = {
        id: applyId
      }
      try {
        let iReturn = await queryDetail(params)
        wx.hideLoading()
        if (iReturn.status === 200 && iReturn.data.audit) {
          // applyStatus:-1，无申请记录；0，待审核；1，审核通过；2审核拒绝。
          this.hasData = true
          this.orderDetail.audit.id = iReturn.data.audit.id
          this.orderDetail.audit.applyTime = iReturn.data.audit.applyTime
          this.orderDetail.audit.applyStatusName = iReturn.data.audit.applyStatusName
          this.orderDetail.audit.plateNumber = iReturn.data.audit.plateNumber
          this.orderDetail.audit.applyStatus = iReturn.data.audit.applyStatus
          if (iReturn.data.pay && iReturn.data.pay.state) {
            this.orderDetail.pay.state = iReturn.data.pay.state || ''
          }
          this.orderDetail.ems = iReturn.data.ems
        } else {
          this.hasData = false
          console.log('获取订单信息失败' + JSON.stringify(iReturn.data))
          $Toast({
            type: 'error',
            duration: 4,
            content: `获取订单信息失败`
          })
        }
      } catch (err) {
        this.hasData = false
        console.log('获取订单信息异常' + JSON.stringify(err))
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 5,
          content: `获取订单信息异常 ${JSON.stringify(err)}`
        })
      }
    },
    async gotDevice() {
      let iParams = {
        id: this.applyId
      }
      try {
        let gReturn = await confirmReceipt(iParams)
        if (gReturn.status === 200 && gReturn.data === 1) {
          $Toast({
            type: 'success',
            duration: 3,
            content: `确认收货成功`
          })
          this.getOrderDetail(this.applyId)
        } else {
          console.log('确认收货失败' + JSON.stringify(gReturn.data))
          $Toast({
            type: 'error',
            duration: 5,
            content: `确认收货失败 ${JSON.stringify(gReturn.data)}`
          })
        }
      } catch (err) {
        console.log('确认收货异常' + JSON.stringify(err))
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 5,
          content: `确认收货异常 ${JSON.stringify(err)}`
        })
      }
    }
  },
  onPullDownRefresh () {
    this.hasData = false
    this.getOrderDetail(this.applyId)
    wx.stopPullDownRefresh()
  },
  mounted() {
    this.applyId = this.$root.$mp.query.applyId
    this.getOrderDetail(this.applyId)
  }
}
</script>
<style scoped lang="stylus">
.etcorder
  width 100%
  background-color bg-color
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  .etcitem
    width 100%
    flex 1
    .etitle
      width 100%
      height 180px
      background-color white-color
      display flex
      flex-flow column nowrap
      justify-content space-around
      align-items center
      .splice
        width 100%
        height 1px
        background-color bg-color
      .etitem
        width 90%
        height 45px
        display flex
        flex-flow row nowrap
        justify-content space-between
        align-items center
        .left
          width 40%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          color main-font
          font-size 15px
        .right
          width 60%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-end
          align-items center
          color main-font
          font-size 15px
        .isuccess
          width 60%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-end
          align-items center
          color #28C200
          font-size 15px
        .iwait
          width 60%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-end
          align-items center
          color #009efb
          font-size 15px
        .ifail
          width 60%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-end
          align-items center
          color #FF8C00
          font-size 15px
    .econtent
      width 100%
      flex 1
      background-color white-color
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      margin-top 5px
      .ecitem
        width 90%
        height 100px
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        .left
          width 10%
          height 100%
          display flex
          flex-flow column nowrap
          justify-content flex-start
          align-items center
          .dotline
            width 100%
            height 100%
            position relative
            .line
              width 1px
              height 100%
              background bg-color
              position absolute
              top 0
              left 15px
            .dot
              width 100%
              height 50%
              position absolute
              top 10px
              .dimg
                font-size 31px
                color main-color
                line-height 100%
        .right
          width 90%
          height 100%
          display flex
          flex-flow column nowrap
          justify-content space-around
          align-items center
          border-bottom 1px bg-color solid
          .rup
            width 100%
            height 40%
            display flex
            flex-flow row nowrap
            justify-content flex-start
            align-items center
            color title-font
            font-size 14px
            .run
              width 60%
              height 100%
              display flex
              flex-flow row nowrap
              justify-content flex-start
              align-items center
              color title-font
              font-size 14px
            .rut
              width 40%
              height 100%
              display flex
              flex-flow row nowrap
              justify-content flex-end
              align-items center
              color title-font
              font-size 11px
          .rdown
            width 100%
            height 60%
            display flex
            flex-flow row nowrap
            justify-content space-around
            align-items center
            .rddes
              width 70%
              height 100%
              display flex
              flex-flow row nowrap
              justify-content flex-start
              align-items center
              color sub-font
              font-size 12px
            .rdact
              width 30%
              height 100%
              display flex
              flex-flow row nowrap
              justify-content flex-end
              align-items center
              color main-color
              font-size 14px
    .mcend
      width 100%
      height 85px
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      background-color #efefef
  .ncontent
    width 100%
    height 100vh
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    background-color bg-color
    margin-top 50px
    .iicon
      width 100%
      height 300px
      font-size 15px
      color #bdbdbd
      display flex
      flex-flow column nowrap
      justify-content center
      align-items center
      .iimg
        width 100%
        height 70%
        line-height 100%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items flex-end
        font-size 100px
      .iifont
        width 100%
        height 20%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
  .pbutton
    width 100%
    height 80px
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    background-color white-color
    z-index 1
    bottom 0
    position fixed
    .ppbutton
      width 90%
      height 44px
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      background-color main-color
      font-size 15px
      color white-color
      margin-top 5px
</style>
