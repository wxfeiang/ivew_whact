<template>
  <div class="bind">
    <div class="link">
      <div class="intro">
        <img class="simg" src="/static/images/bleClose.jpg" alt="" v-if="!bleStatus">
        <img class="simg" src="/static/images/bleOpen.jpg" alt="" v-if="bleStatus">
        <div class="sfont">{{bleText}}</div>
      </div>
      <div class="ltitle">
        <span>1: 只支持聚利设备</span>
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
import * as JLObuSDK from '../../../../static/js/jl/JLObuSDK'
import * as n from '../../../../static/js/gbk'
import { getTMAC, getObuCount, saveObuFinish } from '@/api/etc'
import { mapState } from 'vuex'
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
      'openid', 'mobile'
    ])
  },
  methods: {
    gotoLink () {
      let that = this
      wx.showLoading({title: '正在连接设备', mask: true})
      JLObuSDK.ScanDevice(null, 10000, (res) => {
        if (res.data && res.data.length > 0 && res.code === 0) {
          console.log('搜索到的设备: ' + JSON.stringify(res))
          let dev = res.data[0]
          JLObuSDK.StopScanDevice((res) => {
            console.log('停止搜索设备: ' + JSON.stringify(res))
          })
          JLObuSDK.ConnectDevice(dev, (res) => {
            console.log('连接状态: ' + JSON.stringify(res))
            that.readCardInfo()
          })
        } else {
          wx.hideLoading()
          $Toast({
            type: 'warning',
            duration: 5,
            content: `未找到聚利设备 ${res.err_msg}`
          })
        }
      })
    },
    readCardInfo () {
      let that = this
      JLObuSDK.GetCardInfo((res) => {
        console.log('>>>>>>> 读卡信息:  ' + JSON.stringify(res))
        if (res.code === 0) {
          that.cardInfo.cardNo = res.data.substring(20, 40)
          that.cardInfo.carNo = that.convertLisenceNo(res.data.substring(56, 80)) || ''
          that.cardInfo.licencseColor = parseInt(res.data.substr(82, 2), 16) || '0'
          that.bleText = '查询成功'
          console.log('卡信息: ' + JSON.stringify(that.cardInfo))
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
        console.log('>>>>>> 开始激活')
        let aaa = await this.readSystem()
        console.log('>>>>>> 读取系统防拆为和合同序列号成功： ' + JSON.stringify(aaa))
        let hth = aaa.substring(20, 36)
        console.log('>>>>>> 合同序列号: ' + hth)
        // let qc = await this.queryCount(hth)
        let bbb = await this.readSystemRand()
        console.log('>>>>>> 读取随机数成功： ' + JSON.stringify(bbb))
        let iReturn = await this.getMac(hth, bbb)
        console.log('>>>>>> 获取3mac成功: ' + JSON.stringify(iReturn))
        let iMac = this.validateTMAC(iReturn)
        let ia = '04D6811A0501' + iMac + ''
        console.log('>>>>>> 激活指令:   ' + JSON.stringify(ia))
        let iFinish = await this.writeSystem(ia)
        console.log('>>>>>> 激活结果: ' + JSON.stringify(iFinish))
        $Toast({
          type: 'success',
          duration: 5,
          content: `激活成功!`
        })
        this.obuFinish(hth)
        this.gotoHome()
        wx.hideLoading()
      } catch (err) {
        console.log('激活失败' + JSON.stringify(err))
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 5,
          content: `激活失败`
        })
        this.gotoHome()
      }
    },
    readSystem () {
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
    readSystemRand (cosArr) {
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
    writeSystem(cos) {
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
            res.data === '0' ? reject('同一标签一天只能激活3次!') : resolve('ok')
          } else {
            reject('同一标签一天只能激活3次!')
          }
        }).catch(err => {
          reject('同一标签一天只能激活3次!')
          console.log(`同一标签一天只能激活3次! ${err}`)
        })
      })
    },
    async obuFinish(obuId) {
      let params = {
        userId: this.openid,
        mobile: this.mobile,
        obuId: obuId,
        obuSn: this.obuContractNo,
        plateNumber: this.cardInfo.carNo,
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
    closeBlue () {
      JLObuSDK.DisonnectDevice((res) => {
        console.info('断开连接设备:' + JSON.stringify(res))
      })
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
    JLObuSDK.DisonnectDevice((res) => {
      console.info('断开连接设备:' + JSON.stringify(res))
    })
  },
  onUnload () {
    clearInterval(this.heartbeat)
    clearTimeout(this.scanTimer)
    JLObuSDK.DisonnectDevice((res) => {
      console.info('断开连接设备:' + JSON.stringify(res))
    })
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
