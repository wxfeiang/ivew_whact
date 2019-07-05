import { $Toast } from '@/utils/iview';
<template>
  <div class="iselect">
    <div class="pswiper">
      <swiper class="pimgs" indicatorDots="true">
          <swiper-item v-for="item in imgList" :key="item.id">
              <image class="pics" :src="item.imgUrl"></image>
          </swiper-item>
      </swiper>
    </div>
    <div class="pbtn">
      <button @click="selectOBU" class="btns">连接并激活</button>
    </div>
    <i-toast id="toast"/>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import global from '../../../utils/global'
import * as genUtils from '../../../../static/js/jy/GenvictBleUtil'
import * as genDataUtils from '../../../../static/js/jy/GenvictDataUtil'
import * as wjBleAPI from '../../../../static/js/wj/wjBleAPI'
import * as JLObuSDK from '../../../../static/js/jl/JLObuSDK'
import * as n from '../../../../static/js/gbk'
import * as util from '../../../utils/index'
import { getTMAC, getObuCount, saveObuFinish } from '@/api/etc'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      imgList: [
        {
          id: 1001,
          imgUrl: '/static/images/active/etc1.jpg'
        },
        {
          id: 1002,
          imgUrl: '/static/images/active/etc2.jpg'
        },
        {
          id: 1003,
          imgUrl: '/static/images/active/etc3.jpg'
        },
        {
          id: 1004,
          imgUrl: '/static/images/active/etc4.jpg'
        },
        {
          id: 1005,
          imgUrl: '/static/images/active/etc5.jpg'
        },
        {
          id: 1006,
          imgUrl: '/static/images/active/etc6.jpg'
        },
        {
          id: 1007,
          imgUrl: '/static/images/active/etc7.jpg'
        }
      ],
      cardInfo: {
        obuSN: '',
        cardNo: '',
        carNo: '',
        licencseColor: ''
      }
    }
  },
  computed: {
    ...mapState(['openid', 'mobile'])
  },
  methods: {
    selectOBU() {
      var that = this
      wx.showActionSheet({
        itemList: [ 'GENVICT金溢', 'JULI聚利', 'Wanji万集科技' ],
        success: function(res) {
          console.log('选择的:   ' + res.tapIndex)
          res.tapIndex === 0 ? that.openGenvict() : (res.tapIndex === 1 ? that.openJuli() : that.openWanji())
        },
        fail: function(err) {
          console.log('选择设备失败: ' + err.errMsg)
        }
      })
    },
    openGenvict() {
      var that = this
      console.log('openGenvict')
      wx.showLoading({title: '正在搜索设备', mask: true})
      genUtils.openBle(function (code) {
        if (code === '0') {
          wx.getBluetoothAdapterState({
            success: function (res) {
              if (!res.available) {
                wx.hideLoading()
                $Toast({
                  type: 'warning',
                  duration: 3,
                  content: `设备无法开启蓝牙链接!`
                })
              } else {
                genUtils.scanBle(function (device) {
                  wx.showLoading({title: '正在连接设备', mask: true})
                  // wx.stopBluetoothDevicesDiscovery({
                  //   success: function (e) {}
                  // })
                  if (device === '1') {
                    wx.hideLoading()
                    $Toast({
                      type: 'warning',
                      duration: 3,
                      content: `搜索失败,请重试!`
                    })
                  } else {
                    genUtils.connectBle(device, function (code) {
                      wx.showLoading({title: '正在连接设备', mask: true})
                      if (code === '0') {
                        genUtils.deployBle(function (code) {
                          if (code === '0') {
                            genUtils.initDevice(function (code, res) {
                              wx.showLoading({title: '正在初始化设备', mask: true})
                              if (code === '0') {
                                that.jyReadCardInfo()
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
                              content: `设备连接失败,请稍后重试!`
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
              $Toast({
                type: 'warning',
                duration: 3,
                content: `请打开手机蓝牙后重试!`
              })
            }
          })
        } else if (code === '1') {
          wx.hideLoading()
          $Toast({
            type: 'warning',
            duration: 3,
            content: `未搜索到金溢设备!`
          })
        }
      })
    },
    openJuli() {
      console.log('openJuli')
      let that = this
      wx.showLoading({title: '正在搜索设备', mask: true})
      JLObuSDK.ScanDevice(null, 10000, (res) => {
        if (res.data && res.data.length > 0 && res.code === 0) {
          console.log('搜索到的设备: ' + JSON.stringify(res))
          let dev = res.data[0]
          JLObuSDK.StopScanDevice((res) => {
            console.log('停止搜索设备: ' + JSON.stringify(res))
          })
          wx.showLoading({title: '正在连接设备', mask: true})
          JLObuSDK.ConnectDevice(dev, (res) => {
            console.log('连接状态: ' + JSON.stringify(res))
            that.jlReadCardInfo()
          })
        } else {
          wx.hideLoading()
          $Toast({
            type: 'warning',
            duration: 5,
            content: `未搜索到聚利设备!`
          })
        }
      })
    },
    openWanji() {
      console.log('openWanji')
      let that = this
      wx.showLoading({title: '正在搜索设备', mask: true})
      wjBleAPI.connectDevice(function (serviceResult) {
        console.log('connectDevice:  ' + JSON.stringify(serviceResult))
        if (serviceResult.serviceCode === 0) {
          that.wjGetDeviceInfo()
        } else {
          wx.hideLoading()
          $Toast({
            type: 'warning',
            duration: 5,
            content: `未搜索到万集设备!`
          })
        }
      })
    },
    jyReadCardInfo () {
      let that = this
      genUtils.deviceChannel('C0', function (code, res) {
        wx.showLoading({title: '正在读取数据', mask: true})
        if (code === '0') {
          that.cardInfo.obuSN = util.hexCharCodeToStr(res.slice(8)) || 'jy99999999'
          console.log('>>>>>>>> obuSN: ' + that.cardInfo.obuSN)
          genUtils.getICCInfo(function (code, res) {
            if (code === '0') {
              that.cardInfo.cardNo = res.cardId
              that.cardInfo.carNo = that.convertLisenceNo(res.vehicleNumber)
              that.cardInfo.licencseColor = parseInt(res.plateColor, 16) || '0'
              that.jyActive()
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
      })
    },
    async jyActive() {
      wx.showLoading({title: '正在激活', mask: true})
      try {
        console.log('开始激活')
        let aaa = await this.jyEnterESAM('20', ['00A40000023F00'])
        console.log('进入ESAM目录成功： ' + JSON.stringify(aaa))
        let bbb = await this.jyEnterESAM('20', ['00B081001B'])
        console.log('读取系统防拆为和合同序列号成功： ' + JSON.stringify(bbb))
        let hth = bbb[0].substring(20, 36) || 'JY999999'
        console.log('合同序列号: ' + hth)
        let qc = await this.queryCount(hth)
        let ccc = await this.jyEnterESAM('20', ['0084000004'])
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
        let iFinish = await this.jyEnterESAM('20', ta)
        console.log('激活结果: ' + JSON.stringify(iFinish))
        $Toast({
          type: 'success',
          duration: 5,
          content: `激活成功!`
        })
        wx.hideLoading()
        this.obuFinish(hth, 'Genvict')
        const poCode = await this.powerOff()
        this.jyCloseBlue()
      } catch (err) {
        console.log('激活失败' + err)
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 5,
          content: `激活失败 ${err}`
        })
        const poCode = await this.powerOff()
        this.jyCloseBlue()
      }
    },
    jyEnterESAM (dType, cosArr) {
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
    wjGetDeviceInfo() {
      let that = this
      wx.showLoading({title: '正在连接设备', mask: true})
      wjBleAPI.getDeviceInfo('C0', function (serviceResult) {
        console.log('>>>>>>获取设备信息: ' + JSON.stringify(serviceResult.serviceData))
        serviceResult.serviceCode === 0 ? that.cardInfo.obuSN = util.hexCharCodeToStr(serviceResult.serviceData.deviceSN) : that.cardInfo.obuSN = 'wj99999999'
        that.wjReadCardInfo()
      })
    },
    wjReadCardInfo() {
      let that = this
      wx.showLoading({title: '正在读取数据', mask: true})
      wjBleAPI.selectDir('1001', '10', function (serviceResult) {
        if (serviceResult.serviceCode === 0) {
          wjBleAPI.getCardInfo(function (serviceResult) {
            if (serviceResult.serviceCode === 0) {
              that.cardInfo.cardNo = serviceResult.serviceData.roadswebID + '' + serviceResult.serviceData.cardNo
              that.cardInfo.carNo = that.convertLisenceNo(serviceResult.serviceData.bindedPlate) || ''
              that.cardInfo.licencseColor = parseInt(serviceResult.serviceData.vehColor, 16) || '0'
              that.wjActive()
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
            content: `读取卡片信息失败!`
          })
        }
      })
    },
    async wjActive() {
      wx.showLoading({title: '正在激活', mask: true})
      try {
        console.log('>>>>>> 开始激活')
        let aaa = await this.wjReadSystem()
        let hth = aaa.contractSerialNumber || 'WJ999999'
        console.log('>>>>>> 合同序列号: ' + hth)
        let qc = await this.queryCount(hth)
        let bbb = await this.wjReadSystemRand()
        let rand = bbb.rand
        console.log('>>>>>> 读取随机数成功： ' + rand)
        let iReturn = await this.getMac(hth, rand)
        console.log('>>>>>> 获取3mac成功: ' + JSON.stringify(iReturn))
        let iMac = this.validateTMAC(iReturn)
        let ia = '04D6811A0501' + iMac + ''
        console.log('>>>>>> 激活指令:   ' + JSON.stringify(ia))
        let iFinish = await this.wjWriteSystem(ia)
        console.log('>>>>>> 激活结果: ' + JSON.stringify(iFinish))
        wx.hideLoading()
        $Toast({
          type: 'success',
          duration: 5,
          content: `激活成功!`
        })
        this.obuFinish(hth, 'Wanji')
        this.wjCloseBlue()
      } catch (err) {
        console.log('激活失败' + err)
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 5,
          content: `激活失败 ${err}`
        })
        this.wjCloseBlue()
      }
    },
    wjReadSystem () {
      let that = this
      return new Promise((resolve, reject) => {
        wjBleAPI.selectDir('3F00', '20', function (serviceResult) {
          if (serviceResult.serviceCode === 0) {
            wjBleAPI.getObuSysInfo(function (serviceResult) {
              if (serviceResult.serviceCode === 0) {
                console.log('>>>>>>>读系统信息: ' + JSON.stringify(serviceResult))
                resolve(serviceResult.serviceData)
              } else {
                reject(`${serviceResult.serviceInfo}`)
              }
            })
          } else {
            reject(`${serviceResult.serviceInfo}`)
          }
        })
      })
    },
    wjReadSystemRand (cosArr) {
      let that = this
      return new Promise((resolve, reject) => {
        wjBleAPI.getRand('20', function (serviceResult) {
          if (serviceResult.serviceCode === 0) {
            console.log('>>>>>>>读随机数: ' + JSON.stringify(serviceResult))
            resolve(serviceResult.serviceData)
          } else {
            reject(`${serviceResult.serviceInfo}`)
          }
        })
      })
    },
    wjWriteSystem(cos) {
      let that = this
      return new Promise((resolve, reject) => {
        wjBleAPI.writeObuIssue(cos, function (serviceResult) {
          if (serviceResult.serviceCode === 0) {
            console.log('>>>>>>>激活成功: ' + JSON.stringify(serviceResult))
            resolve(serviceResult.serviceData)
          } else {
            reject(`${serviceResult.serviceInfo}`)
          }
        })
      })
    },
    jlReadCardInfo() {
      let that = this
      wx.showLoading({title: '正在读取数据', mask: true})
      JLObuSDK.C_Channel('C0', function(res) {
        that.cardInfo.obuSN = util.hexCharCodeToStr(res.data) || 'jl99999999'
        JLObuSDK.GetCardInfo((res) => {
          console.log('>>>>>>> 读卡信息:  ' + JSON.stringify(res))
          if (res.code === 0) {
            that.cardInfo.cardNo = res.data.substring(20, 40)
            that.cardInfo.carNo = that.convertLisenceNo(res.data.substring(56, 80)) || ''
            that.cardInfo.licencseColor = parseInt(res.data.substr(82, 2), 16) || '0'
            that.jlActive()
          } else {
            wx.hideLoading()
            $Toast({
              type: 'warning',
              duration: 3,
              content: `读取卡片信息失败!`
            })
          }
        })
      })
    },
    async jlActive() {
      wx.showLoading({title: '正在激活', mask: true})
      try {
        console.log('>>>>>> 开始激活')
        let aaa = await this.jlReadSystem()
        console.log('>>>>>> 读取系统防拆为和合同序列号成功： ' + JSON.stringify(aaa))
        let hth = aaa.substring(20, 36) || 'JL999999'
        console.log('>>>>>> 合同序列号: ' + hth)
        let qc = await this.queryCount(hth)
        let bbb = await this.JLReadSystemRand()
        console.log('>>>>>> 读取随机数成功： ' + JSON.stringify(bbb))
        let iReturn = await this.getMac(hth, bbb)
        console.log('>>>>>> 获取3mac成功: ' + JSON.stringify(iReturn))
        let iMac = this.validateTMAC(iReturn)
        let ia = '04D6811A0501' + iMac + ''
        console.log('>>>>>> 激活指令:   ' + JSON.stringify(ia))
        let iFinish = await this.jlWriteSystem(ia)
        console.log('>>>>>> 激活结果: ' + JSON.stringify(iFinish))
        wx.hideLoading()
        $Toast({
          type: 'success',
          duration: 5,
          content: `激活成功!`
        })
        this.obuFinish(hth, 'Juli')
        this.jlCloseBlue()
      } catch (err) {
        console.log('激活失败' + JSON.stringify(err))
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 5,
          content: `激活失败`
        })
        this.jlCloseBlue()
      }
    },
    jlReadSystem () {
      let that = this
      return new Promise((resolve, reject) => {
        JLObuSDK.ReadSystemInfo((res) => {
          console.log('>>>>>>  读系统信息执行结果: ' + JSON.stringify(res))
          if (res.code === 0) {
            resolve(res.data)
          } else {
            reject(`${res.err_msg}`)
          }
        })
      })
    },
    JLReadSystemRand (cosArr) {
      let that = this
      return new Promise((resolve, reject) => {
        JLObuSDK.ReadObuRandomInfo(0, (res) => {
          if (res.code === 0) {
            resolve(res.data)
          } else {
            reject(`${res.err_msg}`)
          }
        })
      })
    },
    jlWriteSystem(cos) {
      let that = this
      return new Promise((resolve, reject) => {
        JLObuSDK.WriteSystemInfo(cos, (res) => {
          console.log('>>>>>>>>  写系统信息返回:   ' + JSON.stringify(res))
          if (res.code === 0) {
            resolve(res)
          } else {
            reject(`${res.err_msg}`)
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
    async queryCount(obuId) {
      let params = {
        obuId: obuId
      }
      return new Promise((resolve, reject) => {
        getObuCount(params).then(res => {
          console.log('getObuCount: ' + JSON.stringify(res))
          if (res.status === 200 && res.data) {
            res.data === '0' ? reject('同一标签只能激活3次!') : resolve('ok')
          } else {
            reject('同一标签只能激活3次!')
          }
        }).catch(err => {
          reject('同一标签设备只能激活3次!')
          console.log(`同一标签只能激活3次! ${err}`)
        })
      })
    },
    async obuFinish(obuId, obuBrand) {
      let params = {
        userId: this.openid,
        mobile: this.mobile,
        obuBrand: obuBrand || 'default',
        obuId: obuId,
        obuSn: this.cardInfo.obuSN,
        plateNumber: this.cardInfo.carNo.replace(/[^\u4e00-\u9fa5\w]/g, '') || '车牌读取失败',
        plateColor: this.cardInfo.licencseColor,
        cardId: this.cardInfo.cardNo,
        terminalNo: global.mobileInfo.model || '手机'
      }
      try {
        let iReturn = await saveObuFinish(params)
        console.log('obu激活成功上报返回: ' + JSON.stringify(iReturn))
      } catch (err) {
        console.log('obu激活成功上报异常: ' + JSON.stringify(err))
      }
    },
    convertLisenceNo (e) {
      e = e.toUpperCase()
      for (var a = '', t = 0; t < e.length;) {
        a = a + '%' + e.substr(t, 2)
        t += 2
      }
      return n.decodeFromGb2312(a)
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
    jyCloseBlue () {
      genUtils.disconnectBle(function (code) {})
      genUtils.closeBle(function (code) {})
      this.cardInfo.obuSN = ''
      this.cardInfo.cardNo = ''
      this.cardInfo.carNo = ''
      this.cardInfo.licencseColor = ''
    },
    wjCloseBlue () {
      wjBleAPI.disConnectDevice(function (serviceResult) {})
      this.cardInfo.obuSN = ''
      this.cardInfo.cardNo = ''
      this.cardInfo.carNo = ''
      this.cardInfo.licencseColor = ''
    },
    jlCloseBlue () {
      JLObuSDK.DisonnectDevice((res) => {})
      this.cardInfo.obuSN = ''
      this.cardInfo.cardNo = ''
      this.cardInfo.carNo = ''
      this.cardInfo.licencseColor = ''
    }
  }
}
</script>
<style scoped lang='stylus'>
.iselect
  width 100%
  height 100%
  background-color white-color
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  .pswiper
    width 100%
    height 70%
    display flex
    flex-flow row nowrap
    justify-content center
    align-items center
    .pimgs
      width 100%
      height 100%
      .pics
        width 100%
        height 100%
  .pbtn
    width 100%
    height 30%
    display flex
    flex-flow column nowrap
    justify-content center
    align-items center
    .btns
      width 90%
      height 45px
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      font-size 15px
      color white-color
      border-radius 20px
      background-color main-color
      box-shadow 0 3px 12px rgba(0, 158, 251, 0.8)
</style>
