<template>
  <div class="supply">
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
    </div>
    <div class="goods">
      <div class="gtitle">收货信息</div>
      <!-- <div class="awx">
        <div class="awxb">
          <button class="awxbutton" @click="toAddress()">使用微信地址</button>
        </div>
        <span class="awxtitle">提示: 请确认微信地址和车主信息一致，以确保设备邮寄地址正确!</span>
      </div> -->
      <div class="acontent">
        <div class="item">
          <div class="left">车主姓名</div>
          <div class="right">
            <input
              class="ninput"
              v-model="uAd.userName"
              type="text"
              disabled="true"
              maxlength="10"
              placeholder="请输入车主姓名"
            >
          </div>
        </div>
        <div class="splice"></div>
        <div class="item">
          <div class="left">身份证号</div>
          <div class="right">
            <input
              class="ninput"
              v-model="uAd.idNumber"
              type="text"
              disabled="true"
              maxlength="18"
              placeholder="请输入身份证号"
            >
          </div>
        </div>
        <div class="splice"></div>
        <div class="item">
          <div class="left">车牌号码</div>
          <div class="right">
            <input
              class="ninput"
              v-model="uAd.plateNo"
              disabled="true"
              type="text"
              mode="wrapped"
              maxlength="10"
              placeholder="请输入车牌号码"
            >
          </div>
        </div>
        <div class="splice"></div>
        <div class="item">
          <div class="left">联系电话</div>
          <div class="right">
            <input
              class="ninput"
              v-model="uAd.mobile"
              type="number"
              mode="wrapped"
              maxlength="11"
              placeholder="请输入联系电话"
            >
          </div>
        </div>
        <div class="splice"></div>
        <div class="item">
          <div class="left">邮政编码</div>
          <div class="right">
            <input
              class="ninput"
              v-model="uAd.pCode"
              type="number"
              mode="wrapped"
              maxlength="6"
              placeholder="请输入邮政编码"
            >
          </div>
        </div>
        <div class="splice"></div>
        <div class="item">
          <div class="left">选择地区</div>
          <div class="right">
            <picker class="placeholder" mode="multiSelector"
            @change="changeCitysChange"
            @columnchange="changeCitysChangeColumn" :value="citysIndex" :range="cityArray">
              <div class="picker">{{uAd.regionSelect}}</div>
            </picker>
          </div>
        </div>
        <div class="splice"></div>
        <div class="item">
          <div class="left">详细地址</div>
          <div class="right">
            <input
              class="ninput"
              v-model="uAd.address"
              type="text"
              mode="wrapped"
              maxlength="50"
              placeholder="请输入详细地址"
            >
          </div>
        </div>
      </div>
    </div>
    <div class="pbutton">
      <button class="bbutton" @click="comfirmInfo()">提交订单</button>
    </div>
    <upload v-model="jectData.showJect" :content="jectData.whichImg" :setLoading="jectData.btnLoading" :setTitle="jectData.btnTitle" :type="jectData.whichType" @cancel="clickJectCancel" @confirm="clickJectConfirm"></upload>
    <i-toast id="toast"/>
    <i-modal title="重新提单成功" :visible="showMask"  :show-cancel="showCancel" @ok="clickConfirm">
      <view>{{mContent}}</view>
    </i-modal>
  </div>
</template>

<script>
import { $Toast } from '@/utils/iview'
import { goodsPhotoUpload, supplyOCR, supplyPhoto, reSupply } from '@/api/goods'
import { mapState } from 'vuex'
import upload from '@/components/upload.vue'
import ocr from '@/api/ocr'
const sysChannel = {
  idFront: '身份证头像面',
  vehicleLicenseMain: '行驶证印章页',
  vehicleLicenseSub: '行驶证条码页',
  carHead: '车头照'
}
const allData = [
  {
    'code': '620000',
    'sheng': '62',
    'di': '00',
    'xian': '00',
    'name': '甘肃省',
    'level': 1
  },
  {
    'code': '620100',
    'sheng': '62',
    'di': '01',
    'xian': '00',
    'name': '兰州市',
    'level': 2
  },
  {
    'code': '620102',
    'sheng': '62',
    'di': '01',
    'xian': '02',
    'name': '城关区',
    'level': 3
  },
  {
    'code': '620103',
    'sheng': '62',
    'di': '01',
    'xian': '03',
    'name': '七里河区',
    'level': 3
  },
  {
    'code': '620104',
    'sheng': '62',
    'di': '01',
    'xian': '04',
    'name': '西固区',
    'level': 3
  },
  {
    'code': '620105',
    'sheng': '62',
    'di': '01',
    'xian': '05',
    'name': '安宁区',
    'level': 3
  },
  {
    'code': '620111',
    'sheng': '62',
    'di': '01',
    'xian': '11',
    'name': '红古区',
    'level': 3
  },
  {
    'code': '620121',
    'sheng': '62',
    'di': '01',
    'xian': '21',
    'name': '永登县',
    'level': 3
  },
  {
    'code': '620122',
    'sheng': '62',
    'di': '01',
    'xian': '22',
    'name': '皋兰县',
    'level': 3
  },
  {
    'code': '620123',
    'sheng': '62',
    'di': '01',
    'xian': '23',
    'name': '榆中县',
    'level': 3
  },
  {
    'code': '620200',
    'sheng': '62',
    'di': '02',
    'xian': '00',
    'name': '嘉峪关市',
    'level': 2
  },
  {
    'code': '620201',
    'sheng': '62',
    'di': '02',
    'xian': '01',
    'name': '市辖区',
    'level': 3
  },
  {
    'code': '620300',
    'sheng': '62',
    'di': '03',
    'xian': '00',
    'name': '金昌市',
    'level': 2
  },
  {
    'code': '620302',
    'sheng': '62',
    'di': '03',
    'xian': '02',
    'name': '金川区',
    'level': 3
  },
  {
    'code': '620321',
    'sheng': '62',
    'di': '03',
    'xian': '21',
    'name': '永昌县',
    'level': 3
  },
  {
    'code': '620400',
    'sheng': '62',
    'di': '04',
    'xian': '00',
    'name': '白银市',
    'level': 2
  },
  {
    'code': '620402',
    'sheng': '62',
    'di': '04',
    'xian': '02',
    'name': '白银区',
    'level': 3
  },
  {
    'code': '620403',
    'sheng': '62',
    'di': '04',
    'xian': '03',
    'name': '平川区',
    'level': 3
  },
  {
    'code': '620421',
    'sheng': '62',
    'di': '04',
    'xian': '21',
    'name': '靖远县',
    'level': 3
  },
  {
    'code': '620422',
    'sheng': '62',
    'di': '04',
    'xian': '22',
    'name': '会宁县',
    'level': 3
  },
  {
    'code': '620423',
    'sheng': '62',
    'di': '04',
    'xian': '23',
    'name': '景泰县',
    'level': 3
  },
  {
    'code': '620500',
    'sheng': '62',
    'di': '05',
    'xian': '00',
    'name': '天水市',
    'level': 2
  },
  {
    'code': '620502',
    'sheng': '62',
    'di': '05',
    'xian': '02',
    'name': '秦州区',
    'level': 3
  },
  {
    'code': '620503',
    'sheng': '62',
    'di': '05',
    'xian': '03',
    'name': '麦积区',
    'level': 3
  },
  {
    'code': '620521',
    'sheng': '62',
    'di': '05',
    'xian': '21',
    'name': '清水县',
    'level': 3
  },
  {
    'code': '620522',
    'sheng': '62',
    'di': '05',
    'xian': '22',
    'name': '秦安县',
    'level': 3
  },
  {
    'code': '620523',
    'sheng': '62',
    'di': '05',
    'xian': '23',
    'name': '甘谷县',
    'level': 3
  },
  {
    'code': '620524',
    'sheng': '62',
    'di': '05',
    'xian': '24',
    'name': '武山县',
    'level': 3
  },
  {
    'code': '620525',
    'sheng': '62',
    'di': '05',
    'xian': '25',
    'name': '张家川回族自治县',
    'level': 3
  },
  {
    'code': '620600',
    'sheng': '62',
    'di': '06',
    'xian': '00',
    'name': '武威市',
    'level': 2
  },
  {
    'code': '620602',
    'sheng': '62',
    'di': '06',
    'xian': '02',
    'name': '凉州区',
    'level': 3
  },
  {
    'code': '620621',
    'sheng': '62',
    'di': '06',
    'xian': '21',
    'name': '民勤县',
    'level': 3
  },
  {
    'code': '620622',
    'sheng': '62',
    'di': '06',
    'xian': '22',
    'name': '古浪县',
    'level': 3
  },
  {
    'code': '620623',
    'sheng': '62',
    'di': '06',
    'xian': '23',
    'name': '天祝藏族自治县',
    'level': 3
  },
  {
    'code': '620700',
    'sheng': '62',
    'di': '07',
    'xian': '00',
    'name': '张掖市',
    'level': 2
  },
  {
    'code': '620702',
    'sheng': '62',
    'di': '07',
    'xian': '02',
    'name': '甘州区',
    'level': 3
  },
  {
    'code': '620721',
    'sheng': '62',
    'di': '07',
    'xian': '21',
    'name': '肃南裕固族自治县',
    'level': 3
  },
  {
    'code': '620722',
    'sheng': '62',
    'di': '07',
    'xian': '22',
    'name': '民乐县',
    'level': 3
  },
  {
    'code': '620723',
    'sheng': '62',
    'di': '07',
    'xian': '23',
    'name': '临泽县',
    'level': 3
  },
  {
    'code': '620724',
    'sheng': '62',
    'di': '07',
    'xian': '24',
    'name': '高台县',
    'level': 3
  },
  {
    'code': '620725',
    'sheng': '62',
    'di': '07',
    'xian': '25',
    'name': '山丹县',
    'level': 3
  },
  {
    'code': '620800',
    'sheng': '62',
    'di': '08',
    'xian': '00',
    'name': '平凉市',
    'level': 2
  },
  {
    'code': '620802',
    'sheng': '62',
    'di': '08',
    'xian': '02',
    'name': '崆峒区',
    'level': 3
  },
  {
    'code': '620821',
    'sheng': '62',
    'di': '08',
    'xian': '21',
    'name': '泾川县',
    'level': 3
  },
  {
    'code': '620822',
    'sheng': '62',
    'di': '08',
    'xian': '22',
    'name': '灵台县',
    'level': 3
  },
  {
    'code': '620823',
    'sheng': '62',
    'di': '08',
    'xian': '23',
    'name': '崇信县',
    'level': 3
  },
  {
    'code': '620824',
    'sheng': '62',
    'di': '08',
    'xian': '24',
    'name': '华亭县',
    'level': 3
  },
  {
    'code': '620825',
    'sheng': '62',
    'di': '08',
    'xian': '25',
    'name': '庄浪县',
    'level': 3
  },
  {
    'code': '620826',
    'sheng': '62',
    'di': '08',
    'xian': '26',
    'name': '静宁县',
    'level': 3
  },
  {
    'code': '620900',
    'sheng': '62',
    'di': '09',
    'xian': '00',
    'name': '酒泉市',
    'level': 2
  },
  {
    'code': '620902',
    'sheng': '62',
    'di': '09',
    'xian': '02',
    'name': '肃州区',
    'level': 3
  },
  {
    'code': '620921',
    'sheng': '62',
    'di': '09',
    'xian': '21',
    'name': '金塔县',
    'level': 3
  },
  {
    'code': '620922',
    'sheng': '62',
    'di': '09',
    'xian': '22',
    'name': '瓜州县',
    'level': 3
  },
  {
    'code': '620923',
    'sheng': '62',
    'di': '09',
    'xian': '23',
    'name': '肃北蒙古族自治县',
    'level': 3
  },
  {
    'code': '620924',
    'sheng': '62',
    'di': '09',
    'xian': '24',
    'name': '阿克塞哈萨克族自治县',
    'level': 3
  },
  {
    'code': '620981',
    'sheng': '62',
    'di': '09',
    'xian': '81',
    'name': '玉门市',
    'level': 3
  },
  {
    'code': '620982',
    'sheng': '62',
    'di': '09',
    'xian': '82',
    'name': '敦煌市',
    'level': 3
  },
  {
    'code': '621000',
    'sheng': '62',
    'di': '10',
    'xian': '00',
    'name': '庆阳市',
    'level': 2
  },
  {
    'code': '621002',
    'sheng': '62',
    'di': '10',
    'xian': '02',
    'name': '西峰区',
    'level': 3
  },
  {
    'code': '621021',
    'sheng': '62',
    'di': '10',
    'xian': '21',
    'name': '庆城县',
    'level': 3
  },
  {
    'code': '621022',
    'sheng': '62',
    'di': '10',
    'xian': '22',
    'name': '环县',
    'level': 3
  },
  {
    'code': '621023',
    'sheng': '62',
    'di': '10',
    'xian': '23',
    'name': '华池县',
    'level': 3
  },
  {
    'code': '621024',
    'sheng': '62',
    'di': '10',
    'xian': '24',
    'name': '合水县',
    'level': 3
  },
  {
    'code': '621025',
    'sheng': '62',
    'di': '10',
    'xian': '25',
    'name': '正宁县',
    'level': 3
  },
  {
    'code': '621026',
    'sheng': '62',
    'di': '10',
    'xian': '26',
    'name': '宁县',
    'level': 3
  },
  {
    'code': '621027',
    'sheng': '62',
    'di': '10',
    'xian': '27',
    'name': '镇原县',
    'level': 3
  },
  {
    'code': '621100',
    'sheng': '62',
    'di': '11',
    'xian': '00',
    'name': '定西市',
    'level': 2
  },
  {
    'code': '621102',
    'sheng': '62',
    'di': '11',
    'xian': '02',
    'name': '安定区',
    'level': 3
  },
  {
    'code': '621121',
    'sheng': '62',
    'di': '11',
    'xian': '21',
    'name': '通渭县',
    'level': 3
  },
  {
    'code': '621122',
    'sheng': '62',
    'di': '11',
    'xian': '22',
    'name': '陇西县',
    'level': 3
  },
  {
    'code': '621123',
    'sheng': '62',
    'di': '11',
    'xian': '23',
    'name': '渭源县',
    'level': 3
  },
  {
    'code': '621124',
    'sheng': '62',
    'di': '11',
    'xian': '24',
    'name': '临洮县',
    'level': 3
  },
  {
    'code': '621125',
    'sheng': '62',
    'di': '11',
    'xian': '25',
    'name': '漳县',
    'level': 3
  },
  {
    'code': '621126',
    'sheng': '62',
    'di': '11',
    'xian': '26',
    'name': '岷县',
    'level': 3
  },
  {
    'code': '621200',
    'sheng': '62',
    'di': '12',
    'xian': '00',
    'name': '陇南市',
    'level': 2
  },
  {
    'code': '621202',
    'sheng': '62',
    'di': '12',
    'xian': '02',
    'name': '武都区',
    'level': 3
  },
  {
    'code': '621221',
    'sheng': '62',
    'di': '12',
    'xian': '21',
    'name': '成县',
    'level': 3
  },
  {
    'code': '621222',
    'sheng': '62',
    'di': '12',
    'xian': '22',
    'name': '文县',
    'level': 3
  },
  {
    'code': '621223',
    'sheng': '62',
    'di': '12',
    'xian': '23',
    'name': '宕昌县',
    'level': 3
  },
  {
    'code': '621224',
    'sheng': '62',
    'di': '12',
    'xian': '24',
    'name': '康县',
    'level': 3
  },
  {
    'code': '621225',
    'sheng': '62',
    'di': '12',
    'xian': '25',
    'name': '西和县',
    'level': 3
  },
  {
    'code': '621226',
    'sheng': '62',
    'di': '12',
    'xian': '26',
    'name': '礼县',
    'level': 3
  },
  {
    'code': '621227',
    'sheng': '62',
    'di': '12',
    'xian': '27',
    'name': '徽县',
    'level': 3
  },
  {
    'code': '621228',
    'sheng': '62',
    'di': '12',
    'xian': '28',
    'name': '两当县',
    'level': 3
  },
  {
    'code': '622900',
    'sheng': '62',
    'di': '29',
    'xian': '00',
    'name': '临夏回族自治州',
    'level': 2
  },
  {
    'code': '622901',
    'sheng': '62',
    'di': '29',
    'xian': '01',
    'name': '临夏市',
    'level': 3
  },
  {
    'code': '622921',
    'sheng': '62',
    'di': '29',
    'xian': '21',
    'name': '临夏县',
    'level': 3
  },
  {
    'code': '622922',
    'sheng': '62',
    'di': '29',
    'xian': '22',
    'name': '康乐县',
    'level': 3
  },
  {
    'code': '622923',
    'sheng': '62',
    'di': '29',
    'xian': '23',
    'name': '永靖县',
    'level': 3
  },
  {
    'code': '622924',
    'sheng': '62',
    'di': '29',
    'xian': '24',
    'name': '广河县',
    'level': 3
  },
  {
    'code': '622925',
    'sheng': '62',
    'di': '29',
    'xian': '25',
    'name': '和政县',
    'level': 3
  },
  {
    'code': '622926',
    'sheng': '62',
    'di': '29',
    'xian': '26',
    'name': '东乡族自治县',
    'level': 3
  },
  {
    'code': '622927',
    'sheng': '62',
    'di': '29',
    'xian': '27',
    'name': '积石山保安族东乡族撒拉族自治县',
    'level': 3
  },
  {
    'code': '623000',
    'sheng': '62',
    'di': '30',
    'xian': '00',
    'name': '甘南藏族自治州',
    'level': 2
  },
  {
    'code': '623001',
    'sheng': '62',
    'di': '30',
    'xian': '01',
    'name': '合作市',
    'level': 3
  },
  {
    'code': '623021',
    'sheng': '62',
    'di': '30',
    'xian': '21',
    'name': '临潭县',
    'level': 3
  },
  {
    'code': '623022',
    'sheng': '62',
    'di': '30',
    'xian': '22',
    'name': '卓尼县',
    'level': 3
  },
  {
    'code': '623023',
    'sheng': '62',
    'di': '30',
    'xian': '23',
    'name': '舟曲县',
    'level': 3
  },
  {
    'code': '623024',
    'sheng': '62',
    'di': '30',
    'xian': '24',
    'name': '迭部县',
    'level': 3
  },
  {
    'code': '623025',
    'sheng': '62',
    'di': '30',
    'xian': '25',
    'name': '玛曲县',
    'level': 3
  },
  {
    'code': '623026',
    'sheng': '62',
    'di': '30',
    'xian': '26',
    'name': '碌曲县',
    'level': 3
  },
  {
    'code': '623027',
    'sheng': '62',
    'di': '30',
    'xian': '27',
    'name': '夏河县',
    'level': 3
  }
]
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
        idCard: {
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
      showMask: false,
      showCancel: false,
      mContent: '',
      citysIndex: [0, 0, 0],
      cityArray: [[], [], []],
      uAd: {
        userName: '',
        idNumber: '',
        plateNo: '',
        mobile: '',
        pCode: '',
        address: '',
        regionSelect: '甘肃省-兰州市-城关区'
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
        this.ocrData.idCard.imageId = upReturn.id
        let oReturn = await this.toOCRID(idReturn)
        console.log('toOCRID: ' + JSON.stringify(oReturn))
        this.ocrData.idCard.name = oReturn.姓名 ? oReturn.姓名.words || '未识别' : '未识别'
        this.ocrData.idCard.idNo = oReturn.公民身份号码 ? oReturn.公民身份号码.words || '未识别' : '未识别'
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '拍照'
        this.jectData.showJect = false
        this.uAd.idNumber = this.ocrData.idCard.idNo
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
        this.uAd.plateNo = this.ocrData.car.carHeadPlateNo
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
        this.uAd.userName = this.ocrData.vehicle.owner
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
        this.ocrData.vehicle.approvedCount = oReturn.核定载人数 ? oReturn.核定载人数.words || '未识别' : '未识别'
        this.ocrData.vehicle.splateNo = oReturn.号牌号码 ? oReturn.号牌号码.words || '未识别' : '未识别'
        this.jectData.btnLoading = false
        this.jectData.btnTitle = '拍照'
        this.jectData.showJect = false
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
              console.log('识别身份证失败.:  ' + iReturn.reasonPhrase)
              reject(`识别身份证失败 ${iReturn.reasonPhrase}`)
            }
          },
          fail: function (res) {
            console.log('识别身份证异常' + JSON.stringify(res))
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
            console.log('vehicleSub:   ' + JSON.stringify(vReturn))
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
    // TODO:  下面是收货信息
    clickConfirm() {
      this.showMask = false
      wx.switchTab({
        url: '../../my/main'
      })
    },
    assignData() {
      for (let i = 0, len = allData.length; i < len; i++) {
        switch (allData[i]['level']) {
          case 1:
            // 第一列
            this.cityArray[0].push(allData[i]['name'])
            break
          case 2:
            // 第二列(默认由第一列第一个关联)
            if (allData[i]['sheng'] === allData[0]['sheng']) {
              this.cityArray[1].push(allData[i]['name'])
            }
            break
          case 3:
            // 第三列(默认第一列第一个、第二列第一个关联)
            if (allData[i]['sheng'] === allData[0]['sheng'] && allData[i]['di'] === allData[1]['di']) {
              this.cityArray[2].push(allData[i]['name'])
            }
            break
        }
      }
    },
    changeCitysChange(e) {
      let that = this
      let cityArray = this.cityArray

      let address = ''
      if (this.ssq === undefined) {
        // 下面方法中没有设置ssq，应该给它默认值 ，此时citysIndex相当于[0,0,0]
        let citysIndex = this.citysIndex
        for (let i in citysIndex) {
          address += cityArray[i][citysIndex[i]]
        }
      } else {
        address = this.ssq
      }
    },
    changeCitysChangeColumn(e) {
      let that = this
      let cityArray = this.cityArray

      let list1 = [] // 存放第二列数据，即市的列
      let list2 = [] // 存放第三列数据，即区的列

      let citysIndex = []
      let sheng = '62'
      let ssq = ''
      // 主要是注意地址文件中的字段关系，省、市、区关联的字段有 sheng、di、level
      switch (e.mp.detail.column) {
        case 0:
        // 滑动左列
          for (let i = 0, len = allData.length; i < len; i++) {
            if (allData[i]['name'] === cityArray[0][e.mp.detail.value]) {
              sheng = allData[i]['sheng']
            }
            if (allData[i]['sheng'] === sheng && allData[i]['level'] === 2) {
              list1.push(allData[i]['name'])
            }
            if (allData[i]['sheng'] === sheng && allData[i]['level'] === 3 && allData[i]['di'] === allData[1]['di']) {
              list2.push(allData[i]['name'])
            }
          }

          citysIndex = [e.mp.detail.value, 0, 0]
          ssq = cityArray[0][e.mp.detail.value] + list1[0] + list2[0] + ''
          break
        case 1:
        // 滑动中列
          let di
          list1 = cityArray[1]
          for (let i = 0, len = allData.length; i < len; i++) {
            if (allData[i]['name'] === cityArray[1][e.mp.detail.value]) {
              di = allData[i]['di']
            }
          }
          for (let i = 0, len = allData.length; i < len; i++) {
            if (allData[i]['sheng'] === sheng && allData[i]['level'] === 3 && allData[i]['di'] === di) {
              list2.push(allData[i]['name'])
            }
          }
          citysIndex = [this.citysIndex[0], e.mp.detail.value, 0]
          ssq = cityArray[0][this.citysIndex[0]] + '-' + list1[e.mp.detail.value] + '-' + list2[0] + ''
          break
        case 2:
        // 滑动右列
          list1 = cityArray[1]
          list2 = cityArray[2]
          citysIndex = [this.citysIndex[0], this.citysIndex[1], e.mp.detail.value]
          ssq = cityArray[0][this.citysIndex[0]] + '-' + list1[this.citysIndex[1]] + '-' + list2[e.mp.detail.value] + ''
          break
      }

      this.cityArray[1] = list1
      this.cityArray[2] = list2
      this.citysIndex = citysIndex
      this.uAd.regionSelect = ssq
    },
    regionChange(e) {
      this.uAd.regionSelect = e.mp.detail.value
      console.log('regionChange: ' + JSON.stringify(this.uAd.regionSelect))
    },
    toAddress() {
      let that = this
      wx.chooseAddress({
        success: function(a) {
          // that.uAd.userName = a.userName
          // that.uAd.mobile = a.telNumber
          that.uAd.address = a.provinceName + '' + a.cityName + '' + a.countyName + '' + a.detailInfo
          // that.uAd.regionSelect = a.provinceName + '-' + a.cityName + '-' + a.countyName
        },
        fail: function() {
          console.log('chooseAddress fail')
        }
      })
    },
    async comfirmInfo() {
      if (!/^[1]([3-9])[0-9]{9}$/.test(this.uAd.mobile.replace(/\s+/g, ''))) {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请输入正确的手机号码!'
        })
        return false
      }
      if (!this.uAd.pCode) {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请输入邮政编码!'
        })
        return false
      }
      if (!this.uAd.address) {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '请输入详细地址!'
        })
        return false
      }
      if (this.uAd.address.length < 8) {
        $Toast({
          type: 'warning',
          duration: 4,
          content: '详细地址不能少于8个字!'
        })
        return false
      }
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
      if (this.ocrData.idCard.name === '未识别' || this.ocrData.idCard.idNo === '未识别') {
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
      wx.showLoading({ title: '提交中', mask: true })
      try {
        const reginSplice = this.uAd.regionSelect.split('-')
        let params = {
          ownerName: this.ocrData.vehicle.owner,
          ownerIdNum: this.ocrData.idCard.idNo, //
          ownerTel: this.uAd.mobile, //
          vehicleId: this.ocrData.car.carHeadPlateNo,
          contact: this.ocrData.idCard.name, //
          vehicleType: this.ocrData.vehicle.vehicleType, // 行驶证车辆类型
          vehicleModel: this.ocrData.vehicle.model, // 行驶证品牌型号
          issueDate: this.ocrData.vehicle.issueDate.length > 8 ? this.ocrData.vehicle.issueDate : this.ocrData.vehicle.issueDate.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3') + ' 00:00:00', // 发证日期
          vin: this.ocrData.vehicle.vin,
          engineNum: this.ocrData.vehicle.engineNo,
          approvedCount: this.ocrData.vehicle.approvedCount.length - 1 > 0 ? this.ocrData.vehicle.approvedCount.substr(0, this.ocrData.vehicle.approvedCount.length - 1) : this.ocrData.vehicle.approvedCount, // 核定载人数
          registerDate: this.ocrData.vehicle.registerDate.length > 8 ? this.ocrData.vehicle.registerDate : this.ocrData.vehicle.registerDate.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3') + ' 00:00:00', // 注册日期
          openid: this.openid,
          userName: this.ocrData.idCard.name,
          userIdNum: this.ocrData.idCard.idNo,
          tel: this.uAd.mobile, // 开户人/指定经办人电号码
          postCode: this.uAd.pCode,
          takeProvince: reginSplice[0],
          takeCity: reginSplice[1],
          takeCountry: reginSplice[2],
          address: this.uAd.address,
          color: this.ocrData.car.plateNoColor === '0' ? 'blue' : 'blue',
          aId: this.applyId,
          carImgId: this.ocrData.car.carImgId,
          vehicleImgOriId: this.ocrData.vehicle.vehicleImgOriId,
          vehicleImgDupId: this.ocrData.vehicle.vehicleImgDupId,
          imageId: this.ocrData.idCard.imageId
        }
        console.log('提交申请的参数: ' + JSON.stringify(params))
        let sReturn = await reSupply(params)
        wx.hideLoading()
        if (sReturn.status === 200 && sReturn.data === 'success') {
          this.showMask = true
          this.mContent = '请到我的页面-我的订单中关注审核流程'
        } else {
          $Toast({
            type: 'error',
            duration: 4,
            content: '提交收货信息失败,未返回结果,请稍后重试!'
          })
        }
      } catch (err) {
        console.log('提交收货信息异常: ' + JSON.stringify(err))
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 4,
          content: `提交收货信息异常 ${err}`
        })
      }
    },
    async getSupplyOCR() {
      wx.showLoading({ title: '加载中', mask: true })
      let params = {
        id: this.applyId
      }
      try {
        let iReturn = await supplyOCR(params)
        if (iReturn.status === 200 && iReturn.data) {
          this.ocrData.idCard.name = iReturn.data.userName
          this.ocrData.idCard.idNo = iReturn.data.ownerIdNum
          this.ocrData.car.carHeadPlateNo = iReturn.data.vehicleId
          this.ocrData.car.plateNoColor = iReturn.data.vehicleColor
          this.ocrData.vehicle.plateNo = iReturn.data.vehicleId
          this.ocrData.vehicle.vehicleType = iReturn.data.vehicleType
          this.ocrData.vehicle.owner = iReturn.data.ownerName
          this.ocrData.vehicle.useCharacter = iReturn.data.usecharacter
          this.ocrData.vehicle.model = iReturn.data.vehicleModel
          this.ocrData.vehicle.vin = iReturn.data.vin
          this.ocrData.vehicle.engineNo = iReturn.data.engineNum
          this.ocrData.vehicle.registerDate = iReturn.data.registerDate
          this.ocrData.vehicle.issueDate = iReturn.data.issueDate
          this.ocrData.vehicle.approvedCount = iReturn.data.approvedCount
          this.ocrData.vehicle.splateNo = iReturn.data.vehicleId
          this.uAd.userName = iReturn.data.ownerName
          this.uAd.idNumber = iReturn.data.ownerIdNum
          this.uAd.plateNo = iReturn.data.vehicleId
          this.uAd.mobile = iReturn.data.tel
          this.uAd.pCode = iReturn.data.postCode
          this.uAd.address = iReturn.data.address
          this.uAd.regionSelect = iReturn.data.takeProvince + '-' + iReturn.data.takeCity + '-' + iReturn.data.takeCountry
          this.ocrData.uFront = `${ocr.rootPath}${iReturn.data.imageId}` || null
          // this.ocrData.uFront = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1560749737039&di=18ace7f767c8fa8a99f3b129f44b7237&imgtype=0&src=http%3A%2F%2Fg.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Fc2cec3fdfc03924590b2a9b58d94a4c27d1e2500.jpg'
          this.ocrData.vehicleMain = `${ocr.rootPath}${iReturn.data.vehicleImgOriId}` || null
          this.ocrData.vehicleSub = `${ocr.rootPath}${iReturn.data.vehicleImgDupId}` || null
          this.ocrData.carHead = `${ocr.rootPath}${iReturn.data.carImgId}` || null
          this.ocrData.idCard.imageId = iReturn.data.imageId
          this.ocrData.vehicle.vehicleImgOriId = iReturn.data.vehicleImgOriId
          this.ocrData.vehicle.vehicleImgDupId = iReturn.data.vehicleImgDupId
          this.ocrData.car.carImgId = iReturn.data.carImgId
        } else {
          $Toast({
            type: 'error',
            duration: 3,
            content: '获取申请单数据失败!'
          })
        }
        wx.hideLoading()
      } catch (err) {
        console.log('获取申请单数据异常: ' + err)
        wx.hideLoading()
        $Toast({
          type: 'error',
          duration: 4,
          content: '获取申请单数据异常!'
        })
      }
    }
  },
  mounted() {
    this.assignData()
    this.applyId = this.$root.$mp.query.applyId
    this.getSupplyOCR()
  }
}
</script>
<style scoped lang='stylus'>
.supply
  width 100%
  background-color white-color
  display flex
  flex-flow column nowrap
  justify-content flex-start
  align-items center
  position relative
  .upload
    width 100%
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
  .goods
    width 100%
    height 400px // 530px
    background-color white-color
    display flex
    flex-flow column nowrap
    justify-content flex-start
    align-items center
    .gtitle
      width 100%
      height 20px
      font-size 15px
      color main-font
      display flex
      flex-flow row nowrap
      justify-content center
      align-items center
      font-weight 600
    .awx
      width 100%
      height 100px
      display flex
      flex-flow column nowrap
      justify-content space-around
      align-items center
      .awxb
        width 100%
        height 70%
        display flex
        flex-flow row nowrap
        justify-content center
        align-items flex-end
        .awxbutton
          width 60%
          height 60%
          border 1px main-color solid
          font-size 15px
          color main-color
          background-color white-color
          border-radius 20px
      .awxtitle
        width 100%
        height 30%
        font-size 11px
        color sub-font
        display flex
        flex-flow row nowrap
        justify-content center
        align-items flex-end
    .acontent
      width 100%
      height 400px
      margin-top 5px
      display flex
      flex-flow column nowrap
      justify-content flex-start
      align-items center
      .item
        width 90%
        height 60px
        display flex
        flex-flow row nowrap
        justify-content space-between
        align-items center
        font-size 15px
        color main-font
        .left
          width 30%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
        .right
          width 70%
          height 100%
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          .ninput
            width 100%
            height 100%
            display flex
            flex-flow row nowrap
            justify-content flex-start
            align-items center
          .picker
            width 100%
            height 100%
            display flex
            flex-flow row nowrap
            justify-content flex-start
            align-items center
            .show
              width 100%
              height 100%
              display flex
              flex-flow row nowrap
              justify-content flex-start
              align-items center
              color #888
      .splice
        width 90%
        height 1px
        background-color bg-color
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
