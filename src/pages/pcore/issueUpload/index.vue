<template>
  <div class="upload">
    <div class="ucar">
      <span class="utitle">行驶证照</span>
      <div class="tphoto">
        <div class="tpc">
          <div class="font" @click="jectModel('vehicleLicenseMain')">
            <image src="/static/images/xsz.jpg" mode="scaleToFill" class="ppimg" v-if="!ocrData.vehicleMain"/>
            <image :src="ocrData.vehicleMain" mode="scaleToFill" class="ppimg" v-else/>
          </div>
        </div>
        <div class="tpc">
          <div class="back" @click="jectModel('vehicleLicenseSub')">
            <image src="/static/images/xsz2.jpg" mode="scaleToFill" class="ppimg" v-if="!ocrData.vehicleSub"/>
            <image :src="ocrData.vehicleSub" mode="scaleToFill" class="ppimg" v-else/>
          </div>
        </div>
      </div>
    </div>
    <div class="uid">
      <span class="utitle">身份证及车头照</span>
      <div class="tphoto">
        <div class="tpc">
          <div class="font" @click="jectModel('idFront')">
            <image src="/static/images/sfz.jpg" mode="scaleToFill" class="ppimg" v-if="!ocrData.uFront"/>
            <image :src="ocrData.uFront" mode="scaleToFill" class="ppimg" v-else/>
          </div>
        </div>
        <div class="tpc">
          <div class="font" @click="jectModel('carHead')">
            <image src="/static/images/ct.jpg" mode="scaleToFill" class="ppimg" v-if="!ocrData.carHead"/>
            <image :src="ocrData.carHead" mode="scaleToFill" class="ppimg" v-else/>
          </div>
        </div>
      </div>
    </div>
    <div class="pbutton">
      <button class="bbutton" @click="toAddress()">下一步</button>
    </div>
    <upload v-model="jectData.showJect" :content="jectData.whichImg" :setLoading="jectData.btnLoading" :setTitle="jectData.btnTitle" :type="jectData.whichType" @cancel="clickJectCancel" @confirm="clickJectConfirm"></upload>
    <i-toast id="toast"/>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import { goodsPhotoUpload, hasOrder } from '@/api/goods'
import { mapState, mapMutations } from 'vuex'
import * as types from '@/store/mutation-types'
import upload from '@/components/upload.vue'
import ocr from '@/api/ocr'
const sysChannel = {
  idFront: '身份证头像面',
  vehicleLicenseMain: '行驶证印章页',
  vehicleLicenseSub: '行驶证条码页',
  carHead: '车头照'
}
export default {
  components: {
    upload
  },
  data() {
    return {
      jectData: {
        showJect: false,
        whichImg: '',
        whichType: '',
        btnLoading: false,
        btnTitle: '拍照'
      },
      ocrData: {
        uFront: null,
        vehicleMain: null,
        vehicleSub: null,
        carHead: null,
        idcard: {
          name: '',
          idNo: '',
          imageId: ''
        },
        vehicle: {
          plateNo: '',
          vehicleType: '',
          owner: '',
          address: '',
          useCharacter: '',
          model: '',
          vin: '',
          engineNo: '',
          registerDate: '',
          issueDate: '',
          approvedCount: '',
          vehicleImgOriId: '',
          vehicleImgDupId: '',
          splateNo: ''
        },
        car: {
          carHeadPlateNo: '',
          plateNoColor: '',
          carImgId: ''
        }
      },
      applyId: ''
    }
  },
  computed: {
    ...mapState(['openid', 'mobile', 'issueData'])
  },
  methods: {
    jectModel(data) {
      let that = this
      this.jectData.showJect = true
      if (data === 'idFront') {
        this.jectData.whichImg = '/static/images/zj1.png'
        if (this.ocrData.uFront) {
          let preFront = []
          preFront.push(this.ocrData.uFront)
          wx.previewImage({
            urls: preFront,
            current: preFront[0]
          })
        }
      }
      if (data === 'vehicleLicenseMain') {
        this.jectData.whichImg = '/static/images/zj3.png'
        if (this.ocrData.vehicleMain) {
          let preVehicle = []
          preVehicle.push(this.ocrData.vehicleMain)
          wx.previewImage({
            urls: preVehicle,
            current: preVehicle[0]
          })
        }
      }
      if (data === 'vehicleLicenseSub') {
        this.jectData.whichImg = '/static/images/zj4.png'
        if (this.ocrData.vehicleSub) {
          let preVehicleSub = []
          preVehicleSub.push(this.ocrData.vehicleSub)
          wx.previewImage({
            urls: preVehicleSub,
            current: preVehicleSub[0]
          })
        }
      }
      if (data === 'carHead') {
        this.jectData.whichImg = '/static/images/zj5.png'
        if (this.ocrData.carHead) {
          let preCarhead = []
          preCarhead.push(this.ocrData.carHead)
          wx.previewImage({
            urls: preCarhead,
            current: preCarhead[0]
          })
        }
      }
      this.jectData.whichType = data
    },
    clickJectCancel() {
      this.jectData.showJect = false
    },
    clickJectConfirm(type) {
      console.log('clickJectConfirm: ', type)
      if (type === 'idFront') {
        this.toFront()
      }
      if (type === 'vehicleLicenseMain') {
        this.toVehicleMain()
      }
      if (type === 'vehicleLicenseSub') {
        this.toVehicleSub()
      }
      if (type === 'carHead') {
        this.toCarHead()
      }
    },
    async toFront() {
      let that = this
      try {
        let idReturn = await this.chooseImage('身份证头像面')
        this.ocrData.uFront = idReturn
        this.jectData.btnLoading = true
        this.jectData.btnTitle = '上传中...'
        let upReturn = await this.toUpload(idReturn, '1')
        console.log('返回的照片id: ' + upReturn.id)
        this.ocrData.idcard.imageId = upReturn.id
        let oReturn = await this.toOCRID(idReturn)
        console.log('toOCRID: ' + JSON.stringify(oReturn))
        this.ocrData.idcard.name = oReturn.姓名 ? oReturn.姓名.words || '未识别' : '未识别'
        this.ocrData.idcard.idNo = oReturn.公民身份号码 ? oReturn.公民身份号码.words || '未识别' : '未识别'
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '拍照'
        this.jectData.showJect = false
        this.saveIssue(this.ocrData)
      } catch (err) {
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '拍照'
        this.ocrData.uFront = null
        console.log(`上传身份证头像面异常 ${err}`)
        $Toast({
          type: 'error',
          duration: 5,
          content: `${err}`
        })
      }
    },
    async toCarHead() {
      let that = this
      try {
        let idReturn = await this.chooseImage('车头照')
        this.ocrData.carHead = idReturn
        this.jectData.btnLoading = true
        this.jectData.btnTitle = '上传中...'
        let upReturn = await this.toUpload(idReturn, '2')
        console.log('返回的照片id: ' + upReturn.id)
        this.ocrData.car.carImgId = upReturn.id
        let oReturn = await this.toOCRCar(idReturn)
        console.log('toOCRCar: ' + JSON.stringify(oReturn))
        this.ocrData.car.carHeadPlateNo = oReturn.number || '未识别'
        this.ocrData.car.plateNoColor = oReturn.color || '未识别'
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '拍照'
        this.jectData.showJect = false
        this.saveIssue(this.ocrData)
      } catch (err) {
        this.ocrData.carHead = null
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '拍照'
        console.log(`上传车头照异常${err}`)
        $Toast({
          type: 'error',
          duration: 5,
          content: `${err}`
        })
      }
    },
    async toVehicleMain() {
      let that = this
      try {
        let idReturn = await this.chooseImage('行驶证印章页')
        this.ocrData.vehicleMain = idReturn
        this.jectData.btnLoading = true
        this.jectData.btnTitle = '上传中...'
        let upReturn = await this.toUpload(idReturn, '4')
        console.log('返回的照片id: ' + upReturn.id)
        this.ocrData.vehicle.vehicleImgOriId = upReturn.id
        let oReturn = await this.toOCRVehicle(idReturn)
        console.log('toOCRVehicle: ' + JSON.stringify(oReturn))
        this.ocrData.vehicle.plateNo = oReturn.号牌号码 ? oReturn.号牌号码.words || '未识别' : '未识别'
        this.ocrData.vehicle.vehicleType = oReturn.车辆类型 ? oReturn.车辆类型.words || '未识别' : '未识别'
        this.ocrData.vehicle.owner = oReturn.所有人 ? oReturn.所有人.words || '未识别' : '未识别'
        this.ocrData.vehicle.address = oReturn.住址 ? oReturn.住址.words || '未识别' : '未识别'
        this.ocrData.vehicle.useCharacter = oReturn.使用性质 ? oReturn.使用性质.words || '未识别' : '未识别'
        this.ocrData.vehicle.model = oReturn.品牌型号 ? oReturn.品牌型号.words || '未识别' : '未识别'
        this.ocrData.vehicle.vin = oReturn.车辆识别代号 ? oReturn.车辆识别代号.words || '未识别' : '未识别'
        this.ocrData.vehicle.engineNo = oReturn.发动机号码 ? oReturn.发动机号码.words || '未识别' : '未识别'
        this.ocrData.vehicle.registerDate = oReturn.注册日期 ? oReturn.注册日期.words || '未识别' : '未识别'
        this.ocrData.vehicle.issueDate = oReturn.发证日期 ? oReturn.发证日期.words || '未识别' : '未识别'
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '拍照'
        this.jectData.showJect = false
        this.saveIssue(this.ocrData)
      } catch (err) {
        this.ocrData.vehicleMain = null
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '拍照'
        console.log(`上传行驶证印章页异常${err}`)
        $Toast({
          type: 'error',
          duration: 5,
          content: `${err}`
        })
      }
    },
    async toVehicleSub() {
      let that = this
      try {
        let idReturn = await this.chooseImage('行驶证条码页')
        this.ocrData.vehicleSub = idReturn
        this.jectData.btnLoading = true
        this.jectData.btnTitle = '上传中...'
        let upReturn = await this.toUpload(idReturn, '5')
        console.log('返回的照片id: ' + upReturn.id)
        this.ocrData.vehicle.vehicleImgDupId = upReturn.id
        let oReturn = await this.toOCRVehicleSub(idReturn)
        console.log('toOCRVehicleSub: ' + JSON.stringify(oReturn))
        this.ocrData.vehicle.splateNo = oReturn.号牌号码 ? oReturn.号牌号码.words || '未识别' : '未识别'
        this.ocrData.vehicle.approvedCount = oReturn.核定载人数 ? oReturn.核定载人数.words || '未识别' : '未识别'
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '拍照'
        this.jectData.showJect = false
        this.saveIssue(this.ocrData)
      } catch (err) {
        this.ocrData.vehicleSub = null
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '拍照'
        console.log(`上传行驶证条码页异常 ${err}`)
        $Toast({
          type: 'error',
          duration: 5,
          content: `${err}`
        })
      }
    },
    chooseImage(which) {
      return new Promise((resolve, reject) => {
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['camera'],
          success: res => {
            resolve(res.tempFilePaths[0])
          },
          fail: res => {
            reject('请选择照片!')
          }
        })
      })
    },
    toUpload(imgPath, modeType) {
      let that = this
      console.log('imgPath: ' + imgPath, 'modeType: ' + modeType)
      return new Promise((resolve, reject) => {
        if (!this.applyId) {
          reject(`初始化拍照上传失败!`)
        }
        wx.uploadFile({
          url: ocr.upload,
          filePath: imgPath,
          name: 'file',
          formData: {
            applyId: this.applyId,
            userId: this.openid,
            module: modeType, // 1,--证件图片;2,--车辆原图;3,--车辆转换压缩图;4,--行驶证正本;5,--行驶证副本，6,--驾驶证正本;7,--驾驶证副本，8-身份证国徽面，9-other；
            sysChannel: '0'
          },
          success: function (res) {
            const iReturn = JSON.parse(res.data)
            if (iReturn.status === 200 && iReturn.data && iReturn.data.length > 0) {
              let ddata = Object.assign(iReturn.data[0], {'imgPath': imgPath})
              resolve(ddata)
            } else {
              reject('上传失败,未返回结果,请稍后重试!')
            }
          },
          fail: function (res) {
            console.log('上传失败 2')
            reject(`上传失败,请稍后重试 ${JSON.stringify(res)}`)
          }
        })
      })
    },
    toOCRID(tempFilePaths) {
      let that = this
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: ocr.ocrid,
          filePath: tempFilePaths,
          name: 'image',
          success: function (res) {
            const iReturn = JSON.parse(res.data)
            if (iReturn.status === 200 && iReturn.data) {
              resolve(iReturn.data)
            } else {
              that.ocrData.uFront = null
              console.log('识别身份证失败:  ' + iReturn.reasonPhrase)
              reject(`识别身份证失败 ${iReturn.reasonPhrase}`)
            }
          },
          fail: function (res) {
            console.log('识别身份证异常: ' + JSON.stringify(res))
            that.ocrData.uFront = null
            reject(`识别身份证异常,请重新拍照上传 ${JSON.stringify(res)}`)
          }
        })
      })
    },
    toOCRCar(tempFilePaths) {
      let that = this
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: ocr.ocrcar,
          filePath: tempFilePaths,
          name: 'image',
          success: function (res) {
            const cReturn = JSON.parse(res.data)
            if (cReturn.status === 200 && cReturn.data) {
              cReturn.data.color === 'unknown' ? reject(`识别车头照失败 请上传清晰正确的车头照`) : resolve(cReturn.data)
            } else {
              that.ocrData.carHead = null
              console.log('识别车头照失败:  ' + cReturn.reasonPhrase)
              reject(`识别车头照失败 ${cReturn.reasonPhrase}`)
            }
          },
          fail: function (res) {
            that.ocrData.carHead = null
            console.log('识别车头照异常:  ' + JSON.stringify(res))
            reject(`识别车头照异常,请重新拍照上传 ${JSON.stringify(res)}`)
          }
        })
      })
    },
    toOCRVehicle(tempFilePaths) {
      let that = this
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: ocr.ocrvehicle,
          filePath: tempFilePaths,
          name: 'image',
          formData: {
            vehicleLicenseSide: 'front'
          },
          success: function (res) {
            const vReturn = JSON.parse(res.data)
            if (vReturn.status === 200 && vReturn.data) {
              resolve(vReturn.data)
            } else {
              that.ocrData.vehicleMain = null
              console.log('识别行驶证印章页失败:  ' + vReturn.reasonPhrase)
              reject(`识别行驶证印章页失败 ${vReturn.reasonPhrase}`)
            }
          },
          fail: function (res) {
            that.ocrData.vehicleMain = null
            console.log('识别行驶证印章页异常:  ' + JSON.stringify(res))
            reject(`识别行驶证印章页异常,请重新拍照上传 ${JSON.stringify(res)}`)
          }
        })
      })
    },
    toOCRVehicleSub(tempFilePaths) {
      let that = this
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: ocr.ocrvehicle,
          filePath: tempFilePaths,
          name: 'image',
          formData: {
            vehicleLicenseSide: 'back'
          },
          success: function (res) {
            const vReturn = JSON.parse(res.data)
            if (vReturn.status === 200 && vReturn.data) {
              resolve(vReturn.data)
            } else {
              that.ocrData.vehicleSub = null
              console.log('识别行驶证条码页失败:  ' + vReturn.reasonPhrase)
              reject(`识别行驶证条码页失败 ${vReturn.reasonPhrase}`)
            }
          },
          fail: function (res) {
            that.ocrData.vehicleSub = null
            console.log('识别行驶证条码页异常:  ' + JSON.stringify(res))
            reject(`识别行驶证条码页异常,请重新拍照上传 ${JSON.stringify(res)}`)
          }
        })
      })
    },
    toAddress() {
      if (!this.ocrData.uFront) {
        $Toast({
          type: 'warning',
          duration: 5,
          content: '请上传身份证正面照!'
        })
        return false
      }
      if (!this.ocrData.vehicleMain) {
        $Toast({
          type: 'warning',
          duration: 5,
          content: '请上传行驶证印章页照!'
        })
        return false
      }
      if (!this.ocrData.vehicleSub) {
        $Toast({
          type: 'warning',
          duration: 5,
          content: '请上传行驶证条码页照!'
        })
        return false
      }
      if (!this.ocrData.carHead) {
        $Toast({
          type: 'warning',
          duration: 5,
          content: '请上传车头照!'
        })
        return false
      }
      if (this.ocrData.idcard.name === '未识别' || this.ocrData.idcard.idNo === '未识别') {
        $Toast({
          type: 'error',
          duration: 5,
          content: '身份证识别失败或上传的不是正确身份证!'
        })
        return false
      }
      if (this.ocrData.car.carHeadPlateNo === '未识别' || this.ocrData.car.plateNoColor === '未识别') {
        $Toast({
          type: 'error',
          duration: 5,
          content: '车头照识别失败或上传的不是正确车头照!'
        })
        return false
      }
      if (this.ocrData.vehicle.plateNo === '未识别' || this.ocrData.vehicle.vehicleType === '未识别' || this.ocrData.vehicle.owner === '未识别' || this.ocrData.vehicle.useCharacter === '未识别' || this.ocrData.vehicle.model === '未识别' || this.ocrData.vehicle.vin === '未识别' || this.ocrData.vehicle.engineNo === '未识别' || this.ocrData.vehicle.registerDate === '未识别' || this.ocrData.vehicle.issueDate === '未识别' || this.ocrData.vehicle.approvedCount === '未识别') {
        $Toast({
          type: 'error',
          duration: 5,
          content: '行驶证识别失败或上传的不是正确行驶证!'
        })
        console.log('识别的行驶证: ' + JSON.stringify(this.ocrData.vehicle))
        return false
      }
      if (this.ocrData.car.carHeadPlateNo !== this.ocrData.vehicle.plateNo) {
        console.log('车头照 车牌号: ' + this.ocrData.car.carHeadPlateNo)
        console.log('行驶证 车牌号: ' + this.ocrData.vehicle.plateNo)
        $Toast({
          type: 'error',
          duration: 5,
          content: '行驶证车牌号与车头照车牌号不符!'
        })
        return false
      }
      if (this.ocrData.vehicle.plateNo !== this.ocrData.vehicle.splateNo) {
        console.log('行驶证印章页 车牌号: ' + this.ocrData.vehicle.plateNo)
        console.log('行驶证条码页 车牌号: ' + this.ocrData.vehicle.splateNo)
        $Toast({
          type: 'error',
          duration: 5,
          content: '行驶证印章页车牌号与行驶证条码页车牌号不符!'
        })
        return false
      }
      this.saveIssue(this.ocrData)
      wx.navigateTo({
        url: `../issueAddress/main?applyId=${this.applyId}`
      })
    },
    async getApplyId() {
      try {
        let params = {
          userId: this.openid
        }
        let iReturn = await hasOrder(params)
        if (iReturn.status === 200 && iReturn.data) {
          this.applyId = iReturn.data
        } else {
          console.log('初始化拍照上传失败,未返回数据')
          $Toast({
            type: 'error',
            duration: 3,
            content: '初始化拍照上传失败!'
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 3000)
        }
      } catch (err) {
        console.log('初始化拍照上传异常: ' + JSON.stringify(err))
        $Toast({
          type: 'error',
          duration: 3,
          content: '初始化拍照上传异常!'
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 3000)
      }
    },
    ...mapMutations({
      saveIssue: types.SYSTEM_ISSUEDATA
    })
  },
  mounted() {
    this.getApplyId()
    console.log('issueData :    ' + JSON.stringify(this.issueData))
    this.ocrData = this.issueData
  }
}
</script>
<style scoped lang='stylus'>
.upload
  width 100%
  height 100%
  background-color white-color
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  position relative
  .uid
    width 100%
    flex 1
    display flex
    flex-flow column nowrap
    justify-content space-around
    align-items center
    position relative
    .utitle
      width 100%
      height 35px
      font-size 15px
      color main-font
      display flex
      flex-flow row nowrap
      justify-content center
      align-items flex-end
      font-weight 600
    .tphoto
      width 100%
      height 160px
      display flex
      flex-flow row nowrap
      justify-content space-around
      align-items center
      .tpc
        width 45%
        height 90%
        display flex
        flex-flow column nowrap
        justify-content flex-start
        align-items center
        .font
          width 100%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          border-radius 5px
          .pimg
            line-height 100%
            width 50%
            height 50%
            color #999
            font-size 50px
            text-align center
          .ppimg
            line-height 100%
            width 95%
            height 95%
            text-align center
            border-radius 5px
  .ucar
    width 100%
    flex 1
    display flex
    flex-flow column nowrap
    justify-content space-around
    align-items center
    position relative
    .utitle
      width 100%
      height 35px
      font-size 15px
      color main-font
      display flex
      flex-flow row nowrap
      justify-content center
      align-items flex-end
      font-weight 600
    .tphoto
      width 100%
      height 160px
      display flex
      flex-flow row nowrap
      justify-content space-around
      align-items center
      .tpc
        width 45%
        height 90%
        display flex
        flex-flow column nowrap
        justify-content flex-start
        align-items center
        .font
          width 100%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          border-radius 5px
          .pimg
            line-height 100%
            width 50%
            height 50%
            color #999
            font-size 50px
            text-align center
          .ppimg
            line-height 100%
            width 95%
            height 95%
            text-align center
            border-radius 5px
        .back
          width 100%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          .pimg
            line-height 100%
            width 50%
            height 50%
            color #999
            font-size 50px
            text-align center
          .ppimg
            line-height 100%
            width 90%
            height 90%
            text-align center
            border-radius 5px
  .pbutton
    width 100%
    height 90px
    display flex
    flex-flow column nowrap
    justify-content center
    align-items center
    background-color white-color
    position relative
    .bbutton
      width 90%
      height 50px
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      background-color main-color
      font-size 15px
      color white-color
      border-radius 25px
</style>
