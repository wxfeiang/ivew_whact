<template>
  <div class="bind">
    <div class="steps">
      <!-- <i-steps :items="items" :activeIndex='sIndex'/> -->
      <i-steps :current="curSteps" i-class="iStepss">
        <i-step i-class="iStepp">
          <view slot="title">
            连接设备
          </view>
        </i-step>
        <i-step i-class="iStepp">
          <view slot="title">
            圈存余额
          </view>
        </i-step>
        <i-step i-class="iStepp">
          <view slot="title">
            圈存成功
          </view>
        </i-step>
    </i-steps>
    </div>
    <div class="link" v-if="curSteps === 0">
      <div class="intro">
        <img class="simg" src="/static/images/bleClose.jpg" alt="" v-if="!bleStatus">
        <img class="simg" src="/static/images/bleOpen.jpg" alt="" v-if="bleStatus">
        <div class="sfont">{{bleText}}</div>
      </div>
      <div class="ltitle">
        <span>1: 只支持金溢设备</span>
        <span>2: 不支持记账卡圈存</span>
        <span>3: 圈存失败后，请重新开始连接设备</span>
      </div>
      <div class="lbutton">
        <button class="llbutton"  @click="gotoLink">连接设备</button>
      </div>
    </div>

    <div class="show" v-if="curSteps === 1">
      <i-modal title="请确认以下信息是否正确" ok-text="圈存" :visible="showdModal" @ok="clickConfirm" @cancel="clickCancel">
        <view>{{tipContent.carContent}}</view>
        <view>{{tipContent.cardContent}}</view>
        <view>{{tipContent.moneyContent}}</view>
      </i-modal>
      <div class="money">
        <div class="msub">圈存金额</div>
        <div class="mmain">{{balance}}元</div>
      </div>
      <div class="scontent">
        <div class="pai">
          <span class="leff"></span>
          <div class="main">
            车牌号: </div>
          <div class="sub">{{cardInfo.carNo}}</div>
        </div>
        <div class="pai">
          <span class="leff"></span>
          <div class="main">卡号: </div>
          <div class="sub">{{cardInfo.cardNo}}</div>
        </div>
        <div class="pai">
          <span class="leff"></span>
          <div class="main">卡片余额: </div>
          <div class="sub">{{cardInfo.balance}}元</div>
        </div>
      </div>
      <div class="sbutton">
        <button class="ssbutton"  @click="recharge(cardInfo)">开始圈存</button>
      </div>
    </div>

    <div class="success" v-if="curSteps === 2">
      <div class="pic"><i class="icon iconfont icon-caozuochenggong simg"></i></div>
      <div class="title" v-if="loadBack">补圈成功!</div>
      <div class="title" v-else>圈存成功!</div>
      <div class="cbalance">
        <div class="cbcontent" v-if="loadBack">已补圈上一次未圈存金额: {{loadBackMoney}}元</div>
        <div class="cbcontent">卡片余额: {{cardInfo.balance}}元</div>
        <div class="cbcontent">账户余额: {{balance}}元</div>
      </div>
      <div class="fbutton">
        <button class="ffbutton"  @click="gotoFirst">返回</button>
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
import {loadMacCheck, loadMacGenerate, noticeLoadBefore, noticeLoadReport, epayToken, epayBalance, epayStart, epayEnd} from '@/api/etc'
import { walletQuery } from '@/api/pay'
import {mapState, mapMutations} from 'vuex'
import * as types from '@/store/mutation-types'
export default {
  data () {
    return {
      curSteps: 0,
      items: [
        {
          num: '1',
          text: '连接设备'
        },
        {
          num: '2',
          text: '圈存余额'
        },
        {
          num: '3',
          text: '圈存成功'
        }
      ],
      sIndex: 0,
      showdModal: false,
      mTitle: '',
      tipContent: {
        carContent: '',
        cardContent: '',
        moneyContent: ''
      },
      bleStatus: false,
      bleText: '请开启蓝牙',
      heartbeat: '',
      scanTimer: '',
      obuContractNo: '',
      cardInfo: {
        cardType: '',
        cardNo: '',
        carNo: '',
        licencseColor: '',
        balance: '0',
        NCbalance: '0' // 不转换的单位
      },
      loadBack: false,
      loadBackMoney: '',
      rechargeMoney: 0,
      reTime: '',
      remac2: '',
      instructionsLoad: '',
      rechargeList: [],
      blueMac: ''
    }
  },
  computed: {
    ...mapState([
      'openid',
      'balance'
    ])
  },
  methods: {
    ...mapMutations({
      saveBalance: types.SYSTEM_BALANCE
    }),
    getOBUMac() {
      let that = this
      genUtils.selfDeviceChannel('C6', function (code, res) {
        that.blueMac = res.substr(8, res.length) || 'C8478C4F65A1'
      })
    },
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
            // if (c.substr(0, 4) !== '6210') {
            //   wx.hideLoading()
            //   $Toast({
            //     type: 'warning',
            //     duration: 3,
            //     content: `该型号设备暂不支持!`
            //   })
            //   that.closeBlue()
            // } else {
            // 读取卡片信息
            genUtils.getICCInfo(function (code, res) {
              if (code === '0') {
                that.curSteps = 1
                that.cardInfo.cardNo = res.cardId
                that.cardInfo.carNo = that.convertLisenceNo(res.vehicleNumber)
                that.cardInfo.licencseColor = res.plateColor
                that.cardInfo.NCbalance = res.balance
                that.cardInfo.balance = that.convertCardMoney(res.balance)
                that.bleText = '查询成功'
                that.getOBUMac()
                wx.hideLoading()
              } else {
                wx.hideLoading()
                $Toast({
                  type: 'warning',
                  duration: 3,
                  content: `读取卡片信息失败!`
                })
              }
            })
            // }
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
    recharge (itemData) {
      this.showdModal = true
      this.rechargeMoney = this.balance
      this.tipContent.carContent = `车牌号: ${itemData.carNo}`
      this.tipContent.cardContent = `卡号: ${itemData.cardNo}`
      this.tipContent.moneyContent = `圈存金额: ￥${this.rechargeMoney}`
    },
    clickCancel () {
      this.showdModal = false
    },
    clickConfirm () {
      this.showdModal = false
      // TODO: 目前圈存金额写死为1元
      this.rechargeMoney = '1'
      this.rechargeMoney = parseInt(100 * Number(this.rechargeMoney))
      this.writeCardStart()
    },
    creditLoadInit (toMoney) {
      let that = this
      const pinCode = '313233343536'
      const procTypeByte = '02' // 交易类型 01-ED(电子存折) 02-EP(电子钱包)
      const keyIndex = '01' // 秘钥索引号
      const deviceNo = this.blueMac.toUpperCase() // 终端机编号
      // PIN码输入连续三次失败会锁卡
      return new Promise((resolve, reject) => {
        genUtils.pinCode(pinCode, procTypeByte, keyIndex, toMoney, deviceNo, function (code, res) {
          if (code === '0') {
            resolve(res)
          } else {
            reject(new Error('圈存校验失败,请注意:校验失败三次,将锁卡!'))
          }
        })
      })
    },
    async writeCardStart () {
      wx.showLoading({title: '正在圈存', mask: true})
      let carNumber = null
      let curTime = null
      let curTimeForm = null
      let curTimeSeq = null
      let iToken = null
      let clInit = null
      let epBalance = null
      let epStart = null
      let epRechargeId = null
      let TAC = null
      let xissuerHandleTime = null
      let beforeCardBalance = this.cardInfo.NCbalance
      let cardBalance = null
      let toMoney = this.rechargeMoney
      let loadStatus = false
      let usId = null
      try {
        carNumber = this.cardInfo.cardNo.substr(4, this.cardInfo.cardNo.length)
        this.heartFunc()
        iToken = await this.epayToToken()
        clInit = await this.creditLoadInit(this.rechargeMoney)
        epBalance = await this.epayToBalance(iToken, carNumber, clInit)
        const { cardStatus, rechargeStatus, amount, rechargeAmountAll } = epBalance
        if (epBalance.rechargeStatus !== 1) {
          // 需要补圈
          this.loadBack = true
          this.supplyLoad = true
          this.loadBackMoney = this.convertCardMoney(amount)
          toMoney = amount
          clInit = await this.creditLoadInit(toMoney)
        }
        usId = await this.loadNoticeBefore(carNumber, beforeCardBalance, toMoney)
        console.log('圈存金额: ' + toMoney)
        curTime = new Date()
        curTimeForm = util.formatTime(curTime)
        curTimeSeq = util.formatTimeStr(curTime)
        epStart = await this.epayToStart(carNumber, curTimeForm, curTimeSeq, clInit, iToken, toMoney)

        const {mac2, issuerHandleTime, rechargeId} = epStart
        epRechargeId = rechargeId
        xissuerHandleTime = issuerHandleTime
        const wReturn = await this.loadCreditWrite(curTimeSeq, mac2.toUpperCase())
        TAC = wReturn[0].substr(0, 8) || ''
        loadStatus = true
        cardBalance = await this.readCardBalance()
      } catch (err) {
        $Toast({
          type: 'error',
          duration: 5,
          content: `圈存失败 ${err}`
        })
        console.log(`圈存失败: ${err}`)
      }
      if (loadStatus) {
        await this.epayToEnd(carNumber, curTimeForm, cardBalance, toMoney, clInit, TAC, xissuerHandleTime, iToken)
        await this.loadNoticeAfter(usId, epRechargeId, loadStatus, this.loadBack, beforeCardBalance, toMoney)
        wx.hideLoading()
        this.curSteps = 2
        const poCode = await this.powerOff()
        clearInterval(this.heartbeat)
      } else {
        await this.loadNoticeAfter(usId, epRechargeId, loadStatus, this.loadBack, beforeCardBalance, toMoney)
        wx.hideLoading()
        const poCode = await this.powerOff()
        this.gotoHome()
        clearInterval(this.heartbeat)
      }
    },
    loadNoticeBefore(carNumber, beforeCardBalance, money) {
      let bParams = {
        openid: this.openid,
        cardId: carNumber,
        rechargePreAmount: beforeCardBalance, // 充值前金额
        rechargeAmount: money, // 充值金额
        rechargePostAmount: util.accAdd(beforeCardBalance, money), // 充值后金额
        bluetoothId: this.obuContractNo // 圈存的蓝牙设备序列号
      }
      return new Promise((resolve, reject) => {
        noticeLoadBefore(bParams).then(res => {
          if (res.status === 200 && res.data) {
            resolve(res.data)
          } else {
            reject(new Error('圈存前上报未返回id!'))
          }
          console.log('圈存前上报: ' + JSON.stringify(res))
        }).catch(err => {
          reject(new Error('圈存前上报异常!'))
          console.log(`圈存前上报异常: ${err}`)
        })
      })
    },
    async loadNoticeAfter(usId, epRechargeId, loadStatus, loadBack, beforeCardBalance, money) {
      let bParams = {
        id: usId || '0',
        cardId: '1601221001020001',
        rechargePreAmount: beforeCardBalance,
        rechargeAmount: money,
        rechargePostAmount: util.accAdd(beforeCardBalance, money),
        openid: this.openid,
        bluetoothId: this.obuContractNo,
        rechargeId: epRechargeId || '0',
        state: loadStatus ? 1 : 0, // 0失败 ，1成功
        loadStatus: loadBack ? 1 : 0 // 0正常圈存，1为补圈
      }
      // noticeLoadReport(bParams).then(res => {
      //   console.log(`圈存后上报成功`)
      // }).then(res => {
      //   this.balanceQuery()
      // }).catch(err => {
      //   console.log(`圈存后上报异常: ${err}`)
      // })
      try {
        let nlra = await noticeLoadReport(bParams)
        console.log(`圈存后上报成功 ${JSON.stringify(nlra)}`)
        await this.balanceQuery()
      } catch (err) {
        console.log(`圈存后上报异常: ${err}`)
      }
    },
    epayToToken() {
      // 获取token接口
      const epTokenParams = {
        head: {
          channel: '30ep17',
          timestamp: new Date().getTime() + '',
          type: 'post'
        },
        body: {
          id: '123',
          pass: '1111'
        }
      }
      return new Promise((resolve, reject) => {
        epayToken(epTokenParams).then(res => {
          if (res.status === 0 && res.message && JSON.parse(res.message).data) {
            resolve(JSON.parse(res.message).data)
          } else {
            reject(new Error('获取令牌失败!'))
          }
        }).catch(err => {
          reject(new Error('获取令牌异常!'))
          console.log(`获取令牌异常: ${err}`)
        })
      })
    },
    epayToBalance(iToken, carNumber, clInit) {
      // 可圈存余额查询
      const epBalanceParams = {
        head: {
          channel: '30ep103',
          timestamp: new Date().getTime() + '',
          type: 'post'
        },
        body: {
          token: iToken,
          cardId: carNumber,
          num: clInit.counter.toUpperCase(),
          source: '4'
        }
      }
      return new Promise((resolve, reject) => {
        epayBalance(epBalanceParams).then(res => {
          if (res.status === 0 && res.message && JSON.parse(res.message)) {
            const epBalanceMessage = JSON.parse(res.message)
            console.log(`30ep103:   ${JSON.stringify(res)}`)
            if (epBalanceMessage.code === 0 && epBalanceMessage.data) {
              const { cardStatus, rechargeStatus, amount, rechargeAmountAll } = epBalanceMessage.data
              console.log(`30ep103 data:   ${JSON.stringify(epBalanceMessage.data)}`)
              // 校验卡状态
              if (cardStatus === 1) {
                resolve(epBalanceMessage.data)
              } else {
                reject(new Error('卡片状态异常!'))
              }
            } else {
              reject(new Error(`${epBalanceMessage.msg}`))
            }
          } else {
            reject(new Error('圈存余额查询异常!'))
          }
        }).catch(err => {
          reject(new Error('圈存余额查询异常!'))
          console.log(`圈存余额查询异常: ${err}`)
        })
      })
    },
    epayToStart(carNumber, curTimeForm, curTimeSeq, clInit, iToken, rechargeMoney) {
      const epStartParams = {
        head: {
          channel: '30ep104',
          timestamp: new Date().getTime(),
          type: 'post'
        },
        body: {
          cardId: carNumber,
          issuerId: 'B8CACBE062010001',
          issuerNetId: '6201',
          terminalId: this.blueMac.toUpperCase(),
          acquirerTransTime: curTimeForm,
          acquirerId: '00000004',
          rechargePreAmount: this.cardInfo.NCbalance + '', // 卡交易前余额 分
          rechargeAmount: rechargeMoney + '', // 交易金额 分
          transNum: clInit.counter.toUpperCase(), // 联机交易序号
          pseudoRandom: clInit.random.toUpperCase(), // 伪随机数
          rewriteFlag: '0',
          mac1: clInit.mac1.toUpperCase(),
          mac2: '',
          token: iToken,
          channelType: '2',
          rechargeResurce: '4',
          bankWasteNo: curTimeSeq + '', // reportId, // 小程序流水号
          terminalName: global.model || '0'
        }
      }
      return new Promise((resolve, reject) => {
        epayStart(epStartParams).then(res => {
          if (res.status === 0 && res.message && JSON.parse(res.message)) {
            const epStartMessage = JSON.parse(res.message)
            if (epStartMessage.code === 0 && epStartMessage.data) {
              resolve(epStartMessage.data)
            } else {
              reject(new Error(`${epStartMessage.msg}!`))
            }
          } else {
            reject(new Error(`圈存开始异常${res.message}!`))
          }
        }).catch(err => {
          reject(new Error('圈存开始异常!'))
          console.log(`圈存开始异常: ${err}`)
        })
      })
    },
    loadCreditWrite (times, mac2) {
      return new Promise((resolve, reject) => {
        genUtils.loadCreditWrite(times, mac2, function (code, res) {
          if (code === '0') {
            resolve(res)
          } else {
            reject(new Error('写卡出错' + JSON.stringify(res)))
          }
        })
      })
    },
    async epayToEnd(carNumber, curTimeForm, cardBalance, rechargeMoney, clInit, TAC, issuerHandleTime, iToken) {
      // 预充值账户圈存结束
      const epEndParams = {
        head: {
          channel: '30ep57',
          timestamp: new Date().getTime() + '',
          type: 'post'
        },
        body: {
          cardId: carNumber,
          issuerId: 'B8CACBE062010001',
          issuerNetId: '6201',
          terminalId: this.blueMac.toUpperCase(),
          acquirerTransTime: curTimeForm,
          acquirerId: '00000004',
          rechargePostAmount: cardBalance.NCbalance + '', // 卡交易后余额
          rechargeAmount: rechargeMoney + '', // 交易金额
          transNum: clInit.counter.toUpperCase(), // 联机交易序号
          termTransNum: '',
          tac: TAC,
          issuerHandleTime: issuerHandleTime,
          token: iToken,
          channelType: '2',
          rechargeResurce: '4'
        }
      }
      // epayEnd(epEndParams).then(res => {
      //   console.log(`预充值账户圈存结束 finish: ${JSON.stringify(res)}`)
      // }).catch(err => {
      //   console.log(`预充值账户圈存结束异常: ${err}`)
      // })
      try {
        let epe = await epayEnd(epEndParams)
        console.log(`预充值账户圈存结束 finish: ${JSON.stringify(epe)}`)
      } catch (err) {
        console.log(`预充值账户圈存结束异常: ${err}`)
      }
    },
    readCardBalance () {
      let that = this
      return new Promise((resolve, reject) => {
        genUtils.deviceChannel('C0', function (code, res) {
          if (code === '0') {
            // 读取卡片信息
            genUtils.getICCInfo(function (code, res) {
              if (code === '0') {
                that.cardInfo.cardType = parseInt(res.cardType, 16)
                if (that.cardInfo.cardType === 22) {
                  that.cardInfo.NCbalance = res.balance
                  that.cardInfo.balance = that.convertCardMoney(res.balance)
                  resolve(that.cardInfo)
                } else {
                  that.cardInfo.balance = '读取卡片余额失败!'
                  that.cardInfo.NCbalance = '0'
                  resolve(that.cardInfo)
                }
              } else {
                that.cardInfo.balance = '读取卡片余额失败!'
                that.cardInfo.NCbalance = '0'
                resolve(that.cardInfo)
              }
            })
          } else {
            that.cardInfo.balance = '读取卡片余额失败!'
            that.cardInfo.NCbalance = '0'
            resolve(that.cardInfo)
          }
        })
      })
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
      console.log('gotoHome')
      this.curSteps = 0
      this.loadStatus = false
      this.loadBack = false
      this.closeBlue()
    },
    gotoFirst () {
      this.curSteps = 0
      this.loadStatus = false
      this.loadBack = false
      clearInterval(this.heartbeat)
      this.closeBlue()
    },
    async balanceQuery () {
      try {
        let params = {
          openid: this.openid || ''
        }
        let iReturn = await walletQuery(params)
        console.log(`balanceQuery: ${JSON.stringify(iReturn)}`)
        if (iReturn.status === 200 && iReturn.data) {
          console.log('账户余额 成功: ' + iReturn.data)
          let tmpBalance = iReturn.data
          this.saveBalance(tmpBalance)
        } else {
          console.log('账户余额 未返回')
        }
      } catch (err) {
        console.log(`获取余额失败${err}`)
      }
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
  .steps
    width 100%
    height 11%
    display flex
    flex-flow column nowrap
    justify-content center
    align-items center
    background-color white-color
    .content
      width 100%
      height 90%
      display flex
      flex-flow column nowrap
      justify-content center
      align-items center
      .item
        font-size 13px !important
        color title-font
  .link
    width 100%
    height 88%
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
        top 45px
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
      // &-other
      //   width 90%
      //   height 15%
      //   display flex
      //   flex-flow row wrap
      //   justify-content space-around
      //   align-items center
      //   &-title
      //     width 20%
      //     height 100%
      //     display flex
      //     flex-flow row nowrap
      //     justify-content flex-start
      //     align-items center
      //   &-money
      //     width 70%
      //     height 70%
      //     display flex
      //     flex-flow row wrap
      //     justify-content flex-start
      //     align-items center
      //     border 1px #efefef solid
      //     border-radius 5px
  .show
    width 100%
    height 88%
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    .scontent
      width 100%
      height 40%
      display flex
      flex-flow column nowrap
      justify-content space-around
      align-items center
      background-color #ffffff
      .pai
        width 100%
        height 100%
        display flex
        flex-flow row nowrap
        justify-content space-around
        align-items center
        border-bottom 1px bg-color solid
        .leff
          width 4px
          height 30%
          background-color main-color
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
        .main
          width 20%
          height 90%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          font-size 15px
          color main-font
        .sub
          width 70%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          font-size 15px
          color main-font
    .money
      width 100%
      height 30%
      display flex
      flex-flow column nowrap
      justify-content space-around
      align-items center
      background-color main-color
      .mmain
        width 100%
        height 60%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items flex-start
        font-size 40px
        color white-color
      .msub
        width 100%
        height 40%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items flex-end
        font-size 15px
        color white-color
    .sbutton
      width 90%
      height 10%
      bottom 0
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      margin-top 50px
      .ssbutton
        width 100%
        height 80%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        background-color main-color
        font-size 15px
        color white-color
  .success
    width 100%
    height 88%
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    background-color #ffffff
    border-top 1px bg-color solid
    .pic
      width 100%
      height 40%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      .simg
        width 60%
        height 60%
        color #22ad38
        font-size 140px
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
    .title
      width 100%
      height 10%
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      color #22ad38
      font-size 25px
    .cbalance
      width 80%
      height 20%
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      margin-top 20px
      border-top 1px #22ad38 solid
      border-bottom 1px #22ad38 solid
      .cbcontent
        width 80%
        height 100%
        font-size 15px
        color title-font
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        margin-top 5px
    .fbutton
      width 80%
      height 30%
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      .ffbutton
        width 100%
        height 25%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items center
        background-color main-color
        font-size 15px
        color white-color
</style>
