<template>
  <div class="bind">
    <div class="bind-swiper">
      <!-- <swiper class="bind-swiper-item" indicator-dots="true" autoplay="true" interval="5000" duration="1000">
          <block v-for="(item, index) in advert" :index="index" :key="item.id">
              <swiper-item>
                  <image :src="item.url" class="bind-swiper-item-image" mode="aspectFill"></image>
              </swiper-item>
          </block>
      </swiper>-->
      <div class="bind-swiper-content">自动缴费 快速离场</div>
      <image class="bind-swiper-item" src="/static/images/bind-bg.jpg"></image>
    </div>
    <div class="bind-carnumber">
      <div class="bind-carnumber-show" v-if="car.length <= 0">
        <div class="bind-carnumber-show-title">尚未添加车牌</div>
      </div>
      <div
        class="bind-carnumber-content"
        v-for="(item, index) in car"
        :key="item.id"
      >
        <div class="bind-carnumber-content-item">
          <div class="bind-carnumber-content-item-title">
            <div class="bind-carnumber-content-item-title-content">车牌号</div>
            <div class="bind-carnumber-content-item-title-sub">车主服务</div>
            <div class="bind-carnumber-content-item-title-func">
              <switch
                @change="openChange(item, index)"
                :checked = "item.parkService"
                :disabled = "item.parkService"
                class="bind-carnumber-content-item-title-func-switch"
              />
            </div>
          </div>
          <div class="bind-carnumber-content-item-number">{{item.plateNo}}</div>
          <!-- <div class="bind-carnumber-content-item-splice"></div>
          <div class="bind-carnumber-content-item-release">
            <div class="bind-carnumber-content-item-release-title" @click="trafficList(item)">
              <i class="icon iconfont icon-cheliangxinxi imgs"></i>
            </div>
            <div class="bind-carnumber-content-item-release-func" @click="carRelease(item)">
              <i class="icon iconfont icon-lajitong imgs"></i>
            </div>
          </div> -->
        </div>
        <div class="bind-carnumber-content-item-sub">
          <div class="bind-carnumber-content-item-sub-release">
            <div class="bind-carnumber-content-item-sub-release-title" @click="trafficList(item)">
              <i class="icon iconfont icon-cheliangxinxi imgs"></i>
            </div>
            <div class="bind-carnumber-content-item-sub-release-func" @click="carRelease(item)">
              <i class="icon iconfont icon-lajitong imgs"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bind-add" @click="gotoAdd" v-if="car.length < 5">
      <div class="bind-add-icon">
        <i class="icon iconfont icon-plus img"></i>
      </div>
      <div class="bind-add-title">添加车辆 省时省力</div>
    </div>
    <i-modal title="请实名认证" ok-text="去认证" :visible="showdModal" @ok="clickConfirm" @cancel="clickCancel">
        <view>完成实名认证即可添加车辆</view>
    </i-modal>
    <i-modal title="是否解绑车辆" ok-text="解绑" :visible="showdReleas" @ok="clickReleas" @cancel="releasCancel">
    </i-modal>
    <i-toast id="toast"/>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import {
  carBindList,
  carRelease,
  carServices,
  carServicesOpen,
  entrustOpen,
  carServiceNotify
} from '@/api/car'
import { mapState, mapMutations } from 'vuex'
import { userFind } from '@/api/user'
import * as types from '@/store/mutation-types'
export default {
  data() {
    return {
      showdModal: false,
      showdReleas: false,
      province: '甘',
      carNumber: '',
      noCar: false,
      isOpen: true,
      carId: '',
      releaseCarId: '',
      carList: []
    }
  },
  computed: {
    ...mapState(['openid', 'mobile', 'user', 'car'])
  },
  methods: {
    gotoProtocol() {
      wx.navigateTo({
        url: '../protocol/main'
      })
    },
    gotoAdd() {
      // if (!this.identityId) {
      //   this.showdModal = true
      // } else {
      if (this.carList.length >= 5) {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '最多绑定3个车牌!'
        })
        return false
      }
      wx.navigateTo({
        url: '../bindNumber/main?type=highway'
      })
      // }
    },
    clickCancel() {
      this.showdModal = false
    },
    clickConfirm() {
      this.showdModal = false
      wx.navigateTo({
        url: '../userInfo/main'
      })
    },
    clickReleas() {
      this.showdReleas = false
      this.releaseOk(this.releaseCarId)
    },
    releasCancel() {
      this.showdReleas = false
    },
    trafficList(item) {
      wx.navigateTo({
        url: `../../pimp/traffic/main?vehicle=${item.plateNo}`
      })
    },
    openChange(item, index) {
      if (!item.parkService) {
        this.isOpenCarService(this.car[index].plateNo) // e.mp.detail.value
      }
    },
    carRelease(item) {
      this.showdReleas = true
      this.releaseCarId = item.id
    },
    async releaseOk(cardId) {
      wx.showLoading({ title: '加载中', mask: true })
      try {
        let params = {
          id: cardId
        }
        let iReturn = await carRelease(params)
        if (iReturn.status === 200 && iReturn.data === 'SUCCESS') {
          this.releaseCarId = ''
          this.getCarList()
        } else {
          $Toast({
            type: 'warning',
            duration: 4,
            content: `${iReturn.reasonPhrase}`
          })
        }
        wx.hideLoading()
      } catch (err) {
        wx.hideLoading()
        this.releaseCarId = ''
        $Toast({
          type: 'error',
          duration: 3,
          content: `${err}`
        })
      }
    },
    // async queryUser() {
    //   try {
    //     let params = {
    //       openid: this.openid || '',
    //       mobile: this.mobile || ''
    //     }
    //     let iReturn = await userFind(params)
    //     if (iReturn.status === 200 && iReturn.data) {
    //       this.saveIdentity(iReturn.data.identityId)
    //     }
    //   } catch (err) {
    //     $Toast({
    //       type: 'error',
    //       duration: 4,
    //       content: '获取用户信息失败!'
    //     })
    //   }
    // },
    async getCarList() {
      let params = {
        openid: this.openid || '',
        mobile: this.mobile || ''
      }
      try {
        let iReturn = await carBindList(params)
        wx.hideLoading()
        if (iReturn.status === 200 && iReturn.data) {
          this.saveCar(iReturn.data)
        }
      } catch (err) {
        wx.hideLoading()
        console.log('获取车辆列表异常: ', err)
      }
    },
    async isOpenCarService(plateNo) {
      wx.showLoading({ title: '加载中', mask: true })
      let params = {
        tradeScene: 'PARKING',
        subOpenid: this.openid || '',
        plateNumber: plateNo || ''
      }
      try {
        let iReturn = await carServices(params)
        if (iReturn.status === 200 && iReturn.data) {
          // NORMAL 正常用户，已开通车主服务，且已授权访问
          // PAUSED 已暂停车主服务
          // OVERDUE 用户已开通车主服务，但欠费状态。提示用户还款，请跳转到车主服务
          // UNAUTHORIZED 用户未授权使用当前业务，或未开通车主服务。请跳转到授权接口
          if (
            iReturn.data.userState &&
            iReturn.data.userState === 'UNAUTHORIZED' &&
            iReturn.data.path &&
            iReturn.data.path === '/pages/route/index'
          ) {
            let aReturn = await carServicesOpen(params)
            if (aReturn.status === 200 && aReturn.data) {
              this.gotoCarServiceApp(iReturn.data.path, aReturn.data, plateNo)
            }
          } else {
            wx.hideLoading()
            const tmpData = {
              'NORMAL': '已开通过车主服务',
              'PAUSED': '已暂停车主服务',
              'OVERDUE': '车主服务有欠费'
            }
            $Toast({
              type: 'warning',
              duration: 4,
              content: `${tmpData[iReturn.data.userState]}`
            })
            this.carNotify(plateNo)
          }
        }
      } catch (err) {
        wx.hideLoading()
      }
    },
    gotoCarServiceApp(ipath, iparm, plateNo) {
      let that = this
      wx.hideLoading()
      wx.navigateToMiniProgram({
        appId: 'wxbcad394b3d99dac9',
        path: ipath || '/pages/route/index',
        extraData: iparm.extraData,
        success(res) {
          console.log('bindMain success: ' + JSON.stringify(res))
        },
        fail(res) {
          console.log('bindMain fail: ' + JSON.stringify(res))
        },
        complete(res) {
          console.log('bindMain complete: ' + JSON.stringify(res))
          that.savePlateNo(plateNo)
        }
      })
    },
    async carNotify(plateNo) {
      let params = {
        tradeScene: 'PARKING',
        subOpenid: this.openid,
        plateNumber: plateNo
      }
      try {
        await carServiceNotify(params)
        this.getCarList()
      } catch (err) {
        console.log(`carNotify: ${err}`)
      }
    },
    ...mapMutations({
      saveCar: types.SYSTEM_CAR,
      savePlateNo: types.SYSTEM_PLATENO
      // saveIdentity: types.SYSTEM_IDENTITYID
    })
  }
}
</script>
<style scoped lang="stylus">
.bind
  width 100%
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  &-swiper
    width 100%
    height 150px
    &-content
      width 100%
      height 40px
      color #ffffff
      font-size 20px
      position absolute
      top 20px
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
    &-item
      width 100%
      height 100%
      &-image
        width 100%
        height 100%
  &-carnumber
    width 100%
    flex 1
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    &-show
      width 100%
      height 50px
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      background-color white-color
      &-title
        width 90%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        font-size 18px
        font-weight bold
    &-content
      width 90%
      // flex 1
      height 135px
      margin-top 16px
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      &-item
        width 95%
        height 60%
        display flex
        flex-flow column nowrap
        justify-content flex-start
        align-items center
        border-radius 5px
        box-shadow #dddddd 0 0 5px
        background linear-gradient(to right top,#009EFB 20%,#72C9FD 60%)
        &-title
          width 90%
          height 50%
          display flex
          flex-flow row nowrap
          justify-content space-between
          align-items center
          &-content
            width 45%
            height 100%
            display flex
            flex-flow row nowrap
            justify-content flex-start
            align-items center
            font-size 15px
            color white-color
            font-weight 500
            text-shadow 2px 2px 5px #333333
          &-sub
            width 35%
            height 100%
            display flex
            flex-flow row nowrap
            justify-content flex-end
            align-items center
            font-size 15px
            color white-color // #FF8300
            font-weight 500
            text-shadow 2px 2px 5px #333333
          &-func
            width 15%
            height 100%
            display flex
            flex-flow row nowrap
            justify-content flex-end
            align-items center
            font-size 11px
            &-switch
              zoom 0.8
        &-number
          width 90%
          height 50%
          color white-color
          font-size 20px
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items flex-start
          font-weight 500
          text-shadow 2px 2px 5px #333333
        &-sub
          width 90%
          height 30%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          background-color lightgreen
          border-bottom-left-radius 5px
          border-bottom-right-radius 5px
          box-shadow #dddddd 0 0 5px
          background-color #ffffff
          &-release
            width 90%
            height 100%
            display flex
            flex-flow row nowrap
            justify-content space-between
            align-items flex-end
            &-title
              width 50%
              height 100%
              display flex
              flex-flow row nowrap
              justify-content flex-start
              align-items center
              font-size 18px
              color main-color
              .imgs
                font-size 25px
                line-height 100%
            &-func
              width 50%
              height 100%
              display flex
              flex-flow row nowrap
              justify-content flex-end
              align-items center
              color #ff4e00
              font-size 18px
              .imgs
                font-size 25px
                line-height 100%
  &-add
    width 90%
    height 60px
    margin-top 30px
    margin-bottom 30px
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    background-color white-color
    border-radius 7px
    box-shadow #dddddd 0 0 5px
    &-icon
      width 100%
      height 50%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items flex-end
      .img
        color main-color
        font-size 20px
        line-height 100%
    &-title
      width 100%
      height 50%
      color #1da9da
      font-size 15px
      display flex
      flex-flow row nowrap
      justify-content center
      align-items flex-start
      color main-color
</style>
