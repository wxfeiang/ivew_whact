export function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('-')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}
export function debounce(func, delay) {
  let timer
  return function() {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this)
    }, delay)
  }
}

/**
 *
 * @param min 最小值
 * @param max 最大值
 * @returns {string} 带一位小数的随机数
 */
export function getRandomDecimal(min, max) {
  return (min + (max - min) * Math.random()).toFixed(1)
}

/**
 *
 * @param min 最小值
 * @param max 最大值
 * @returns {Number} 整数随机数
 */
export function getRandomNum(min, max) {
  return parseInt(min + (max - min) * Math.random())
}

// 将位置转换为地址
export function reverseGeocoder(qqmapsdk, { latitude, longitude }) {
  return new Promise((resolve, reject) => {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: res => resolve(res),
      fail: res => reject(res)
    })
  })
}

/**
 * @param num 传入一个数
 * @returns {boolean} 是小数返回true
 */
export function isDecimalNum(num) {
  return String(num).indexOf('.') !== -1
}

/**
 * @param date 传入一个date
 * @returns {var} 返回时间毫秒的字符串
 */
export function formatTimeStr(e) {
  let year = e.getFullYear()
  let month = e.getMonth() + 1
  let day = e.getDate()
  let hour = e.getHours()
  let minute = e.getMinutes()
  let second = e.getSeconds()
  return (
    [year, month, day].map(formatNumber).join('') +
    [hour, minute, second].map(formatNumber).join('')
  )
}

/**
 * @param min 传入一个最小数
 * @param max 传入一个最大数
 * @returns {var} 返回随机整数
 */
export function randFourNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

/**
 * @param str 传入一个字符串
 * @param num 传入一个截取长度
 * @returns {var} 返回截取后的字符串
 */
export function spliceCardNumber(str, num) {
  if (str == null || str === undefined) return null
  if (!/^[0-9]*[1-9][0-9]*$/.test(num)) return null
  var array = []
  var len = str.length
  for (var i = 0; i < len / num; i++) {
    if ((i + 1) * num > len) {
      array.push(str.substring(i * num, len))
    } else {
      array.push(str.substring(i * num, (i + 1) * num))
    }
  }
  return array
}

/**
 * 加法
 * @param arg1
 * @param arg2
 * @returns
 */
export function accAdd(arg1, arg2) {
  let r1, r2, m
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}

function IDCheckCode(val) {
  var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
  var code = val.substring(17)
  if (p.test(val)) {
    var sum = 0
    for (var i = 0; i < 17; i++) {
      sum += val[i] * factor[i]
    }
    // console.log('1：' + parity[sum % 11])
    // console.log('2：' + code.toUpperCase())
    if (Number(parity[sum % 11]) === Number(code.toUpperCase())) {
      return true
    }
  }
  return false
}

function IDCheckDate(val) {
  var pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/
  if (pattern.test(val)) {
    var year = val.substring(0, 4)
    var month = val.substring(4, 6)
    var date = val.substring(6, 8)
    var date2 = new Date(year + '-' + month + '-' + date)
    // console.log('date2' + date2)
    if (date2 && date2.getMonth() === parseInt(month) - 1) {
      // console.log('checkdata')
      return true
    }
  }
  return false
}

function IDCheckProv(val) {
  var pattern = /^[1-9][0-9]/
  var provs = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门'
  }
  if (pattern.test(val)) {
    if (provs[val]) {
      return true
    }
  }
  return false
}

export function checkID(val) {
  if (IDCheckCode(val)) {
    var date = val.substring(6, 14)
    if (IDCheckDate(date)) {
      if (IDCheckProv(val.substring(0, 2))) {
        return true
      }
    }
  }
  return false
}

export function hexCharCodeToStr(hexCharCodeStr) {
  var trimedStr = hexCharCodeStr.trim()
  var rawStr =
    trimedStr.substr(0, 2).toLowerCase() === '0x'
      ? trimedStr.substr(2)
      : trimedStr
  var len = rawStr.length
  if (len % 2 !== 0) {
    return ''
  }
  var curCharCode
  var resultStr = []
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16)
    resultStr.push(String.fromCharCode(curCharCode))
  }
  return resultStr.join('')
}
