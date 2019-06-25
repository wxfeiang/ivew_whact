'use strict'
var PROTOCOL_TYPE = 0,
  PAGLENMAX = 255,
  TRANSFER_TYPE = 0,
  DATA_TYPE = 0,
  CMD_TYPE = 0
function showLog() {
  if (!(arguments.length < 1)) {
    for (var r = arguments[0], t = 1; t < arguments.length; t++) { r += ' ' + arguments[t] }
    console.log(r)
  }
}
function showError() {
  if (!(arguments.length < 1)) {
    for (var r = arguments[0], t = 1; t < arguments.length; t++) { r += ' ' + arguments[t] }
    console.error(r)
  }
}
function byteArray2hexStr(r) {
  return Array.prototype.map
    .call(new Uint8Array(r), function(r) {
      return ('00' + r.toString(16)).slice(-2)
    })
    .join('')
}
function hexStr2byteArray(r) {
  return new Uint8Array(
    r.match(/[\da-f]{2}/gi).map(function(r) {
      return parseInt(r, 16)
    })
  )
}
function byte2hexStr(r) {
  var t = '0123456789abcdef',
    e = ''
  return (e += t.charAt(r >> 4)), (e += t.charAt(15 & r))
}
function getProtocolType() {
  return PROTOCOL_TYPE
}
function getPagLenMax() {
  return PAGLENMAX
}
function getTRANSFER_TYPE() {
  return TRANSFER_TYPE
}
function getDATA_TYPE() {
  return DATA_TYPE
}
function getCMD_TYPE() {
  return CMD_TYPE
}
function APDU2TPDU(r) {
  var t = hexStr2byteArray(r),
    e = ''
  if (r.substring(0, 2) == '01') e = r
  else {
    for (var n = new Array(), o = 0, a = 0; a < t[0]; a++) {
      var h = o + 2,
        T = o + 2 + t[o + 1]
      ;(o += 1 + t[o + 1]), (n[a] = r.substring(2 * h, 2 * T))
    }
    for (a = 0; a < t[0]; a++) {
      var A = n[a].length / 2
      e += byte2hexStr((a + 1) & 255) + byte2hexStr(255 & A) + n[a]
    }
  }
  return e
}
function TPDU2APDU(r) {
  for (
    var t = hexStr2byteArray(r),
      e = '',
      n = new Array(),
      o = 0,
      a = t.byteLength;
    o < a;

  ) {
    var h = t[o++],
      T = t[o++]
    ;(n[h - 1] = r.substring(2 * o, 2 * (o + T))), (o += T)
  }
  e = byte2hexStr(255 & n.length)
  for (var A = 0; A < n.length; A++) { e += byte2hexStr((n[A].length / 2) & 255) + n[A] }
  return e
}
function hexCharCodeToStr(r) {
  var t,
    e = r.trim(),
    n = e.substr(0, 2).toLowerCase() === '0x' ? e.substr(2) : e,
    o = n.length
  if (o % 2 != 0) return ''
  for (var a = [], h = 0; h < o; h += 2) { (t = parseInt(n.substr(h, 2), 16)), a.push(String.fromCharCode(t)) }
  return a.join('')
}
module.exports = {
  showLog: showLog,
  byteArray2hexStr: byteArray2hexStr,
  hexStr2byteArray: hexStr2byteArray,
  showError: showError,
  byte2hexStr: byte2hexStr,
  getProtocolType: getProtocolType,
  getPagLenMax: getPagLenMax,
  getTRANSFER_TYPE: getTRANSFER_TYPE,
  getDATA_TYPE: getDATA_TYPE,
  getCMD_TYPE: getCMD_TYPE,
  APDU2TPDU: APDU2TPDU,
  TPDU2APDU: TPDU2APDU,
  hexCharCodeToStr: hexCharCodeToStr
}
