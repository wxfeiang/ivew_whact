'use strict'
var _wjUtils = require('./wjUtils.js'),
  _wjUtils2 = _interopRequireDefault(_wjUtils)
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e }
}
function encode(e, t, a) {
  var r = _wjUtils2.default.getProtocolType(),
    n = getETCData(e, t, a),
    s = {}
  return r == 0 ? (s = encode_GB(n)) : r == 1 && (s = encode_WX(n)), s
}
function getETCData(e, t, a) {
  var r = ''
  return (
    (r =
      a == 'A0' || a == 'A3' || a == 'A4' || a == '82'
        ? a + t + (r = getCommand(e))
        : e),
    _wjUtils2.default.showLog('组拼ETCData完毕：', r.length / 2, r),
    r
  )
}
function getCommand(e) {
  var t = e,
    a = _wjUtils2.default.getDATA_TYPE(),
    r = e.length / 2,
    n = new ArrayBuffer(10),
    s = new DataView(n)
  if (a == 0) {
    (i =
      r > 256
        ? (s.setInt8(0, (4 + r) & 255),
        s.setInt8(1, ((4 + r) >> 8) & 255),
        s.setInt8(2, 128),
        s.setInt8(3, 130),
        s.setInt8(4, (r >> 8) & 255),
        s.setInt8(5, 255 & r),
        n.slice(0, 6))
        : r > 128 && r <= 256
          ? (s.setInt8(0, (3 + r) & 255),
          s.setInt8(1, ((3 + r) >> 8) & 255),
          s.setInt8(2, 128),
          s.setInt8(3, 129),
          s.setInt8(4, r),
          n.slice(0, 5))
          : (s.setInt8(0, (2 + r) & 255),
          s.setInt8(1, ((2 + r) >> 8) & 255),
          s.setInt8(2, 128),
          s.setInt8(3, r),
          n.slice(0, 4))),
    (t = _wjUtils2.default.byteArray2hexStr(i) + t)
  } else if (a == 1) {
    var i
    s.setInt8(0, 255 & r),
    s.setInt8(1, (r >> 8) & 255),
    (i = n.slice(0, 2)),
    (t = _wjUtils2.default.byteArray2hexStr(i) + t)
  }
  return t
}
function encode_GB(e) {
  var t = {},
    a = _wjUtils2.default.getPagLenMax(),
    r = parseInt(e.length / 2 / a)
  ;(e.length / 2) % a != 0 && (r += 1)
  var n = new ArrayBuffer(10)
  new DataView(n)
  ;(t.serviceCode = 0),
  (t.serviceInfo = 'encode ok'),
  (t.serviceData = {}),
  (t.serviceData.dataEncode = new Array())
  for (var s = 0; s < r - 1; s++) {
    (t.serviceData.dataEncode[s] = e.substr(s * a * 2, 2 * a)),
    (t.serviceData.dataEncode[s] = getGBFrame(
      t.serviceData.dataEncode[s],
      s,
      r
    ))
  }
  return (
    (t.serviceData.dataEncode[r - 1] = e.substring((r - 1) * a * 2)),
    (t.serviceData.dataEncode[r - 1] = getGBFrame(
      t.serviceData.dataEncode[r - 1],
      r - 1,
      r
    )),
    t
  )
}
function encode_WX(e) {
  var t = {},
    a = _wjUtils2.default.getPagLenMax(),
    r = parseInt(e.length / 2 / a)
  ;(e.length / 2) % a != 0 && (r += 1),
  (t.serviceCode = 0),
  (t.serviceInfo = 'encode ok'),
  (t.serviceData = {}),
  (t.serviceData.dataEncode = new Array())
  var n = 0
  for (n = 0; n < r - 1; n++) {
    (t.serviceData.dataEncode[n] = e.substr(n * a * 2, 2 * a)),
    (t.serviceData.dataEncode[n] = getWXFrame(
      t.serviceData.dataEncode[n],
      n,
      r
    ))
  }
  return (
    (t.serviceData.dataEncode[r - 1] = e.substring((r - 1) * a * 2)),
    (t.serviceData.dataEncode[r - 1] = getWXFrame(
      t.serviceData.dataEncode[r - 1],
      r - 1,
      r
    )),
    t
  )
}
function getWXFrame(e, t, a) {
  var r = e,
    n = new ArrayBuffer(10),
    s = new DataView(n),
    i = '',
    l = '',
    d = 0,
    u = e.length / 2
  t == 0
    ? s.setInt8(0, 128 + ((a - 1 - t) & 255))
    : s.setInt8(0, (a - 1 - t) & 255),
  (r =
      '3301' +
      (i = _wjUtils2.default.byteArray2hexStr(n).substring(0, 2)) +
      _wjUtils2.default.byte2hexStr(255 & u) +
      r)
  for (var c = _wjUtils2.default.hexStr2byteArray(r), o = 1; o < c.length; o++) { d ^= c[o] }
  r += _wjUtils2.default.byte2hexStr(d)
  var f = _wjUtils2.default.hexStr2byteArray(r).length
  if (f > 127) {
    s.setInt8(0, 128 + ((f % 128) & 255)),
    s.setInt8(1, (f / 128) & 255),
    (i = _wjUtils2.default.byteArray2hexStr(n).substring(0, 4))
    var w = f + 8 + 4 + 3
    s.setInt8(0, (w >> 8) & 255),
    s.setInt8(1, 255 & w),
    (l = _wjUtils2.default.byteArray2hexStr(n).substring(0, 4))
  } else {
    s.setInt8(0, 255 & f),
    (i = _wjUtils2.default.byteArray2hexStr(n).substring(0, 2))
    w = f + 8 + 4 + 2
    s.setInt8(0, (w >> 8) & 255),
    s.setInt8(1, 255 & w),
    (l = _wjUtils2.default.byteArray2hexStr(n).substring(0, 4))
  }
  return (r = 'FE01' + l + '753100000A0012' + i + r + '1800')
}
function getGBFrame(e, t, a) {
  var r = e,
    n = new ArrayBuffer(10),
    s = new DataView(n),
    i = 0,
    l = e.length / 2
  t == 0
    ? (s.setInt8(0, 128 + ((a >> 8) & 255)), s.setInt8(1, 255 & a))
    : (s.setInt8(0, ((t + 1) >> 8) & 255), s.setInt8(1, (t + 1) & 255)),
  s.setInt8(2, 255 & l),
  (r = '50' + _wjUtils2.default.byteArray2hexStr(n).substring(0, 6) + r)
  for (var d = _wjUtils2.default.hexStr2byteArray(r), u = 0; u < d.length; u++) { i ^= d[u] }
  return (r += _wjUtils2.default.byte2hexStr(i))
}
module.exports = { encode: encode }
