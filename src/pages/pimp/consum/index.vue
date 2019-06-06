<template>
  <div class="deposit">
    <div class="select">
      <div class="date">
        <picker
          class="picker"
          mode="date"
          :value="selectDate"
          :start="startDate"
          :end="endDate"
          fields="month"
          @change="dateChange"
        >
          <div class="show">
            <div class="title" v-if="selectDate === ''">
              <span class="title">选择日期</span>
              <i class="icon iconfont icon-caret-down img"></i>
            </div>
            <div class="title" v-else>
              {{ selectDate }}
              <i class="icon iconfont icon-caret-down img"></i>
            </div>
          </div>
        </picker>
      </div>
      <div class="money">支出合计: ￥{{recordData.totalMoney}}</div>
    </div>
    <div class="content" v-if="hasData">
      <div
        class="items"
        v-for="(item, index) in recordData.itemList"
        :key="item.id"
      >
        <div class="itime">{{item.payTime}}</div>
        <div class="icontent">
          <div class="ilogo">
              <image class="ilogoimg" src="/static/images/logo.png"></image>
              <span class="ilogotext">兰州市北斗星瑞物业管理有限公司</span>
          </div>
          <div class="ititel">
            <span class="iit">付款金额</span>
            <span class="iim">￥{{item.amount}}</span>
          </div>
          <div class="splice"></div>
          <div class="idetail" @click="gotoDetail(item)">
            <span class="idt">查看账单详情</span>
            <span class="idi"><i class="icon iconfont icon-right dimg"></i></span>
          </div>
        </div>
      </div>
    </div>
    <div class="ncontent" v-if="!hasData">
      <div class="iicon">
        <i class="icon iconfont icon-wushuju iimg"></i>
        <span class="iifont">未查询到数据</span>
      </div>
    </div>
    <div class="loadmore" v-if="loadMore">
      <i-load-more  class="load" i-class="view-loadmore" tip="加载中" :loading="loadMore" />
    </div>
    <div class="loadmore"  v-if="noData">
      <i-load-more  class="load" i-class="view-loadmore" tip="我是有底线的" :loading="loadMore" />
    </div>
    <i-toast id="toast"/>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import { orderQuery } from '@/api/pay'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      hasData: true,
      noData: false,
      selectDate: '',
      startDate: '2019-01-01',
      endDate: '',
      recordData: {
        totalMoney: 0,
        itemList: []
      },
      loadMore: false,
      pagination: {
        pageNum: 1,
        pageSize: 10,
        totalPage: 0
      }
    }
  },
  computed: {
    ...mapState(['openid', 'mobile'])
  },
  methods: {
    getToday() {
      let myDate = new Date()
      let myMonth = myDate.getMonth() + 1
      if (myMonth < 10) {
        myMonth = '0' + myMonth // 补齐
      }
      let today = myDate.getFullYear() + '-' + myMonth
      return today
    },
    dateChange(e) {
      this.noData = false
      this.pagination.pageNum = 1
      this.pagination.pageSize = 10
      this.pagination.totalPage = 0
      this.selectDate = e.mp.detail.value
      this.getDepositList()
    },
    async getDepositList() {
      wx.showLoading({ title: '加载中', mask: true })
      let params = {
        openid: this.openid || '',
        channel: 'wx_jsapi',
        times: this.selectDate,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      }
      try {
        this.recordData.itemList = []
        this.recordData.totalMoney = ''
        let tmpList = await orderQuery(params)
        wx.hideLoading()
        if (
          tmpList.status === 200 &&
          tmpList.data &&
          tmpList.data.list[0].payment.length > 0
        ) {
          this.recordData.itemList = tmpList.data.list[0].payment
          this.recordData.totalMoney = tmpList.data.list[0].total
          this.pagination.totalPage = tmpList.data.pages
          this.hasData = true
        } else {
          this.recordData.totalMoney = 0
          this.hasData = false
        }
        this.noData = false
      } catch (err) {
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 4,
          content: '获取消费记录失败!'
        })
      }
    },
    async getDepositListForMore() {
      try {
        let params = {
          openid: this.openid || '',
          channel: 'wx_jsapi',
          times: this.selectDate,
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize
        }
        let iReturn = await orderQuery(params)
        if (iReturn.status === 200 && iReturn.data && iReturn.data.list[0].payment.length > 0) {
          let tmpList = iReturn.data.list[0].payment
          let tmpNewList = this.recordData.itemList
          this.recordData.itemList = []
          tmpList.forEach((item, index) => {
            tmpNewList.push(item)
          })
          this.recordData.itemList = tmpNewList
          this.loadMore = false
          this.noData = false
        }
      } catch (err) {
        $Toast({
          type: 'error',
          duration: 4,
          content: '获取消费记录失败!'
        })
      }
    },
    gotoDetail(item) {
      wx.navigateTo({
        url: `../orderDetail/main?id=${item.id}`
      })
    }
  },
  onReachBottom() {
    if (this.pagination.pageNum === this.pagination.totalPage) {
      this.loadMore = false
      this.noData = true
    } else {
      this.loadMore = true
      this.noData = false
      this.pagination.pageNum = this.pagination.pageNum + 1
      this.getDepositListForMore()
    }
  },
  onPullDownRefresh () {
    this.pagination.pageNum = 1
    this.pagination.pageSize = 10
    this.pagination.totalPage = 0
    this.noData = false
    this.getDepositList()
    wx.stopPullDownRefresh()
  },
  mounted() {
    let today = this.getToday()
    this.selectDate = today
    this.getDepositList()
  }
}
</script>
<style scoped lang="stylus">
.deposit
  width 100%
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  background-color bg-color
  position relative
  .select
    width 100%
    height 40px
    background-color #ffffff
    display flex
    flex-flow row nowrap
    justify-content space-around
    align-items center
    z-index 10
    position fixed
    border-bottom 1px #efefef solid
    .date
      width 60%
      height 100%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      .picker
        width 70%
        height 60%
        color main-color
        font-size 15px
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        .show
          width 100%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          .title
            width 100%
            height 100%
            font-size 15px
            display flex
            flex-flow row nowrap
            justify-content space-around
            align-items center
            .title
              width 90%
              height 100%
            .img
              width 10%
              height 100%
              font-size 10px
    .money
      width 40%
      height 100%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      font-size 12px
      color sub-font
  .content
    width 100%
    flex 1
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    z-index 1
    margin-top 50px
    background-color bg-color
    .items
      width 100%
      height 250px
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      margin 20px 0
      .itime
        width 100%
        height 20%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        font-size 15px
        color sub-font
      .icontent
        width 90%
        height 90%
        display flex
        flex-flow column nowrap
        justify-content flex-start
        align-items center
        background-color white-color
        border-radius 5px
        .ilogo
          width 90%
          height 20%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          .ilogoimg
            width 21px
            height 21px
          .ilogotext
            font-size 14px
            color sub-font
            text-indent 10px
        .ititel
          width 100%
          height 55%
          display flex
          flex-flow column nowrap
          justify-content flex-start
          align-items center
          .iit
            width 100%
            height 30%
            display flex
            flex-flow row nowrap
            justify-content center
            align-items flex-end
            font-size 15px
            color sub-font
          .iim
            width 100%
            height 60%
            display flex
            flex-flow row nowrap
            justify-content center
            align-items flex-start
            font-size 40px
            color main-font
        .splice
          width 100%
          height 1px
          background-color #efefef
        .idetail
          width 95%
          height 25%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          .idt
            width 90%
            height 100%
            display flex
            flex-flow row nowrap
            justify-content flex-start
            align-items center
            font-size 15px
            color main-font
          .idi
            width 10%
            height 100%
            display flex
            flex-flow row nowrap
            justify-content center
            align-items center
            .dimg
              width 80%
              height 100%
              line-height 100%
              font-size 20px
              display flex
              flex-flow row nowrap
              justify-content center
              align-items center
              color sub-font
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
  .loadmore
    width 100%
    height 50px
</style>
