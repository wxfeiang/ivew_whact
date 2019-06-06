<template>
  <div class="service">
    <!-- <div class="query">
      <div class="input">
        <input class="qinput" v-model="searchContent" placeholder="请输入搜索内容" @confirm="gotoQuery"/>
        <i class="icon iconfont icon-search img" @click="gotoQuery"></i>
      </div>
    </div> -->
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
    <div class="content">
      <div class="main" v-for="(item, index) in serviceList" :key="item.id">
        <div class="title">
          <div class="tmain">{{item.title}}</div>
          <div class="tsub">
            <div class="selfmark" v-if="item.markType === '0'">自营</div>
            <div class="othermark" v-else>代理</div>
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
  </div>
</template>

<script>
import {reverseGeocoder} from '../../utils/index'
import global from '../../utils/global'
import QQMapWX from '../../../static/js/qqmap-wx-jssdk.min.js'
import {mapState, mapMutations} from 'vuex'
import * as types from '@/store/mutation-types'
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
          latitude: 36.076167,
          longitude: 103.868673
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'location'
    ])
  },
  methods: {
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
        markerId: 1,
        autoRotate: false,
        duration: 500,
        destination: {
          latitude: item.latitude,
          longitude: item.longitude
        },
        animationEnd() {
          wx.openLocation({
            latitude: item.latitude,
            longitude: item.longitude,
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
    ...mapMutations({
      saveLocation: types.SYSTEM_LOCATION
    })
  },
  onShow () {
    this.mapCtx = wx.createMapContext('imaps')
    this.getLocation()
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
          width 20%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          .selfmark
            width 60%
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
            width 60%
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
</style>
