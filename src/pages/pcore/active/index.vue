<template>
  <div class="bind">
    <div class="link">
      <div class="intro">
        <img class="simg" src="/static/images/bleClose.jpg" alt="" v-if="!bleStatus">
        <img class="simg" src="/static/images/bleOpen.jpg" alt="" v-if="bleStatus">
        <div class="sfont">{{bleText}}</div>
      </div>
      <div class="ltitle">
        <span>1: 只支持金溢设备</span>
        <span>2: 激活失败后，请重新开始连接设备</span>
      </div>
      <div class="lbutton">
        <button class="llbutton"  @click="gotoLink">连接设备</button>
      </div>
    </div>
    <i-toast id="toast"/>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import global from '../../../utils/global'
import * as genUtils from '../../../utils/GenvictBleUtil'
import * as genDataUtils from '../../../utils/GenvictDataUtil'
import * as n from '../../../../static/js/gbk'
import * as util from '../../../utils/index'
import {getTMAC} from '@/api/etc'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      showdModal: false,
      bleStatus: false,
      bleText: '请开启蓝牙',
      heartbeat: '',
      scanTimer: '',
      obuContractNo: '',
      cardInfo: {
        cardNo: '',
        carNo: '',
        licencseColor: ''
      }
    }
  },
  computed: {
    ...mapState([
      'openid'
    ])
  },
  methods: {
    heartFunc () {
      this.heartbeat = setInterval(function () {
        genUtils.deviceChannel('C0', function (code, res) {
        })
      }, 10000)
    },
    startScanTimer () {
      let that = this
      this.scanTimer = setTimeout(function () {
        wx.hideLoading()
        $Toast({
          type: 'warning',
          duration: 3,
          content: `没有搜索到设备!`
        })
        that.bleText = '未连接'
      }, 10000)
    },
    listenBle () {
      let that = this
      wx.onBLEConnectionStateChange(function (a) {
        if (a.connected) {
          wx.onBluetoothAdapterStateChange(function (e) {
            that.bleText = e.discovering ? '正在搜索' : '停止搜索'
            that.bleStatus = !!e.available
          })
        } else {
          wx.hideLoading()
          that.closeBlue()
        }
      })
    },
    gotoLink () {
      let that = this
      wx.showLoading({title: '正在连接设备', mask: true})
      genUtils.openBle(function (code) {
        if (code === '0') {
          that.bleText = '蓝牙搜索中'
          // 获取蓝牙适配器状态
          wx.getBluetoothAdapterState({
            success: function (res) {
              that.bleText = '正在搜索'
              that.bleStatus = !!res.available
              if (!res.available) {
                wx.hideLoading()
                $Toast({
                  type: 'warning',
                  duration: 3,
                  content: `设备无法开启蓝牙链接!`
                })
              } else {
                that.startScanTimer()
                that.listenBle()
                // 搜索蓝牙设备
                genUtils.scanBle(function (device) {
                  clearTimeout(that.scanTimer)
                  wx.stopBluetoothDevicesDiscovery({
                    success: function (e) {}
                  })
                  if (device === '1') {
                    wx.hideLoading()
                    $Toast({
                      type: 'warning',
                      duration: 3,
                      content: `搜索失败,请重试!`
                    })
                  } else {
                    that.bleText = '连接中'
                    genUtils.connectBle(device, function (code) {
                      if (code === '0') {
                        genUtils.deployBle(function (code) {
                          if (code === '0') {
                            that.bleText = '已连接'
                            genUtils.initDevice(function (code, res) {
                              if (code === '0') {
                                that.readCardInfo()
                              } else {
                                wx.hideLoading()
                                $Toast({
                                  type: 'warning',
                                  duration: 3,
                                  content: `初始化设备失败,请重试!`
                                })
                              }
                            })
                          } else {
                            wx.hideLoading()
                            $Toast({
                              type: 'warning',
                              duration: 3,
                              content: `设备连接失败,请重启手机和设备蓝牙!`
                            })
                          }
                        })
                      } else {
                        wx.hideLoading()
                        $Toast({
                          type: 'warning',
                          duration: 3,
                          content: `蓝牙连接异常,请重试!`
                        })
                      }
                    })
                  }
                })
              }
            },
            fail: function (res) {
              wx.hideLoading()
              that.bleText = '连接失败'
              $Toast({
                type: 'warning',
                duration: 3,
                content: `请打开手机蓝牙后重试!`
              })
            }
          })
        } else if (code === '1') {
          wx.hideLoading()
          that.bleText = '连接失败'
          $Toast({
            type: 'warning',
            duration: 3,
            content: `手机蓝牙未打开或手机不支持蓝牙!`
          })
        }
      })
    },
    readCardInfo () {
      let that = this
      genUtils.deviceChannel('C0', function (code, res) {
        if (code === '0') {
          if (res.substr(0, 4) === 'b500') {
            that.obuContractNo = util.hexCharCodeToStr(res.slice(8)) || '0'
            console.log('+obuContractNo: ' + that.obuContractNo)
            genUtils.getICCInfo(function (code, res) {
              if (code === '0') {
                that.cardInfo.cardNo = res.cardId
                that.cardInfo.carNo = that.convertLisenceNo(res.vehicleNumber)
                that.cardInfo.licencseColor = res.plateColor
                that.bleText = '查询成功'
                that.toActive()
              } else {
                wx.hideLoading()
                $Toast({
                  type: 'warning',
                  duration: 3,
                  content: `读取卡片信息失败!`
                })
              }
            })
          } else {
            wx.hideLoading()
            $Toast({
              type: 'warning',
              duration: 3,
              content: `获取设备序列号失败!`
            })
          }
        } else {
          wx.hideLoading()
          $Toast({
            type: 'warning',
            duration: 3,
            content: `获取设备序列号失败!`
          })
        }
      })
    },
    convertLisenceNo (e) {
      e = e.toUpperCase()
      for (var a = '', t = 0; t < e.length;) {
        a = a + '%' + e.substr(t, 2)
        t += 2
      }
      return n.decodeFromGb2312(a)
    },
    convertCardMoney (t) {
      return parseFloat(t / 100).toFixed(2)
    },
    async toActive() {
      try {
        console.log('开始激活')
        let aaa = await this.enterESAM('20', ['00A40000023F00'])
        console.log('进入ESAM目录成功： ' + JSON.stringify(aaa))
        let bbb = await this.enterESAM('20', ['00B081001B'])
        console.log('读取系统防拆为和合同序列号成功： ' + JSON.stringify(bbb))
        let hth = bbb[0].substring(20, 36)
        console.log('合同序列号: ' + hth)
        let ccc = await this.enterESAM('20', ['0084000004'])
        console.log('读取随机数成功： ' + JSON.stringify(ccc))
        let radm = ccc[0].substr(0, 8)
        console.log('返回的随机数: ' + ccc)
        console.log('截取的随机数: ' + radm)
        let iReturn = await this.getMac(hth, radm)
        console.log('获取3mac成功: ' + JSON.stringify(iReturn))
        let iMac = this.validateTMAC(iReturn)
        let ia = '04D6811A0501' + iMac + ''
        let ta = []
        ta.push(ia + '')
        console.log('激活指令:   ' + JSON.stringify(ta))
        let iFinish = await this.enterESAM('20', ta)
        console.log('激活结果: ' + JSON.stringify(iFinish))
        if (iFinish[0] === '9000') {
          $Toast({
            type: 'success',
            duration: 5,
            content: `激活成功!`
          })
        }
        this.powerOff()
        this.gotoHome()
        wx.hideLoading()
      } catch (err) {
        console.log('激活失败' + err)
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 5,
          content: `激活失败 ${err}`
        })
      }
    },
    enterESAM (dType, cosArr) {
      let that = this
      return new Promise((resolve, reject) => {
        genUtils.gvEsamChannel(dType, cosArr, function (code, res) {
          if (code === '0') {
            resolve(res)
          } else {
            reject(`${res}`)
          }
        })
      })
    },
    getMac(coa, radm) {
      let aParams = {
        head: {
          channel: '20eh15',
          timestamp: new Date().getTime() + '',
          type: 'post'
        },
        body: {
          degree: '00',
          obuID: coa,
          initMAC: radm.toUpperCase() + '00000000',
          macLength: '0006',
          mac: '04D6811A0501'
        }
      }
      console.log(`请求参数: ${JSON.stringify(aParams)}`)
      return new Promise((resolve, reject) => {
        getTMAC(aParams).then(res => {
          if (res.status === 0 && res.message && JSON.parse(res.message).data) {
            let ipp = JSON.parse(res.message).data
            if (ipp.substr(0, 2) === '41') {
              resolve(JSON.parse(res.message).data)
            } else {
              reject('获取3mac失败!')
            }
          } else {
            reject('获取3mac失败!')
          }
        }).catch(err => {
          reject('获取3mac异常!')
          console.log(`获取3mac异常: ${err}`)
        })
      })
    },
    validateTMAC(fullMac) {
      let TMac = ''
      if (fullMac.length > 16) {
        TMac = fullMac.substring(18, 26).toUpperCase()
        console.log('截取的TMAC： ' + TMac)
      }
      return TMac
    },
    powerOff() {
      console.log('powerOff')
      return new Promise((resolve, reject) => {
        genUtils.deviceChannel('C3', function (code, res) {
          if (code === '0') {
            resolve(code)
          } else {
            resolve(code)
          }
        })
      })
    },
    closeBlue () {
      genUtils.disconnectBle(function (code) {})
      genUtils.closeBle(function (code) {})
      this.bleText = '未连接'
    },
    gotoHome () {
      this.loadStatus = false
      this.loadBack = false
      clearInterval(this.heartbeat)
      this.closeBlue()
    }
  },
  onHide () {
    wx.stopBluetoothDevicesDiscovery({
      success: function (e) {}
    })
    clearInterval(this.heartbeat)
    clearTimeout(this.scanTimer)
    genUtils.disconnectBle(function (code) {})
    genUtils.closeBle(function (code) {})
  },
  onUnload () {
    clearInterval(this.heartbeat)
    clearTimeout(this.scanTimer)
    genUtils.disconnectBle(function (code) {})
    genUtils.closeBle(function (code) {})
  }
}
</script>
<style lang="stylus" scoped>
.steps /deep/ ._i-steps
  width 100%
  margin-top 7px
.steps /deep/ .iStepss
  width 100%
  height 100%
.steps /deep/ .iStepp
  color main-color
</style>
<style scoped lang="stylus">
.bind
  width 100%
  height 100%
  background-color bg-color
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  .link
    width 100%
    height 100%
    display flex
    flex-flow column nowrap
    justify-content center
    align-items center
    background-color #ffffff
    border-top 1px bg-color solid
    .ltitle
      width 90%
      height 10%
      display flex
      flex-flow column nowrap
      justify-content center
      align-items flex-start
      color title-color
      font-size 13px
    .intro
      width 100%
      height 70%
      display flex
      flex-flow column nowrap
      justify-content center
      align-items center
      .simg
        width 300px
        height 300px
      .sfont
        width 50%
        height 90%
        position absolute
        display flex
        flex-flow row nowrap
        justify-content flex-end
        align-items center
        top 3px
        font-size 15px
        color title-font
    .lbutton
      width 80%
      height 15%
      display flex
      flex-flow column nowrap
      justify-content center
      align-items center
      .llbutton
        width 100%
        height 50%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        background-color main-color
        font-size 15px
        color white-color
    &-base
      width 100%
      height 18%
      background-color #ffffff
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      &-card
        width 90%
        height 60%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items flex-end
        font-size 25px
        color main-font
      &-car
        width 90%
        height 40%
        display flex
        flex-flow row nowrap
        justify-content flex-start
        align-items flex-start
        font-size 17px
        color main-color
    &-recharge
      width 100%
      height 68%
      display flex
      flex-flow column nowrap
      justify-content space-around
      align-items center
      font-size 15px
      color main-font
      background-color #ffffff
      margin-top 5px
      &-main
        width 90%
        height 20%
        display flex
        flex-flow column wrap
        justify-content flex-start
        align-items center
        font-size 20px
        color main-font
        &-money
          width 100%
          height 70%
          display flex
          flex-flow row wrap
          justify-content center
          align-items center
          font-size 30px
          color main-font
        &-title
          width 100%
          height 30%
          display flex
          flex-flow row wrap
          justify-content center
          align-items center
          font-size 20px
          color sub-font
</style>
