<template>
  <div class="upload">
    <div class="uid">
      <span class="utitle">身份证照</span>
      <div class="tphoto">
        <div class="tpc">
          <div class="font" @click="jectModel('idFront')">
            <image src="/static/images/sfz.jpg" mode="aspecFill" class="ppimg" v-if="!photoData.uFront"/>
            <image :src="photoData.uFront" mode="aspecFill" class="ppimg" v-else/>
          </div>
        </div>
      </div>
    </div>
    <div class="ucar">
      <span class="utitle">行驶证</span>
      <div class="tphoto">
        <div class="tpc">
          <div class="font" @click="jectModel('vehicleLicenseMain')">
            <image src="/static/images/xsz.jpg" mode="aspecFill" class="ppimg" v-if="!photoData.vehicleMain"/>
            <image :src="photoData.vehicleMain" class="ppimg" v-else/>
          </div>
        </div>
        <div class="tpc">
          <div class="back" @click="jectModel('vehicleLicenseSub')">
            <image src="/static/images/xsz2.jpg" mode="aspecFill" class="ppimg" v-if="!photoData.vehicleSub"/>
            <image :src="photoData.vehicleSub" class="ppimg" v-else/>
          </div>
        </div>
      </div>
      <span class="utitle">驾驶证及车头照片</span>
      <div class="tphoto">
        <div class="tpc">
          <div class="font" @click="jectModel('drivingLicenseMain')">
            <image src="/static/images/jsz.jpg" mode="aspecFill" class="ppimg" v-if="!photoData.driveMain"/>
            <image :src="photoData.driveMain" class="ppimg" v-else/>
          </div>
        </div>
        <div class="tpc">
          <div class="font" @click="jectModel('carHead')">
            <image src="/static/images/ct.jpg" mode="aspecFill" class="ppimg" v-if="!photoData.carHead"/>
            <image :src="photoData.carHead" class="ppimg" v-else/>
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
        btnTitle: '拍照'
      },
      photoData: {
        uFront: null,
        vehicleMain: null,
        vehicleSub: null,
        driveMain: null,
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
      },
      applyId: ''
    }
  },
  computed: {
    ...mapState(['openid', 'mobile'])
  },
  methods: {
    jectModel(data) {
      let that = this
      this.jectData.showJect = true
      if (data === 'idFront') {
        this.jectData.whichImg = '/static/images/zj1.png'
        if (this.photoData.uFront) {
          let preFront = []
          preFront.push(this.photoData.uFront)
          wx.previewImage({
            urls: preFront,
            current: preFront[0]
          })
        }
      }
      if (data === 'drivingLicenseMain') {
        this.jectData.whichImg = '/static/images/zj6.png'
        if (this.photoData.driveMain) {
          let preDriving = []
          preDriving.push(this.photoData.driveMain)
          wx.previewImage({
            urls: preDriving,
            current: preDriving[0]
          })
        }
      }
      if (data === 'vehicleLicenseMain') {
        this.jectData.whichImg = '/static/images/zj3.png'
        if (this.photoData.vehicleMain) {
          let preVehicle = []
          preVehicle.push(this.photoData.vehicleMain)
          wx.previewImage({
            urls: preVehicle,
            current: preVehicle[0]
          })
        }
      }
      if (data === 'vehicleLicenseSub') {
        this.jectData.whichImg = '/static/images/zj4.png'
        if (this.photoData.vehicleSub) {
          let preVehicleSub = []
          preVehicleSub.push(this.photoData.vehicleSub)
          wx.previewImage({
            urls: preVehicleSub,
            current: preVehicleSub[0]
          })
        }
      }
      if (data === 'carHead') {
        this.jectData.whichImg = '/static/images/zj5.png'
        if (this.photoData.carHead) {
          let preCarhead = []
          preCarhead.push(this.photoData.carHead)
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
      if (type === 'drivingLicenseMain') {
        this.toDriveMain()
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
        let oReturn = await this.toOCRID(idReturn)
        console.log('toOCRID: ' + JSON.stringify(oReturn))
        this.ocrData.idCard.name = oReturn.姓名.words || '未识别'
        this.ocrData.idCard.idNo = oReturn.公民身份号码.words || '未识别'
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '拍照'
        this.jectData.showJect = false
      } catch (err) {
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '拍照'
        this.photoData.uFront = null
        console.log(`上传身份证头像面异常 ${err}`)
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
        let oReturn = await this.toOCRDriving(idReturn)
        console.log('toOCRDriving: ' + JSON.stringify(oReturn))
        this.ocrData.driving.licenseNo = oReturn.证号.words || '未识别'
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '拍照'
        this.jectData.showJect = false
      } catch (err) {
        this.photoData.driveMain = null
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '拍照'
        console.log(`上传驾驶证印章页异常${err}`)
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
        let oReturn = await this.toOCRCar(idReturn)
        console.log('toOCRCar: ' + JSON.stringify(oReturn))
        this.ocrData.car.carHeadPlateNo = oReturn.number || '未识别'
        this.ocrData.car.plateNoColor = oReturn.color || '未识别'
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '拍照'
        this.jectData.showJect = false
      } catch (err) {
        this.photoData.carHead = null
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
        this.photoData.vehicleMain = idReturn
        this.jectData.btnLoading = true
        this.jectData.btnTitle = '上传中...'
        let upReturn = await this.toUpload(idReturn, '4')
        let oReturn = await this.toOCRVehicle(idReturn)
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
        this.jectData.btnTitle = '拍照'
        this.jectData.showJect = false
      } catch (err) {
        this.photoData.vehicleMain = null
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
        this.photoData.vehicleSub = idReturn
        this.jectData.btnLoading = true
        this.jectData.btnTitle = '上传中...'
        let upReturn = await this.toUpload(idReturn, '5')
        let oReturn = await this.toOCRVehicleSub(idReturn)
        console.log('toOCRVehicleSub: ' + JSON.stringify(oReturn))
        this.ocrData.vehicle.approvedCount = oReturn.核定载人数.words || '未识别'
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '拍照'
        this.jectData.showJect = false
      } catch (err) {
        this.photoData.vehicleSub = null
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
              that.photoData.uFront = null
              console.log('识别身份证失败:  ' + iReturn.reasonPhrase)
              reject(`识别身份证失败 ${iReturn.reasonPhrase}`)
            }
          },
          fail: function (res) {
            console.log('识别身份证异常: ' + JSON.stringify(res))
            that.photoData.uFront = null
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
              that.photoData.carHead = null
              console.log('识别车头照失败:  ' + cReturn.reasonPhrase)
              reject(`识别车头照失败 ${cReturn.reasonPhrase}`)
            }
          },
          fail: function (res) {
            that.photoData.carHead = null
            console.log('识别车头照异常:  ' + JSON.stringify(res))
            reject(`识别车头照异常,请重新拍照上传 ${JSON.stringify(res)}`)
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
              console.log('识别驾驶证失败:  ' + dReturn.reasonPhrase)
              reject(`识别驾驶证失败 ${dReturn.reasonPhrase}`)
            }
          },
          fail: function (res) {
            that.photoData.driveMain = null
            console.log('识别驾驶证异常:  ' + JSON.stringify(res))
            reject(`识别驾驶证异常,请重新拍照上传 ${JSON.stringify(res)}`)
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
              console.log('识别行驶证印章页失败:  ' + vReturn.reasonPhrase)
              reject(`识别行驶证印章页失败 ${vReturn.reasonPhrase}`)
            }
          },
          fail: function (res) {
            that.photoData.vehicleMain = null
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
              that.photoData.vehicleSub = null
              console.log('识别行驶证条码页失败:  ' + vReturn.reasonPhrase)
              reject(`识别行驶证条码页失败 ${vReturn.reasonPhrase}`)
            }
          },
          fail: function (res) {
            that.photoData.vehicleSub = null
            console.log('识别行驶证条码页异常:  ' + JSON.stringify(res))
            reject(`识别行驶证条码页异常,请重新拍照上传 ${JSON.stringify(res)}`)
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
        }
      } catch (err) {
        console.log('初始化拍照上传异常: ' + JSON.stringify(err))
      }
    },
    ...mapMutations({
      saveOCR: types.SYSTEM_OCRDATA
    })
  },
  mounted() {
    this.getApplyId()
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
