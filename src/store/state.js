const state = {
  code: '',
  openid: '', // 登录获取的openid
  balance: '0',
  user: null,
  location: null,
  authenticated: false,
  mobile: '',
  identityId: '',
  signature: '',
  encryptedData: '',
  iv: '',
  sessionKey: '',
  car: [],
  plateNo: '',
  issueData: {
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
    },
    address: {
      tel: '',
      post: '',
      detail: '',
      region: '甘肃省-兰州市-城关区'
    }
  },
  repayment: false,
  repaymenData: {}
}

export default state
