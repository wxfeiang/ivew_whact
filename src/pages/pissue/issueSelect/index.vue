import { $Toast } from '@/utils/iview';
<template>
  <div class="iselect">
    <div class="istitle">
      <span class="istt">选择以下方式，免费办ETC</span>
      <span class="istb"></span>
    </div>
    <div :class="[items.isSelected ? 'sitem' : 'item']" v-for="(items, index) in bankList " :key="items.id" @click="chooseItem(index)">
      <div class="iup">
        <div class="iupleft">
          <img class="ilimg" :src="items.imgUrl" alt="">
        </div>
        <div class="iupcenter">
          <div class="iupcup"><span class="iuptitle">{{items.title}}</span></div>
          <div class="iupcdown"><span class="idowntitle">{{items.stitle}}</span></div>
        </div>
        <div class="iupright">
          <i
            :class="items.isSelected ? 'icon iconfont icon-check-circle-fill dsimg' : 'icon iconfont icon-yuanquan dimg' "
          ></i>
        </div>
      </div>
      <div class="icenter" @click="showDetail(index)">
        <div class="ictitle">{{items.tail}}</div>
        <i
            :class="items.isCollapse ? 'icon iconfont icon-caret-up dimg' : 'icon iconfont icon-caret-down dimg' "
          ></i>
      </div>
      <div class="idown" v-if="items.isCollapse">
        <div class="idcontent" v-for="(item, j) in items.detail " :key="item.id">
          <div class="idcitem">
            <i class="icon iconfont icon-yk_yuanquan_fill dimg"></i>
            <span class="idctitle">{{item.content}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="isplice"></div>
    <div class="cbutton">
      <div class="rbutton">
        <button class="bbutton"  @click="confirm()">确认</button>
      </div>
    </div>
    <i-toast id="toast"/>
    <i-modal title="提示" :visible="showMask"  :show-cancel="showCancel" @ok="clickConfirm">
      <view>将跳转至{{mContent}}网站</view>
      <view>进行信用卡申办资料填写</view>
    </i-modal>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import {
  carServices,
  carServicesOpen,
  carServiceNotify
} from '@/api/car'
import { mapState, mapMutations } from 'vuex'
import * as types from '@/store/mutation-types'
export default {
  data() {
    return {
      reBack: false,
      showMask: false,
      showCancel: false,
      mContent: '',
      baseData: {
        applyId: '',
        plateNo: ''
      },
      tSelect: [],
      bankList: [
        {
          id: 1001,
          isCollapse: false,
          name: '微信车主会员',
          type: 'wx',
          title: '开通车主会员',
          stitle: '0-3天拿到设备',
          tail: '永不过期',
          isSelected: true,
          imgUrl: '/static/images/wx.png',
          links: 'https://www.gsunis.cn/',
          detail: [
            {
              id: 10011,
              content: '收代理费是来得及发落实到解放军速度快放假看'
            },
            {
              id: 10012,
              content: '收代理费是来得及发落实到解放军速度快放假看'
            },
            {
              id: 10013,
              content: '收代理费是来得及发落实到解放军速度快放假看'
            }
          ]
        },
        {
          id: 1002,
          isCollapse: false,
          name: '兰州银行联名卡',
          type: 'lz',
          title: '办兰州银行联名卡',
          stitle: '5-7天拿到设备',
          tail: '限新用户,可选腾讯视频会员或海陆空意外险',
          isSelected: false,
          imgUrl: '/static/images/lz.png',
          links: 'https://www.gsunis.cn/',
          detail: [
            {
              id: 10011,
              content: '收代理费是来得及发落实到解放军速度快放假看'
            },
            {
              id: 10012,
              content: '收代理费是来得及发落实到解放军速度快放假看'
            },
            {
              id: 10013,
              content: '收代理费是来得及发落实到解放军速度快放假看'
            }
          ]
        },
        {
          id: 1003,
          isCollapse: false,
          name: '工商银行联名卡',
          type: 'gs',
          title: '办工商银行联名卡',
          stitle: '5-7天拿到设备',
          tail: '限新用户,可选腾讯视频会员或海陆空意外险',
          isSelected: false,
          imgUrl: '/static/images/gs.png',
          links: 'https://www.gsunis.cn/',
          detail: [
            {
              id: 10011,
              content: '收代理费是来得及发落实到解放军速度快放假看'
            },
            {
              id: 10012,
              content: '收代理费是来得及发落实到解放军速度快放假看'
            },
            {
              id: 10013,
              content: '收代理费是来得及发落实到解放军速度快放假看'
            }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState(['openid', 'mobile'])
  },
  methods: {
    clickConfirm() {
      let lUrl = ''
      this.showMask = false
      if (this.baseData.applyId) {
        lUrl = `${this.tSelect[0].links}?applyId=${this.baseData.applyId}`
        console.log('跳转H5: ' + lUrl)
        wx.navigateTo({
          url: `../issueCredit/main?links=${lUrl}`
        })
      } else {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '初始化银行跳转失败!'
        })
      }
    },
    async toCarService() {
      wx.showLoading({ title: '加载中', mask: true })
      let params = {
        tradeScene: 'HIGHWAY',
        subOpenid: this.openid || '',
        plateNumber: this.baseData.plateNo || '',
        channelType: 'ETC'
      }
      try {
        let iReturn = await carServices(params)
        console.log('查询状态:   ' + JSON.stringify(iReturn))
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
              this.gotoCarServiceApp(iReturn.data.path, aReturn.data)
            } else {
              $Toast({
                type: 'warning',
                duration: 4,
                content: '开通车主服务失败,请稍后从我的订单中办理!'
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '../../index/main'
                })
              }, 5000)
            }
          } else {
            if (iReturn.data.userState === 'NORMAL') {
              $Toast({
                type: 'warning',
                duration: 4,
                content: '您开通过车主服务!'
              })
            } else if (iReturn.data.userState === 'PAUSED') {
              $Toast({
                type: 'warning',
                duration: 4,
                content: '您已暂停车主服务,请重新开通后办理!'
              })
            } else if (iReturn.data.userState === 'OVERDUE') {
              $Toast({
                type: 'warning',
                duration: 4,
                content: '您已开通过车主服务,但有欠费,请还款后办理!'
              })
            }
            setTimeout(function () {
              wx.switchTab({
                url: '../../index/main'
              })
            }, 5000)
          }
          wx.hideLoading()
        } else {
          $Toast({
            type: 'warning',
            duration: 4,
            content: '查询车主状态失败,请稍后从我的订单中办理!'
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../../index/main'
            })
          }, 5000)
        }
      } catch (err) {
        wx.hideLoading()
        $Toast({
          type: 'warning',
          duration: 4,
          content: '查询车主状态异常,请稍后从我的订单中办理!'
        })
        setTimeout(function () {
          wx.switchTab({
            url: '../../index/main'
          })
        }, 5000)
      }
    },
    gotoCarServiceApp(ipath, iparm) {
      let that = this
      wx.hideLoading()
      wx.navigateToMiniProgram({
        appId: 'wxbcad394b3d99dac9',
        path: ipath || '/pages/route/index',
        extraData: iparm.extraData,
        success: function (res) {
          console.log('bindMain success: ' + JSON.stringify(res))
          console.log('开通车主服务的车牌写入缓存: ' + that.baseData.plateNo)
          that.savePlateNo(that.baseData.plateNo)
          that.reBack = true
          console.log('开通车主服务回写: ' + that.reBack)
        },
        fail: function (res) {
          console.log('bindMain fail: ' + JSON.stringify(res))
        },
        complete: function (res) {
          console.log('bindMain complete: ' + JSON.stringify(res))
          // wx.switchTab({
          //   url: '../../index/main'
          // })
        }
      })
    },
    showDetail(index) {
      this.bankList[index].isCollapse = !this.bankList[index].isCollapse
    },
    chooseItem(index) {
      this.bankList.forEach(item => {
        item.isSelected = false
      })
      this.bankList[index].isSelected = !this.bankList[index].isSelected
    },
    confirm() {
      this.tSelect = this.bankList.filter(item => item.isSelected)
      console.log('选择的项目: ' + JSON.stringify(this.tSelect[0]))
      if (this.tSelect[0] && this.tSelect.length > 0) {
        if (this.tSelect[0].type === 'wx') {
          this.toCarService()
        } else {
          this.showMask = true
          this.mContent = this.tSelect[0].name
        }
      } else {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请选择办理方式!'
        })
        return false
      }
    },
    ...mapMutations({
      savePlateNo: types.SYSTEM_PLATENO
    })
  },
  mounted () {
    this.baseData.applyId = this.$root.$mp.query.applyId || '9527'
    this.baseData.plateNo = this.$root.$mp.query.plateNo || '甘ANS109'
  },
  onShow() {
    if (this.reBack) {
      wx.switchTab({
        url: '../../index/main'
      })
    }
  }
}
</script>
<style scoped lang='stylus'>
.iselect
  width 100%
  background-color bg-color
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
.istitle
  width 100%
  height 50px
  display flex
  flex-flow column nowrap
  justify-content flex-end
  align-items center
  .istt
    color main-font
    font-size 20px
    font-weight 700
  .istb
    width 10%
    height 3px
    background-color main-color
    border-radius 5px
.sitem
  width 95%
  flex 1
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  background-color white-color
  border-radius 5px
  border 1px main-color solid
  margin-top 20px
.item
  width 95%
  flex 1
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  background-color white-color
  border-radius 5px
  margin-top 15px
.iup
  width 95%
  height 100px
  display flex
  flex-flow row nowrap
  justify-content space-around
  align-items center
.iupleft
  width 30%
  height 100%
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  .ilimg
    width 90%
    height 60%
.iupcenter
  width 50%
  height 100%
  display flex
  flex-flow column nowrap
  justify-content space-around
  align-items center
.iupcup
  width 100%
  height 40%
  display flex
  flex-flow row nowrap
  justify-content flex-start
  align-items center
.iuptitle
  width 100%
  height 50%
  font-size 18px
  color main-font
.iupcdown
  width 100%
  height 40%
  display flex
  flex-flow row nowrap
  justify-content flex-start
  align-items flex-start
.idowntitle
  width 60%
  height 50%
  font-size 12px
  color main-color
  background-color #D2F6FF
  border-radius 10px
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
.iupright
  width 10%
  height 100%
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  .dsimg
    line-height 100%
    font-size 30px
    color main-color
  .dimg
    line-height 100%
    font-size 30px
    color sub-font
.icenter
  width 95%
  height 30px
  display flex
  flex-flow row nowrap
  justify-content flex-start
  align-items center
  margin-bottom 5px
  .ictitle
    font-size 14px
    color main-font
  .dimg
    line-height 100%
    font-size 20px
    color sub-font
.idown
  width 95%
  flex 1
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  border-top 1px bg-color solid
.idcontent
  width 100%
  flex 1
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
.idcitem
  width 100%
  height 100%
  display flex
  flex-flow row nowrap
  justify-content flex-start
  align-items center
  .dimg
    width 5%
    height 30px
    line-height 100%
    color title-font
    font-size 7px
    display flex
    flex-flow row nowrap
    justify-content center
    align-items center
  .idctitle
    width 90%
    height 30px
    color title-font
    font-size 14px
    display flex
    flex-flow row nowrap
    justify-content flex-start
    align-items center
.isplice
  width 100%
  height 100px
.cbutton
  width 100%
  height 90px
  background-color white-color
  position fixed
  bottom 0
  display flex
  flex-flow column nowrap
  justify-content center
  align-items center
.rbutton
  width 90%
  height 42px
  display flex
  flex-flow column nowrap
  justify-content center
  align-items center
.bbutton
  width 100%
  height 100%
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  background-color main-color
  font-size 15px
  color white-color
  border-radius 40px
</style>
