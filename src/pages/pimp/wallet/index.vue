<template>
  <div class="wallet">
    <div class="title">
      <div class="content">
        <div class="money">￥{{balance}}</div>
        <div class="ctitle">账户余额</div>
      </div>
    </div>
    <div class="func">
      <div class="cash" @click="gotoNavi('recharge')">
        <img class="cimg" src="/static/images/tx.png" alt="">
        充值
      </div>
      <div class="splice"></div>
      <div class="recharge" @click="gotoNavi('bounds')">
        <img class="rimg" src="/static/images/cz.png" alt="">
        积分
      </div>
    </div>
    <div class="consum">
      <div class="ctitle">
        <div class="splice"></div>
        <div class="ccontent">充值明细</div>
        <div class="select">
          <picker class="picker" mode="date" :value="selectDate" :start="startDate" :end="endDate" fields="month" @change="dateChange">
            <div class="show">
              <div class="ptitle" v-if="selectDate === ''">
                <span class="pptitle">选择月份</span>
                <i class="icon iconfont icon-caret-down pimg"></i>
              </div>
              <div class="pptitle" v-else>{{ selectDate }}</div>
            </div>
          </picker>
        </div>
      </div>
      <div class="mcontent">
        <div class="items" v-for="(item, index) in queryList.recordList" :key="item.id">
          <div class="icontent">
            <div class="left">
              <div class="lmain">{{item.payTypeName}}</div>
              <div class="lsub">{{item.placeName}}</div>
            </div>
            <div class="right">{{item.payMoney}}</div>
          </div>
          <div class="splice"></div>
        </div>
      </div>
    </div>
    <i-toast id="toast"/>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import {walletQuery} from '@/api/pay'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      selectDate: '',
      startDate: '2019-01-01',
      endDate: '',
      queryList: {
        totalMoney: '2000.00',
        recordList: []
      }
    }
  },
  computed: {
    ...mapState([
      'openid',
      'balance'
    ])
  },
  methods: {
    gotoNavi (which) {
      let dest = {
        'recharge': '../../pcore/recharge/main',
        'bounds': '../../pcore/recharge/main'
      }
      if (which === 'bounds') {
        $Toast({
          type: 'warning',
          duration: 2,
          content: '敬请期待!'
        })
      } else {
        wx.navigateTo({
          url: dest[which]
        })
      }
    },
    getToday () {
      let myDate = new Date()
      let myMonth = myDate.getMonth() + 1
      if (myMonth < 10) {
        myMonth = '0' + myMonth // 补齐
      }
      let mydate = myDate.getDate()
      if (myDate.getDate() < 10) {
        mydate = '0' + myDate.getDate() // 补齐
      }
      let today = myDate.getFullYear() + '-' + myMonth + '-' + mydate
      return today
    },
    dateChange (e) {
      this.selectDate = e.mp.detail.value
    },
    async walletQuery () {
      wx.showLoading({title: '加载中', mask: true})
      try {
        let params = {
          openid: this.openid || ''
        }
        let iReturn = await walletQuery(params)
        wx.hideLoading()
        if (iReturn.status === 200) {
          this.balance = iReturn.data || '0.00'
        }
      } catch (err) {
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 4,
          content: `查询钱包余额异常 ${err}`
        })
      }
    }
  },
  mounted () {
    let today = this.getToday()
    this.endDate = today
    // this.walletQuery()
  }
}
</script>
<style scoped lang="stylus">
.wallet
  width 100%
  background-color #efefef
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  .title
    width 100%
    height 130px
    background-color main-color
    display flex
    flex-flow column nowrap
    justify-content center
    align-items center
    .main
      width 90%
      height 20%
      display flex
      flex-flow row nowrap
      justify-content flex-start
      align-items center
      font-size 13px
      color #ffffff
    .content
      width 100%
      height 80%
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
      .ctitle
        width 100%
        height 50%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items flex-start
        font-size 13px
        color #ffffff
  .func
    width 100%
    height 50px
    background-color #ffffff
    display flex
    flex-flow row nowrap
    justify-content space-around
    align-items center
    .cash
      width 40%
      height 100%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      font-size 17px
      color main-font
      .cimg
        width 20%
        height 65%
    .splice
      width 2px
      height 100%
      background-color #efefef
    .recharge
      width 40%
      height 100%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      font-size 17px
      color main-font
      .rimg
        width 20%
        height 65%
  .consum
    width 100%
    background-color #ffffff
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    margin-top 10px
    .ctitle
      width 95%
      height 40px
      display flex
      flex-flow row nowrap
      justify-content space-around
      align-items center
      border-bottom 1px #efefef solid
      .splice
        width 1%
        height 80%
        background-color main-color
      .ccontent
        width 34%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        font-size 15px
        color main-font
      .select
        width 60%
        height 100%
        background-color #ffffff
        display flex
        flex-flow row nowrap
        justify-content space-around
        align-items center
        .picker
          width 90%
          height 60%
          color main-color
          font-size 15px
          display flex
          flex-flow row nowrap
          justify-content flex-end
          align-items center
          .show
            width 100%
            height 100%
            display flex
            flex-flow row nowrap
            justify-content center
            align-items center
            .ptitle
              width 100%
              height 100%
              font-size 15px
              display flex
              flex-flow row nowrap
              justify-content space-around
              align-items center
              .pptitle
                width 90%
                height 100%
              .pimg
                width 10%
                height 100%
                font-size 10px
    .mcontent
      width 100%
      flex 1
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      .items
        width 90%
        height 65px
        display flex
        flex-flow column nowrap
        justify-content center
        align-items center
        .icontent
          width 100%
          height 99%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          .left
            width 70%
            height 100%
            display flex
            flex-flow column nowrap
            justify-content flex-start
            align-items center
            .lmain
              width 100%
              height 50%
              display flex
              flex-flow row nowrap
              justify-content flex-start
              align-items flex-end
              font-size 20px
              color main-font
            .lsub
              width 100%
              height 50%
              display flex
              flex-flow row nowrap
              justify-content flex-start
              align-items flex-start
              font-size 15px
              color sub-font
          .right
            width 30%
            height 100%
            display flex
            flex-flow row nowrap
            justify-content flex-end
            align-items center
            font-size 20px
            color main-font
        .splice
          width 100%
          height 1%
          background-color bg-color
</style>
