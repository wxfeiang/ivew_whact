'use strict'
var _typeof =
    typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
      ? function(e) {
        return typeof e
      }
      : function(e) {
        return e &&
            typeof Symbol === 'function' &&
            e.constructor === Symbol &&
            e !== Symbol.prototype
          ? 'symbol'
          : typeof e
      },
  _wjService = require('./wjService.js'),
  _wjService2 = _interopRequireDefault(_wjService),
  _wjUtils = require('./wjUtils.js'),
  _wjUtils2 = _interopRequireDefault(_wjUtils),
  _wjDataDecode = require('./wjDataDecode.js'),
  _wjDataDecode2 = _interopRequireDefault(_wjDataDecode)
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e }
}
var TAG_FUNCTION = 'function',
  sendCallback = void 0,
  TimerID = null
function _StartSendData(o, e) {
  var s = {},
    u = 0,
    c = 0
  TimerID != null && (clearTimeout(TimerID), (TimerID = null)),
  _wjDataDecode2.default.init(),
  (TimerID = setTimeout(pro_timeout, 1e4)),
  _wjUtils2.default.showLog(TimerID, '开启时钟'),
  (sendCallback = e),
  _wjService2.default._SetDataListenerCallBack(!0, datacallback),
  (function t() {
    var e = ''
    40 * c >= o[u].length && (u++, (c = 0))
    u < o.length &&
        (e =
          o[u].length >= 40 * (c + 1)
            ? o[u].substring(40 * c, 40 * (c + 1))
            : o[u].substring(40 * c, o[u].length))
    if (e == '') _wjUtils2.default.showLog('数据发送完毕！')
    else {
      for (
        var a = _wjUtils2.default.hexStr2byteArray(e),
          l = new ArrayBuffer(a.byteLength),
          r = new DataView(l),
          i = 0;
        i < a.byteLength;
        i++
      ) { r.setUint8(i, a[i]) }
      _wjUtils2.default.showLog('发送数据：', e),
      _wjService2.default._writeBLECharacteristicValue(l, function(e) {
        e.serviceCode == 0
          ? (c++, t())
          : (_wjUtils2.default.showError(TimerID, '数据发送失败，取消时钟'),
          TimerID != null && (clearTimeout(TimerID), (TimerID = null)),
          _wjService2.default._SetDataListenerCallBack(!1),
          (s.serviceCode = -2),
          (s.serviceInfo = '数据发送失败'),
          (void 0 === sendCallback
            ? 'undefined'
            : _typeof(sendCallback)) == TAG_FUNCTION && sendCallback(s))
      })
    }
  })()
}
function datacallback(e) {
  _wjService2.default._SetDataListenerCallBack(!0, datacallback),
  _ReceiveData(e)
}
function pro_timeout() {
  var e = {}
  _wjUtils2.default.showError(TimerID, '数据接收超时，取消时钟'),
  TimerID != null && (clearTimeout(TimerID), (TimerID = null)),
  _wjService2.default._SetDataListenerCallBack(!1),
  (e.serviceCode = -3),
  (e.serviceInfo = '数据接收超时'),
  (void 0 === sendCallback ? 'undefined' : _typeof(sendCallback)) ==
      TAG_FUNCTION && sendCallback(e)
}
function _ReceiveData(e) {
  var t,
    a,
    l = {},
    r = _wjUtils2.default.getProtocolType()
  r == 0
    ? (t = _wjDataDecode2.default.decode_GB(e))
    : r == 1 && (t = _wjDataDecode2.default.decode_WX(e)),
  t.serviceCode == 0 &&
      ((a = PackageDecode(t.serviceData.strData)) != null
        ? (_wjUtils2.default.showLog(TimerID, '接收数据成功，取消时钟'),
        TimerID != null && (clearTimeout(TimerID), (TimerID = null)),
        _wjService2.default._SetDataListenerCallBack(!1),
        (l.serviceCode = 0),
        (l.serviceInfo = '数据接收成功'),
        (l.serviceData = {}),
        (l.serviceData.dataBuff = a))
        : (_wjUtils2.default.showError(TimerID, '数据解析失败，取消时钟'),
        TimerID != null && (clearTimeout(TimerID), (TimerID = null)),
        _wjService2.default._SetDataListenerCallBack(!1),
        (l.serviceCode = -1),
        (l.serviceInfo = '数据解析失败')),
      (void 0 === sendCallback ? 'undefined' : _typeof(sendCallback)) ==
        TAG_FUNCTION && sendCallback(l))
}
function PackageDecode(e) {
  var t,
    a = _wjUtils2.default.getDATA_TYPE(),
    l = _wjUtils2.default.hexStr2byteArray(e),
    r = 0,
    i = l[1],
    o = l[0]
  if ((_wjUtils2.default.showLog('WJPackageDecode：', e), i != 0)) { return _wjUtils2.default.showError('WJ结果码非00'), null }
  switch (o) {
    case 146:
    case 176:
    case 179:
    case 180:
      if (a == 0) {
        var s = 7
        l[5] == 129 &&
          (l[6] == 129
            ? ((r = 255 & l[7]), (s += 1))
            : l[6] == 130
              ? ((r = l[7] << 8), (r += 255 & l[8]), (s += 2))
              : (r = 255 & l[6])),
        (t = l.slice(s, r + s)),
        (c = _wjUtils2.default.byteArray2hexStr(t))
      } else {
        a == 1 &&
          ((t = l.slice(5)),
          (c = _wjUtils2.default.APDU2TPDU(
            _wjUtils2.default.byteArray2hexStr(t)
          )))
      }
      return (
        _wjUtils2.default.showLog('WJ有效数据长度：', c.length / 2, c),
        _wjUtils2.default.showLog('操作类型ok', o),
        c
      )
    case 145:
    case 148:
    case 144:
      var u = (255 & l[3]) << 8
      ;(u += l[2]), (t = l.slice(4, u + 4))
      var c = _wjUtils2.default.byteArray2hexStr(t)
      return (
        _wjUtils2.default.showLog(
          'WJ有效数据长度：',
          u,
          _wjUtils2.default.byteArray2hexStr(t)
        ),
        _wjUtils2.default.showLog('操作类型ok', o),
        c
      )
    case 181:
      u = l[2]
      return (
        (t = l.slice(3, u + 3)),
        _wjUtils2.default.showLog(
          'WJ有效数据长度：',
          u,
          _wjUtils2.default.byteArray2hexStr(t)
        ),
        _wjUtils2.default.showLog('操作类型ok', o),
        _wjUtils2.default.byteArray2hexStr(t)
      )
    default:
      return _wjUtils2.default.showError('WJ通道类型有误'), null
  }
}
module.exports = { _StartSendData: _StartSendData, _ReceiveData: _ReceiveData }
