<template>
  <div class="etclist">
    <div class="econtent" v-if="hasData">
      <div class="eitem" v-for="item in etcList" :key="item.id" @click="gotoDetail(item)">
        <div class="estatus">
          <span class="escontent">{{item.status}}</span>
        </div>
        <div class="eeitem">
          <span class="eleft">申请单号</span>
          <span class="eright">{{item.id}}</span>
        </div>
        <div class="esplice"></div>
        <div class="eeitem">
          <span class="eleft">申请时间</span>
          <span class="eright">{{item.time}}</span>
        </div>
        <div class="esplice"></div>
        <div class="eeitem">
          <span class="eleft">车牌号</span>
          <span class="eright">{{item.plateNo}}</span>
        </div>
      </div>
    </div>
    <div class="loadmore" v-if="loadMore">
      <div class="weui-loadmore">
        <div class="weui-loading"></div>
        <div class="weui-loadmore__tips">正在加载</div>
      </div>
    </div>
    <div class="noData" v-if="!hasData">
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
import { checkAudit, confirmReceipt } from '@/api/goods'
import {mapState} from 'vuex'
export default {
  data() {
    return {
      loadMore: false,
      noData: false,
      hasData: true,
      etcList: [],
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
    async getEtcList() {
      let params = {
        openid: this.openid,
        pageNum: 1,
        pageSize: 10
      }
      try {
        let iReturn = await checkAudit(params)
        if (iReturn.status === 200 && iReturn.data.list) {
          this.etcList = iReturn.data.list
          this.pagination.totalPage = iReturn.data.pages
          this.hasData = true
        } else {
          this.hasData = false
        }
        this.noData = false
      } catch (err) {
        console.log(`获取产品信息失败${err}`)
        $Toast({
          type: 'error',
          duration: 3,
          content: '获取产品信息失败!'
        })
      }
    },
    async etcListForMore() {
      let params = {
        openid: this.openid,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      }
      try {
        let iReturn = await checkAudit(params)
        if (iReturn.status === 200 && iReturn.data.list) {
          let tmpList = iReturn.data.list
          let tmpNewList = this.etcList
          this.etcList = []
          tmpList.forEach((item, index) => {
            tmpNewList.push(item)
          })
          this.etcList = tmpNewList
          this.loadMore = false
        }
      } catch (err) {
        wx.showToast({ title: `${err}`, icon: 'none', duration: 4000 })
      }
    },
    gotoDetail(item) {
      wx.navigateTo({
        url: `../etcDetail/main?applyId=${item.id}`
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
      this.etcListForMore()
    }
  },
  onPullDownRefresh () {
    this.hasData = false
    this.pagination.pageNum = 1
    this.pagination.pageSize = 10
    this.pagination.totalPage = 0
    this.noData = false
    this.getEtcList()
    wx.stopPullDownRefresh()
  },
  mounted() {
    this.getEtcList()
  }
}
</script>
<style scoped lang="stylus">
.etclist
  width 100%
  background-color bg-color
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  .econtent
    width 100%
    flex 1
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    .eitem
      width 90%
      height 150px
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      margin-top 8px
      background-color white-color
      border-radius 5px
      .estatus
        width 100%
        height 21%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        .escontent
          width 100%
          height 100%
          background-color main-color
          color white-color
          font-size 15px
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          border-top-left-radius 5px
          border-top-right-radius 5px
      .eeitem
        width 95%
        height 25%
        display flex
        flex-flow row nowrap
        justify-content space-between
        align-items center
        .eleft
          width 50%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          font-size 15px
          color main-font
        .eright
          width 50%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-end
          align-items center
          font-size 15px
          color sub-font
      .esplice
        width 100%
        height 1px
        background-color bg-color
  .loadmore
    width 100%
    height 50px
  .noData
    width 100%
    height 100%
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    z-index 1
    margin-top 40px
    .iicon
      width 100%
      height 300px
      font-size 15px
      color #989898
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
</style>
