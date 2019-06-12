<template>
  <div class="etclist">
    <div class="econtent" v-if="hasData">
      <div class="items" v-for="(item, index) in etcList" :key="item.id" @click="gotoDetail(item)">
        <div class="itime">{{item.applyTime}}</div>
        <div class="icontent">
          <!-- <div class="ilogo">
              <i class="icon iconfont icon-qunfengshenhetongguo isuccess" v-if="item.applyStatus === 1"></i>
              <i class="icon iconfont icon-qunfengshenheshibai ifail" v-if="item.applyStatus === 2"></i>
              <i class="icon iconfont icon-qunfengshenhechulizhong iwait" v-if="item.applyStatus === 0"></i>

              <span class="isuccess" v-if="item.applyStatus === 1">{{item.applyStatusName}}</span>
              <span class="ifail" v-if="item.applyStatus === 2">{{item.applyStatusName}}</span>
              <span class="iwait" v-if="item.applyStatus === 0">{{item.applyStatusName}}</span>
          </div> -->
          <div class="ititel">
            <i class="icon iconfont icon-qunfengshenhetongguo isuccess" v-if="item.applyStatus === 1"></i>
            <i class="icon iconfont icon-qunfengshenheshibai ifail" v-if="item.applyStatus === 2"></i>
            <i class="icon iconfont icon-qunfengshenhechulizhong iwait" v-if="item.applyStatus === 0"></i>
            <span class="iim">{{item.plateNumber}}</span>
          </div>
          <div class="splice"></div>
          <div class="idetail">
            <span class="idt">查看订单详情</span>
            <span class="idi"><i class="icon iconfont icon-right dimg"></i></span>
          </div>
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
import { queryList } from '@/api/goods'
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
      wx.showLoading({ title: '加载中', mask: true })
      let params = {
        userId: this.openid,
        pageNum: 1,
        pageSize: 10
      }
      try {
        let iReturn = await queryList(params)
        if (iReturn.status === 200 && iReturn.data.list.length > 0) {
          this.etcList = iReturn.data.list
          this.pagination.totalPage = iReturn.data.pages
          this.hasData = true
        } else {
          this.hasData = false
        }
        this.noData = false
        wx.hideLoading()
      } catch (err) {
        wx.hideLoading()
        console.log(`获取订单列表失败 ${err}`)
        $Toast({
          type: 'error',
          duration: 3,
          content: '获取订单列表失败!'
        })
      }
    },
    async etcListForMore() {
      wx.showLoading({ title: '加载中', mask: true })
      let params = {
        userId: this.openid,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      }
      try {
        let iReturn = await queryList(params)
        if (iReturn.status === 200 && iReturn.data.list.length > 0) {
          let tmpList = iReturn.data.list
          let tmpNewList = this.etcList
          this.etcList = []
          tmpList.forEach((item, index) => {
            tmpNewList.push(item)
          })
          this.etcList = tmpNewList
          this.loadMore = false
          wx.hideLoading()
        }
      } catch (err) {
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 3,
          content: '获取订单列表失败!'
        })
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
    .items
      width 100%
      height 150px
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
        height 80%
        display flex
        flex-flow column nowrap
        justify-content flex-start
        align-items center
        background-color white-color
        border-radius 5px
        border-top-left-radius 20%
        .ititel
          width 100%
          height 65%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          position relative
          border-bottom 1px bg-color solid
          .iim
            width 80%
            height 100%
            display flex
            flex-flow row nowrap
            justify-content space-around
            align-items center
            font-size 35px
            color main-font
          .isuccess
            width 20%
            font-size 60px
            color #28C200
            text-indent 10px
            line-height 100%
            position absolute
            top -14px
            left -17px
            transform rotate(45deg)
          .ifail
            width 20%
            font-size 60px
            color #FF8C00
            text-indent 10px
            line-height 100%
            position absolute
            top -14px
            left -17px
            transform rotate(45deg)
          .iwait
            width 20%
            font-size 60px
            color #009efb
            text-indent 10px
            line-height 100%
            position absolute
            top -14px
            left -17px
            transform rotate(45deg)
        .idetail
          width 90%
          height 35%
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
