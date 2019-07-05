<template>
  <div class="service">
    <!-- <div class="query">
      <div class="input">
        <input class="qinput" v-model="searchContent" placeholder="请输入搜索内容" @confirm="gotoQuery"/>
        <i class="icon iconfont icon-search img" @click="gotoQuery"></i>
      </div>
    </div> -->
    <div class="select">
      <div class="date">
        <picker
          class="picker"
          :value="placeIndex"
          :range="placeData"
          :range-key="'name'"
          @change="placeChange"
        >
          <div class="show">
            <div class="title" v-if="placeSelect.name === ''">
              <span class="title">选择网点</span>
              <i class="icon iconfont icon-caret-down img"></i>
            </div>
            <div class="title" v-else>
              {{ placeSelect.name }}
              <i class="icon iconfont icon-caret-down img"></i>
            </div>
          </div>
        </picker>
      </div>
    </div>
    <div class="imap">
      <map
        id="imaps"
        :longitude="mapDatas.loadLoction.longitude"
        :latitude="mapDatas.loadLoction.latitude"
        scale="13"
        bindcontroltap="controltap"
        :markers="mapDatas.markers"
        bindmarkertap="markertap"
        @regionchange="regionchange"
        show-location
        style="width: 100%; height: 100%;"
      ></map>
    </div>
    <div class="splice"></div>
    <div class="content" v-if="hasData">
      <div class="main" v-for="(item, index) in serviceList" :key="item.id">
        <div class="title">
          <div class="tmain">{{item.name}}</div>
          <div class="tsub">
            <div class="selfmark" v-if="item.serviceHallType === 2">{{item.serviceHallTypeName}}</div>
            <div class="othermark" v-else>{{item.serviceHallTypeName}}</div>
          </div>
        </div>
        <div class="content">
          <div class="cmain">
            <div class="address">
              <i class="icon iconfont icon-location img"></i><span class="idtitle">{{item.address}}</span></div>
            <div class="tel" @click="makCall(item.tel)">
              <i class="icon iconfont icon-phone img"></i><span class="ittitle">{{item.tel}}</span></div>
          </div>
          <div class="csub" @click="gotoLoc(item)">去这里<i class="icon iconfont icon-daohang img"></i></div>
        </div>
        <div class="csplice"></div>
      </div>
    </div>
    <div class="content" v-if="!hasData">
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
  </div>
</template>

<script>
import {reverseGeocoder} from '../../utils/index'
import global from '../../utils/global'
import QQMapWX from '../../../static/js/qqmap-wx-jssdk.min.js'
import {mapState, mapMutations} from 'vuex'
import * as types from '@/store/mutation-types'
import { getSelect, getSelectList } from '@/api/service'
const wxmapsdk = new QQMapWX({
  key: global.QQMapKey
})
export default {
  data () {
    return {
      searchContent: '',
      mapDatas: {
        loadLoction: {
          latitude: 36.05709,
          longitude: 103.82538
        },
        markers: [
          {
            iconPath: '/static/images/DW.png',
            id: 1,
            title: '甘肃高速公路局',
            latitude: 36.076167,
            longitude: 103.868673,
            height: 30
          }
        ]
      },
      serviceList: [
        {
          id: 1001,
          title: '甘肃高速公路局',
          address: '兰州市城关区雁北路2828号',
          tel: '0931-9393939',
          markType: '0',
          lat: 36.076167,
          lng: 103.868673
        }
      ],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        totalPage: 0
      },
      loadMore: false,
      noData: true,
      hasData: false,
      placeIndex: 0,
      placeData: [
        {
          name: '省高速公路局',
          value: 62010199999
        }
      ],
      placeSelect: {
        name: '省高速公路局',
        value: 62010199999
      }
    }
  },
  computed: {
    ...mapState([
      'location'
    ])
  },
  methods: {
    placeChange(e) {
      this.placeIndex = e.mp.detail.value
      this.placeSelect.name = this.placeData[this.placeIndex].name
      this.placeSelect.value = this.placeData[this.placeIndex].value
      this.pagination.pageNum = 1
      this.pagination.pageSize = 10
      this.pagination.totalPage = 0
      this.getDefaultList()
    },
    makCall(itel) {
      wx.makePhoneCall({
        phoneNumber: `${itel}`
      })
    },
    getLocation () {
      let that = this
      // 获取用户地理位置
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          reverseGeocoder(wxmapsdk, res).then(res => {
            let tempData = {
              address: res.result.address,
              lat: res.result.location.lat,
              lng: res.result.location.lng,
              nation: res.result.address_component.nation,
              province: res.result.address_component.province,
              city: res.result.address_component.city,
              district: res.result.address_component.district,
              street: res.result.address_component.street,
              street_number: res.result.address_component.street_number
            }
            that.saveLocation(tempData)
            that.mapDatas.loadLoction.latitude = tempData.lat
            that.mapDatas.loadLoction.longitude = tempData.lng
          })
        },
        fail: () => {
          that.getPermission()
        }
      })
    },
    regionchange(e) {
      console.log(e.type)
    },
    gotoLoc(item) {
      console.log('item: ' + JSON.stringify(item))
      this.mapCtx.translateMarker({
        markerId: item.id,
        autoRotate: false,
        duration: 500,
        destination: {
          latitude: Number(item.lat) || 36.076167,
          longitude: Number(item.lng) || 103.868673
        },
        animationEnd() {
          wx.openLocation({
            latitude: Number(item.lat) || 36.076167,
            longitude: Number(item.lng) || 103.868673,
            scale: 13
          })
        }
      })
    },
    getPermission() {
      let that = this
      wx.getSetting({
        success: function (res) {
          var statu = res.authSetting
          if (!statu['scope.userLocation']) {
            wx.showModal({
              title: '是否授权当前位置',
              content: '需要获取您的地理位置,否则地图功能将无法使用',
              success: function (tip) {
                if (tip.confirm) {
                  wx.openSetting({
                    success: function (data) {
                      if (data.authSetting['scope.userLocation']) {
                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 1000
                        })
                        that.getLocation()
                      }
                    }
                  })
                }
              }
            })
          } else {
            console.log('已授权过')
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '调用授权窗口失败',
            icon: 'success',
            duration: 1000
          })
        }
      })
    },
    async getDefaultList() {
      let params = {
        parentId: this.placeSelect.value,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      }
      try {
        let iReturn = await getSelectList(params)
        if (iReturn.status === 200 && iReturn.data && iReturn.data.list.length > 0) {
          this.serviceList = iReturn.data.list
          this.pagination.totalPage = iReturn.data.pages
          this.mapDatas.markers = this.serviceList.map((item) => {
            item.iconPath = '/static/images/DW.png'
            item.id = item.id || 0
            item.title = item.name || '甘肃高速公路局'
            item.latitude = Number(item.lat) || 36.076167
            item.longitude = Number(item.lng) || 103.868673
            item.height = 30
            return item
          })
          console.log('返回新数组: ' + JSON.stringify(this.mapDatas.markers))
          this.hasData = true
        } else {
          this.hasData = false
          this.loadMore = false
          this.recordData.itemList = []
          this.mapDatas.markers = []
        }
        this.noData = false
      } catch (err) {
        console.log('获取默认数据异常: ' + JSON.stringify(err))
      }
    },
    async getDefaultListForMore() {
      let params = {
        parentId: this.placeSelect.value,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      }
      try {
        let iReturn = await getSelectList(params)
        if (iReturn.status === 200 && iReturn.data && iReturn.data.list.length > 0) {
          let tmpList = iReturn.data.list
          let tmpNewList = this.serviceList
          this.serviceList = []
          let tmpMarkList = this.mapDatas.markers
          this.mapDatas.markers = []
          tmpList.forEach((item, index) => {
            let tp = {}
            tp.iconPath = '/static/images/DW.png'
            tp.id = item.id || 0
            tp.title = item.name || '甘肃高速公路局'
            tp.latitude = Number(item.lat) || 36.076167
            tp.longitude = Number(item.lng) || 103.868673
            tp.height = 30
            tmpNewList.push(item)
            tmpMarkList.push(tp)
          })
          this.serviceList = tmpNewList
          this.mapDatas.markers = tmpMarkList
          this.loadMore = false
          this.noData = false
        }
      } catch (err) {
        this.loadMore = false
        console.log('获取更多默认数据异常: ' + JSON.stringify(err))
      }
    },
    async getParent() {
      try {
        let iReturn = await getSelect({parentId: '0'})
        if (iReturn.status === 200 && iReturn.data && iReturn.data.list.length > 0) {
          let tmpNewList = []
          iReturn.data.list.forEach((item, index) => {
            let tmpItem = {}
            tmpItem.value = item.id
            tmpItem.name = item.name
            tmpNewList.push(tmpItem)
          })
          this.placeData = tmpNewList
          this.placeSelect.name = this.placeData[0].name
          this.placeSelect.value = this.placeData[0].value
          this.getDefaultList()
        }
      } catch (err) {
        console.log('获取父级网点数据异常: ' + JSON.stringify(err))
      }
    },
    ...mapMutations({
      saveLocation: types.SYSTEM_LOCATION
    })
  },
  onReachBottom() {
    if (this.pagination.pageNum === this.pagination.totalPage) {
      this.loadMore = false
      this.noData = true
    } else {
      this.loadMore = true
      this.noData = false
      this.pagination.pageNum = this.pagination.pageNum + 1
      this.getDefaultListForMore()
    }
  },
  onPullDownRefresh () {
    this.pagination.pageNum = 1
    this.pagination.pageSize = 10
    this.pagination.totalPage = 0
    this.getDefaultList()
    this.noData = false
    wx.stopPullDownRefresh()
  },
  onShow () {
    this.mapCtx = wx.createMapContext('imaps')
    this.getLocation()
  },
  mounted() {
    this.getParent()
  }
}
</script>
<style scoped lang="stylus">
.service
  width 100%
  background-color bg-color
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  position relative
  .query
    width 100%
    height 50px
    background-color bg-color
    display flex
    flex-flow row nowrap
    justify-content center
    align-items center
    .input
      width 80%
      height 80%
      display flex
      flex-flow row nowrap
      justify-content flex-end
      align-items center
      background-color #ffffff
      border-radius 20px
      .qinput
        width 75%
        height 100%
      .img
        width 20%
        height 100%
        font-size 35px
        color main-color
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
  .select
    width 100%
    height 40px
    background-color white-color
    display flex
    flex-flow row nowrap
    justify-content center
    align-items center
    z-index 10
    position fixed
    top 0
    left 0
    border-bottom 1px #efefef solid
    .date
      width 100%
      height 100%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      .picker
        width 100%
        height 100%
        color main-color
        font-size 15px
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        .show
          width 130px
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
            justify-content center
            align-items center
            .title
              width 90%
              height 100%
            .img
              width 10%
              height 100%
              font-size 10px
  .splice
    width 100%
    height 1px
    background-color  bg-color
  .imap
    width 100%
    height 350px
    display flex
    flex-flow row nowrap
    justify-content center
    align-items center
    margin-top 40px
  .content
    width 100%
    flex 1
    background-color #ffffff
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    .main
      width 100%
      height 90px
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      .title
        width 90%
        height 50%
        display flex
        flex-flow row nowrap
        justify-content space-around
        align-items center
        .tmain
          width 80%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          font-size 17px
          color main-font
        .tsub
          width 30%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          .selfmark
            width 80%
            height 50%
            font-size 12px
            color #00a451
            border 1px #00a451 solid
            border-radius 4px
            display flex
            flex-flow row nowrap
            justify-content center
            align-items center
          .othermark
            width 90%
            height 60%
            font-size 12px
            color #009efb
            border 1px #009efb solid
            display flex
            flex-flow row nowrap
            justify-content center
            align-items center
            border-radius 4px
      .content
        width 90%
        height 50%
        display flex
        flex-flow row nowrap
        justify-content space-around
        align-items center
        .cmain
          width 80%
          height 100%
          display flex
          flex-flow column nowrap
          justify-content flex-start
          align-items center
          .address
            width 100%
            height 50%
            display flex
            flex-flow row nowrap
            justify-content flex-start
            align-items center
            font-size 14px
            color sub-font
            .idtitle
              text-indent 5px
              overflow hidden
              text-overflow ellipsis
              white-space  nowrap
          .tel
            width 100%
            height 50%
            display flex
            flex-flow row nowrap
            justify-content flex-start
            align-items center
            font-size 14px
            color sub-font
            .ittitle
              text-indent 5px
        .csub
          width 20%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          font-size 14px
          color sub-font
          .img
            color main-color
      .csplice
        width 100%
        height 1px
        background-color  bg-color
    .iicon
      width 100%
      height 200px
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
  .loadmore
    width 100%
    height 50px
</style>
