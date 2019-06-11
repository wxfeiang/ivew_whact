<template>
  <div class="upload">
    <div class="uid">
      <span class="utitle">身份证照片</span>
      <div class="tphoto">
        <div class="tpc">
          <div class="font" @click="jectModel('idFront')">
            <i class="icon iconfont icon-xiangji pimg" v-if="!photoData.uFront"></i>
            <image :src="photoData.uFront" mode="aspecFill" class="ppimg" v-else/>
          </div>
          <span class="tptitle">头像面</span>
        </div>
        <div class="tpc">
          <div class="back" @click="jectModel('idBack')">
            <i class="icon iconfont icon-xiangji pimg" v-if="!photoData.uBack"></i>
            <image :src="photoData.uBack" class="ppimg" v-else/>
          </div>
          <span class="tptitle">国徽面</span>
        </div>
      </div>
    </div>
    <div class="ucar">
      <span class="utitle">行驶证</span>
      <div class="tphoto">
        <div class="tpc">
          <div class="font" @click="jectModel('vehicleLicenseMain')">
            <i class="icon iconfont icon-xiangji pimg" v-if="!photoData.vehicleMain"></i>
            <image :src="photoData.vehicleMain" class="ppimg" v-else/>
          </div>
          <span class="tptitle">行驶证印章页</span>
        </div>
        <div class="tpc">
          <div class="back" @click="jectModel('vehicleLicenseSub')">
            <i class="icon iconfont icon-xiangji pimg" v-if="!photoData.vehicleSub"></i>
            <image :src="photoData.vehicleSub" class="ppimg" v-else/>
          </div>
          <span class="tptitle">行驶证条码页</span>
        </div>
      </div>
      <span class="utitle">驾驶证及车头照片</span>
      <div class="tphoto">
        <div class="tpc">
          <div class="font" @click="jectModel('drivingLicenseMain')">
            <i class="icon iconfont icon-xiangji pimg" v-if="!photoData.driveMain"></i>
            <image :src="photoData.driveMain" class="ppimg" v-else/>
          </div>
          <span class="tptitle">驾驶证印章页</span>
        </div>
        <div class="tpc">
          <div class="back" @click="jectModel('drivingLicenseSub')">
            <i class="icon iconfont icon-xiangji pimg" v-if="!photoData.driveSub"></i>
            <image :src="photoData.driveSub" class="ppimg" v-else/>
          </div>
          <span class="tptitle">驾驶证条码页</span>
        </div>
      </div>
      <div class="tphoto">
        <div class="tpc">
          <div class="font" @click="jectModel('carHead')">
            <i class="icon iconfont icon-xiangji pimg" v-if="!photoData.carHead"></i>
            <image :src="photoData.carHead" class="ppimg" v-else/>
          </div>
          <span class="tptitle">45°车头露牌照</span>
        </div>
      </div>
    </div>
    <div class="pbutton">
      <button class="bbutton" @click="toAddress()" :disabled="btnDisabled">下一步</button>
    </div>
    <upload v-model="jectData.showJect" :content="jectData.whichImg" :setLoading="jectData.btnLoading" :setTitle="jectData.btnTitle" :type="jectData.whichType" @cancel="clickJectCancel" @confirm="clickJectConfirm"></upload>
    <i-toast id="toast"/>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import { goodsPhotoUpload } from '@/api/goods'
import { mapState, mapMutations } from 'vuex'
import * as types from '@/store/mutation-types'
import upload from '@/components/upload.vue'
import ocr from '@/api/ocr'
const sysChannel = {
  idFront: '身份证头像面',
  idBack: '身份证国徽面',
  drivingLicenseMain: '驾驶证印章页',
  drivingLicenseSub: '驾驶证条码页',
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
        btnTitle: '上传'
      },
      photoData: {
        uFront: null,
        uBack: null,
        vehicleMain: null,
        vehicleSub: null,
        driveMain: null,
        driveSub: null,
        carHead: null
      },
      ocrData: {
        idCard: {
          name: '',
          idNo: ''
        },
        driving: {
          licenseNo: ''
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
          approvedCount: ''
        },
        car: {
          carHeadPlateNo: '',
          plateNoColor: ''
        }
      }
    }
  },
  computed: {
    ...mapState(['openid', 'mobile'])
  },
  methods: {
    jectModel(data) {
      this.jectData.showJect = true
      if (data === 'idFront') {
        this.jectData.whichImg = '/static/images/zj1.png'
      }
      if (data === 'idBack') {
        this.jectData.whichImg = '/static/images/zj2.png'
      }
      if (data === 'drivingLicenseMain') {
        this.jectData.whichImg = '/static/images/zj6.png'
      }
      if (data === 'drivingLicenseSub') {
        this.jectData.whichImg = '/static/images/zj4.png'
      }
      if (data === 'vehicleLicenseMain') {
        this.jectData.whichImg = '/static/images/zj3.png'
      }
      if (data === 'vehicleLicenseSub') {
        this.jectData.whichImg = '/static/images/zj4.png'
      }
      if (data === 'carHead') {
        this.jectData.whichImg = '/static/images/zj5.png'
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
      if (type === 'idBack') {
        this.toBack()
      }
      if (type === 'drivingLicenseMain') {
        this.toDriveMain()
      }
      if (type === 'drivingLicenseSub') {
        this.toDriveSub()
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
        this.photoData.uFront = idReturn
        this.jectData.btnLoading = true
        this.jectData.btnTitle = '上传中...'
        let upReturn = await this.toUpload(idReturn, '1')
        // this.ocrData.idCard.frontData = upReturn
        console.log('idReturn:  ' + JSON.stringify(idReturn))
        let oReturn = await this.toOCRID(idReturn)
        console.log('toOCRID: ' + JSON.stringify(oReturn))
        this.ocrData.idCard.name = oReturn.姓名.words || '未识别'
        this.ocrData.idCard.idNo = oReturn.公民身份号码.words || '未识别'
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '上传'
        this.jectData.showJect = false
      } catch (err) {
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '上传'
        this.photoData.uFront = null
        console.log(`上传身份证头像面异常 ${err}`)
        $Toast({
          type: 'error',
          duration: 5,
          content: `${err}`
        })
      }
    },
    async toBack() {
      let that = this
      try {
        let idReturn = await this.chooseImage('身份证国徽面')
        this.photoData.uBack = idReturn
        this.jectData.btnLoading = true
        this.jectData.btnTitle = '上传中...'
        let upReturn = await this.toUpload(idReturn, '8')
        console.log('toUpload: ' + JSON.stringify(upReturn))
        // this.ocrData.idCard.backData = upReturn
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '上传'
        this.jectData.showJect = false
      } catch (err) {
        this.photoData.uBack = null
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '上传'
        console.log(`上传身份证国徽面异常${err}`)
        $Toast({
          type: 'error',
          duration: 5,
          content: `${err}`
        })
      }
    },
    async toDriveMain() {
      let that = this
      try {
        let idReturn = await this.chooseImage('驾驶证印章页')
        this.photoData.driveMain = idReturn
        this.jectData.btnLoading = true
        this.jectData.btnTitle = '上传中...'
        let upReturn = await this.toUpload(idReturn, '6')
        console.log('toUpload: ' + JSON.stringify(upReturn))
        // this.ocrData.driving.frontData = upReturn
        let oReturn = await this.toOCRDriving(upReturn.imgPath)
        console.log('toOCRDriving: ' + JSON.stringify(oReturn))
        this.ocrData.driving.licenseNo = oReturn.证号.words || '未识别'
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '上传'
        this.jectData.showJect = false
      } catch (err) {
        this.photoData.driveMain = null
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '上传'
        console.log(`上传驾驶证印章页异常${err}`)
        $Toast({
          type: 'error',
          duration: 5,
          content: `${err}`
        })
      }
    },
    async toDriveSub() {
      let that = this
      try {
        let idReturn = await this.chooseImage('驾驶证条码页')
        this.photoData.driveSub = idReturn
        this.jectData.btnLoading = true
        this.jectData.btnTitle = '上传中...'
        let upReturn = await this.toUpload(idReturn, '7')
        console.log('toUpload: ' + JSON.stringify(upReturn))
        // this.ocrData.driving.backData = upReturn
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '上传'
        this.jectData.showJect = false
      } catch (err) {
        this.photoData.driveSub = null
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '上传'
        console.log(`上传驾驶证条码页异常${err}`)
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
        this.photoData.carHead = idReturn
        this.jectData.btnLoading = true
        this.jectData.btnTitle = '上传中...'
        let upReturn = await this.toUpload(idReturn, '2')
        console.log('toUpload: ' + JSON.stringify(upReturn))
        // this.ocrData.car.frontData = upReturn
        let oReturn = await this.toOCRCar(upReturn.imgPath)
        console.log('toOCRCar: ' + JSON.stringify(oReturn))
        this.ocrData.car.carHeadPlateNo = oReturn.number || '未识别'
        this.ocrData.car.plateNoColor = oReturn.color || '未识别'
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '上传'
        this.jectData.showJect = false
      } catch (err) {
        this.photoData.carHead = null
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '上传'
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
        this.photoData.vehicleMain = idReturn
        this.jectData.btnLoading = true
        this.jectData.btnTitle = '上传中...'
        let upReturn = await this.toUpload(idReturn, '4')
        console.log('toUpload: ' + JSON.stringify(upReturn))
        // this.ocrData.vehicle.frontData = upReturn
        let oReturn = await this.toOCRVehicle(upReturn.imgPath)
        console.log('toOCRVehicle: ' + JSON.stringify(oReturn))
        this.ocrData.vehicle.plateNo = oReturn.号牌号码.words || '未识别'
        this.ocrData.vehicle.vehicleType = oReturn.车辆类型.words || '未识别'
        this.ocrData.vehicle.owner = oReturn.所有人.words || '未识别'
        this.ocrData.vehicle.address = oReturn.住址.words || '未识别'
        this.ocrData.vehicle.useCharacter = oReturn.使用性质.words || '未识别'
        this.ocrData.vehicle.model = oReturn.品牌型号.words || '未识别'
        this.ocrData.vehicle.vin = oReturn.车辆识别代号.words || '未识别'
        this.ocrData.vehicle.engineNo = oReturn.发动机号码.words || '未识别'
        this.ocrData.vehicle.registerDate = oReturn.注册日期.words || '未识别'
        this.ocrData.vehicle.issueDate = oReturn.发证日期.words || '未识别'
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '上传'
        this.jectData.showJect = false
      } catch (err) {
        this.photoData.vehicleMain = null
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '上传'
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
        this.photoData.vehicleSub = idReturn
        this.jectData.btnLoading = true
        this.jectData.btnTitle = '上传中...'
        let upReturn = await this.toUpload(idReturn, '5')
        console.log('toUpload: ' + JSON.stringify(upReturn))
        // this.ocrData.vehicle.backData = upReturn
        let oReturn = await this.toOCRVehicleSub(upReturn.imgPath)
        console.log('toOCRVehicleSub: ' + JSON.stringify(oReturn))
        this.ocrData.vehicle.approvedCount = oReturn.核定载人数.words || '未识别'
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '上传'
        this.jectData.showJect = false
      } catch (err) {
        this.photoData.vehicleSub = null
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '上传'
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
          sourceType: ['album', 'camera'],
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
        wx.uploadFile({
          url: ocr.upload,
          filePath: imgPath,
          name: 'file',
          formData: {
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
              that.photoData.uFront = null
              console.log('iReturn.:  ' + iReturn.reasonPhrase)
              reject(`识别身份证失败 ${iReturn.reasonPhrase}`)
            }
          },
          fail: function (res) {
            console.log('识别失败' + JSON.stringify(res))
            that.photoData.uFront = null
            reject(`识别身份证异常,请重新拍照上传 ${res}`)
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
              resolve(cReturn.data)
            } else {
              that.photoData.carHead = null
              reject(`识别车头照失败 ${cReturn.reasonPhrase}`)
            }
          },
          fail: function (res) {
            that.photoData.carHead = null
            reject(`识别车头照异常,请重新拍照上传 ${res}`)
          }
        })
      })
    },
    toOCRDriving(tempFilePaths) {
      let that = this
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: ocr.ocrdriving,
          filePath: tempFilePaths,
          name: 'image',
          success: function (res) {
            const dReturn = JSON.parse(res.data)
            if (dReturn.status === 200 && dReturn.data) {
              resolve(dReturn.data)
            } else {
              that.photoData.driveMain = null
              reject(`识别驾驶证失败 ${dReturn.reasonPhrase}`)
            }
          },
          fail: function (res) {
            that.photoData.driveMain = null
            reject(`识别驾驶证异常,请重新拍照上传 ${res}`)
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
              that.photoData.vehicleMain = null
              reject(`识别行驶证印章页失败 ${vReturn.reasonPhrase}`)
            }
          },
          fail: function (res) {
            that.photoData.vehicleMain = null
            reject(`识别行驶证印章页异常,请重新拍照上传 ${res}`)
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
            console.log('vehicleSub:   ' + JSON.stringify(vReturn))
            if (vReturn.status === 200 && vReturn.data) {
              resolve(vReturn.data)
            } else {
              that.photoData.vehicleSub = null
              reject(`识别行驶证条码页失败 ${vReturn.reasonPhrase}`)
            }
          },
          fail: function (res) {
            that.photoData.vehicleSub = null
            reject(`识别行驶证条码页异常,请重新拍照上传 ${res}`)
          }
        })
      })
    },
    toAddress() {
      if (!this.photoData.uFront) {
        $Toast({
          type: 'warning',
          duration: 5,
          content: '请上传身份证正面照!'
        })
        return false
      }
      if (!this.photoData.uBack) {
        $Toast({
          type: 'warning',
          duration: 5,
          content: '请上传身份证反面照!'
        })
        return false
      }
      if (!this.photoData.vehicleMain) {
        $Toast({
          type: 'warning',
          duration: 5,
          content: '请上传行驶证印章页照!'
        })
        return false
      }
      if (!this.photoData.vehicleSub) {
        $Toast({
          type: 'warning',
          duration: 5,
          content: '请上传行驶证条码页照!'
        })
        return false
      }
      if (!this.photoData.driveMain) {
        $Toast({
          type: 'warning',
          duration: 5,
          content: '请上传驾驶证印章页照!'
        })
        return false
      }
      if (!this.photoData.driveSub) {
        $Toast({
          type: 'warning',
          duration: 5,
          content: '请上传驾驶证条码页照!'
        })
        return false
      }
      if (!this.photoData.carHead) {
        $Toast({
          type: 'warning',
          duration: 5,
          content: '请上传车头照!'
        })
        return false
      }
      if (this.ocrData.idCard.name === '未识别' || this.ocrData.idCard.idNo === '未识别') {
        $Toast({
          type: 'error',
          duration: 5,
          content: '身份证识别失败或上传的不是正确身份证!'
        })
        return false
      }
      if (this.ocrData.driving.licenseNo === '未识别') {
        $Toast({
          type: 'error',
          duration: 5,
          content: '驾驶证识别失败或上传的不是正确驾驶证!'
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
      if (this.ocrData.vehicle.plateNo === '未识别' || this.ocrData.vehicle.vehicleType === '未识别' || this.ocrData.vehicle.owner === '未识别' || this.ocrData.vehicle.address === '未识别' || this.ocrData.vehicle.useCharacter === '未识别' || this.ocrData.vehicle.model === '未识别' || this.ocrData.vehicle.vin === '未识别' || this.ocrData.vehicle.engineNo === '未识别' || this.ocrData.vehicle.registerDate === '未识别' || this.ocrData.vehicle.issueDate === '未识别' || this.ocrData.vehicle.approvedCount === '未识别') {
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
        console.log('行驶证 车牌号' + this.ocrData.vehicle.plateNo)
        $Toast({
          type: 'error',
          duration: 5,
          content: '行驶证车牌号与车头照车牌号不符!'
        })
        return false
      }
      if (this.ocrData.driving.licenseNo !== this.ocrData.idCard.idNo) {
        console.log('身份证 身份证号: ', this.ocrData.idCard.idNo)
        console.log('驾驶证 身份证号: ', this.ocrData.driving.licenseNo)
        $Toast({
          type: 'error',
          duration: 5,
          content: '驾驶证证号与身份证号码不符!'
        })
        return false
      }
      this.saveOCR(this.ocrData)
      wx.navigateTo({
        url: `../issueAddress/main`
      })
    },
    ...mapMutations({
      saveOCR: types.SYSTEM_OCRDATA
    })
  }
}
</script>
<style scoped lang='stylus'>
.upload
  width 100%
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
      height 50px
      font-size 15px
      color main-font
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
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
        .tptitle
          width 100%
          height 30px
          font-size 13px
          color title-font
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
        .font
          width 100%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          border 1px bg-color dashed
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
        .back
          width 100%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          border 1px bg-color dashed
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
      height 50px
      font-size 15px
      color main-font
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
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
        .tptitle
          width 100%
          height 30px
          font-size 13px
          color title-font
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
        .font
          width 100%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          border 1px bg-color dashed
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
        .back
          width 100%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content center
          align-items center
          border 1px bg-color dashed
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
