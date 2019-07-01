<script>
import { mapState, mapMutations } from 'vuex'
import * as types from '@/store/mutation-types'
import * as cp from './utils/handleLogin'
import global from './utils/global'
import { carBindList, carServiceNotify } from '@/api/car'
import { walletQuery, queryDebt } from '@/api/pay'
export default {
  computed: {
    ...mapState(['openid', 'mobile', 'car', 'plateNo'])
  },
  created() {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */
    // let logs
    // if (mpvuePlatform === 'my') {
    //   logs = mpvue.getStorageSync({key: 'logs'}).data || []
    //   logs.unshift(Date.now())
    //   mpvue.setStorageSync({
    //     key: 'logs',
    //     data: logs
    //   })
    // } else {
    //   logs = mpvue.getStorageSync('logs') || []
    //   logs.unshift(Date.now())
    //   mpvue.setStorageSync('logs', logs)
    // }
    const that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          that.saveAuthenticated(true)
          if (!that.openid) {
            cp.login()
          }
        }
      }
    })
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经发布,是否重启应用?',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了',
              content: '新版本已经上线啦,请您删除当前小程序,重新搜索打开!'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低,请升级到最新微信版本后重试!'
      })
    }

    wx.getSystemInfo({
      success(system) {
        console.log(`system:`, system)
        global.mobileInfo.brand = system.brand
        global.mobileInfo.model = system.model
      }
    })
  },
  log() {},
  onError(err) {
    console.log(`发现 onError: ${err}`)
  },
  methods: {
    ...mapMutations({
      saveAuthenticated: types.SYSTEM_AUTHENTICATED,
      saveCar: types.SYSTEM_CAR,
      saveBalance: types.SYSTEM_BALANCE,
      savePlateNo: types.SYSTEM_PLATENO,
      saveRepayment: types.SYSTEM_REPAYMENT,
      saveRepaymentData: types.SYSTEM_REPAYMENT_DATA
    }),
    async getCarList() {
      wx.showLoading({ title: '加载中', mask: true })
      let params = {
        openid: this.openid || '',
        mobile: this.mobile || ''
      }
      try {
        let iReturn = await carBindList(params)
        wx.hideLoading()
        if (iReturn.status === 200 && iReturn.data) {
          console.log('App.vue getCarList: ' + JSON.stringify(iReturn))
          if (iReturn.data.length > 0) {
            let tmpNewList = []
            iReturn.data.forEach((item, index) => {
              item.etcService = item.etcService === 1
              tmpNewList.push(item)
            })
            this.saveCar(tmpNewList)
          } else {
            this.saveCar([])
          }
        }
      } catch (err) {
        wx.hideLoading()
        console.log('App.vue 获取车辆数据失败!')
      }
    },
    async carNotify() {
      wx.showLoading({ title: '加载中', mask: true })
      let iParams = {
        plateColor: '0',
        plateNumber: this.plateNo,
        openid: this.openid,
        tradeScene: 'HIGHWAY',
        phone: this.mobile
      }
      try {
        let iReturn = await carServiceNotify(iParams)
        console.log('carNotify 返回: ' + JSON.stringify(iReturn))
        wx.hideLoading()
        this.savePlateNo('')
        console.log('清楚开通车主服务 车牌缓存: ' + this.plateNo)
        await this.getCarList()
      } catch (err) {
        wx.hideLoading()
        console.log('车主服务上报通知失败!')
      }
    },
    async balanceQuery () {
      wx.showLoading({ title: '加载中', mask: true })
      try {
        let params = {
          openid: this.openid || ''
        }
        let iReturn = await walletQuery(params)
        wx.hideLoading()
        if (iReturn.status === 200 && iReturn.data) {
          let tmpBalance = iReturn.data
          this.saveBalance(tmpBalance)
        }
      } catch (err) {
        wx.hideLoading()
        console.log('App.vue 获取车辆数据失败!')
      }
    },
    async queryRepapment() {
      try {
        let iparam = {
          channel: 'wx_repay',
          openid: this.openid
        }
        let iReturn = await queryDebt(iparam)
        console.log('垫资还款返回:  ' + JSON.stringify(iReturn))
        if (iReturn.status === 200 && iReturn.data) {
          if (iReturn.data !== -1) {
            this.saveRepayment(true)
            this.saveRepaymentData(iReturn.data)
          } else {
            this.saveRepayment(false)
            this.saveRepaymentData({})
          }
        } else {
          console.log('查询垫资欠费失败: ' + JSON.stringify(iReturn))
        }
      } catch (err) {
        console.log('查询垫资欠费异常: ' + JSON.stringify(err))
      }
    }
  },
  onShow(res) {
    // TODO: 查询垫资还款是否有欠费
    this.queryRepapment()
    if (res.scene === 1038) {
      const { appId, extraData } = res.referrerInfo
      if (appId === 'wxbd687630cd02ce1d') {
        // 代扣
        if (typeof extraData === 'undefined') {
          // TODO  ***用户击左上角的返回***
          // 客户端小程序不确定签约结果，需要向商户侧后台请求确定签约结果
          console.log('免密支付签约: undefined')
          return
        }
        if (extraData.return_code === 'SUCCESS') {
          // TODO: 调后台接口，保存contractId
          let contractId = extraData.contract_id
          console.log('代扣返回的协议id: ' + contractId)
        } else {
          wx.showToast({
            title: `免密支付签约失败${extraData.return_msg}`,
            icon: 'none',
            duration: 4000
          })
          console.log(`免密支付签约失败${extraData.return_msg}`)
        }
      } else if (appId === 'wxbcad394b3d99dac9') {
        // 车主服务
        console.log('开通车主服务的车牌: ' + this.plateNo)
        if (this.plateNo) {
          this.carNotify()
        }
        // 车主服务
        // if (typeof extraData === 'undefined') {
        //   // 客户端小程序不确定授权结果，需要发起‘用户状态查询接口’确认授权结果
        //   console.log('车主服务签约: undefined')
        //   return
        // }
        // console.log('extraData: ' + JSON.stringify(extraData))
        // if (extraData.auth === 'true' || extraData.ret_code === 0) {
        //   console.log('车主服务签约成功')
        // } else {
        //   console.log('车主服务签约失败')
        // }
      }
    } else {
      if (this.openid) {
        this.getCarList()
        // this.balanceQuery()
      }
    }
  },
  onHide() {
    console.log('onHide')
  }
}
</script>

<style lang="stylus">
@import './../static/fonts/iconfont.css'
page
  width 100%
  height 100%
  background-color bg-color
</style>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus"
@import "./style/variables.styl"
</style>
