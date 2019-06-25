'use strict'
var iPackageLen,
  _wjUtils = require('./wjUtils.js'),
  _wjUtils2 = _interopRequireDefault(_wjUtils)
function _interopRequireDefault(t) {
  return t && t.__esModule ? t : { default: t }
}
var bleCount,
  rxCount = 0,
  strTemData = '',
  strRxBuffer = '',
  isPagFinish = !0
function decode_GB(t) {
  var e = 0,
    a = {},
    r = _wjUtils2.default.byteArray2hexStr(t)
  _wjUtils2.default.showLog('WJ当前接受包的数据:', r)
  var s = _wjUtils2.default.hexStr2byteArray(r)
  if (
    (s.byteLength > 1 && s[0] == 80 && isPagFinish == 1
      ? ((isPagFinish = !1), (iPackageLen = s[3]), (strTemData = r))
      : (strTemData += r),
    strTemData.length / 2 >= iPackageLen + 5)
  ) {
    ;(rxCount += 1), (isPagFinish = !0)
    var i = _wjUtils2.default.hexStr2byteArray(strTemData)
    _wjUtils2.default.showLog('接受完第', rxCount, '包数据，内容 ', strTemData)
    for (var o = 0; o < iPackageLen + 4; o++) e ^= i[o]
    if (i[strTemData.length / 2 - 1] != e) {
      return (
        _wjUtils2.default.showError('WJ第', rxCount, ' 包校验bcc:Error!'),
        (a.serviceCode = -1),
        (a.serviceInfo = '校验错误。。。'),
        a
      )
    }
    (128 & i[1]) == 128 &&
      ((bleCount = ((127 & i[1]) << 8) + i[2]),
      _wjUtils2.default.showLog('总共:', bleCount, '大包')),
    _wjUtils2.default.showLog('WJ第', rxCount, ' 包校验bcc:ok!'),
    (strRxBuffer += strTemData.substring(8, strTemData.length - 2))
  }
  return (
    bleCount <= rxCount
      ? ((a.serviceCode = 0),
      (a.serviceInfo = '数据接收完成！'),
      (a.serviceData = {}),
      (a.serviceData.strData = strRxBuffer))
      : ((a.serviceCode = 1), (a.serviceInfo = '数据接收中。。。')),
    a
  )
}
function decode_WX(t) {
  var e = 0,
    a = {},
    r = _wjUtils2.default.byteArray2hexStr(t)
  _wjUtils2.default.showLog('WJ当前接受包的数据:', r)
  var s = _wjUtils2.default.hexStr2byteArray(r)
  if (
    (s.byteLength > 1 && s[0] == 254 && s[1] == 1 && isPagFinish == 1
      ? ((isPagFinish = !1),
      (iPackageLen = (255 & s[2]) << 8),
      (iPackageLen += 255 & s[3]),
      (strTemData = r))
      : (strTemData += r),
    strTemData.length / 2 >= iPackageLen)
  ) {
    _wjUtils2.default.showLog('大包长度：', iPackageLen, strTemData.length),
    (isPagFinish = !0),
    (rxCount += 1)
    var i = _wjUtils2.default.hexStr2byteArray(strTemData),
      o = {},
      u = 0,
      n = 0,
      f = 0
    for (
      o.FixHead = {},
      o.FixHead.MagicNumber = strTemData.substr(2 * u, 2),
      u++,
      o.FixHead.Ver = strTemData.substring(2 * u, 2),
      u++,
      o.FixHead.Len = (i[u] << 8) + i[u + 1],
      u += 2,
      o.FixHead.CmdId = (i[u] << 8) + i[u + 1],
      u += 2,
      o.FixHead.Seq = (i[u] << 8) + i[u + 1],
      u += 2,
      o.ProtoBuf = {},
      o.ProtoBuf.BaseRequest = {},
      o.ProtoBuf.BaseRequest.Mark = strTemData.substr(2 * u, 2),
      u++,
      f = n = 0;
      (128 & i[u]) == 128;

    ) { (n += (127 & i[u]) << (7 * f)), u++, f++ }
    for (
      n += (127 & i[u]) << (7 * f),
      u++,
      o.ProtoBuf.BaseRequest.Data = strTemData.substr(2 * u, 2 * n),
      u += n,
      o.ProtoBuf.Data = {},
      o.ProtoBuf.Data.Mark = strTemData.substr(2 * u, 2),
      u++,
      f = n = 0;
      (128 & i[u]) == 128;

    ) { (n += (127 & i[u]) << (7 * f)), u++, f++ }
    for (
      n += (127 & i[u]) << (7 * f),
      u++,
      o.ProtoBuf.Data.Data = strTemData.substr(2 * u, 2 * n),
      u += n,
      o.ProtoBuf.DataType = {},
      o.ProtoBuf.DataType.Mark = strTemData.substr(2 * u, 2),
      u++,
      f = n = 0;
      (128 & i[u]) == 128;

    ) {
      (n += (127 & i[u]) << (7 * f)), u++, f++
    }(n += (127 & i[u]) << (7 * f)), u++, (o.ProtoBuf.DataType.Varint = n)
    for (
      var l = _wjUtils2.default.hexStr2byteArray(o.ProtoBuf.Data.Data), d = 1;
      d < l.byteLength - 1;
      d++
    ) { e ^= l[d] }
    if (l[l.byteLength - 1] != e) {
      return (
        _wjUtils2.default.showError('WJ第', rxCount, ' 包校验bcc:Error!'),
        (a.serviceCode = -1),
        (a.serviceInfo = '校验错误。。。'),
        a
      )
    }
    (128 & l[2]) == 128 &&
      ((bleCount = 1 + (127 & l[2])),
      _wjUtils2.default.showLog('总共:', bleCount, '大包')),
    (strRxBuffer += o.ProtoBuf.Data.Data.substr(8, 2 * l[3])),
    _wjUtils2.default.showLog('WJ第', rxCount, ' 包校验bcc:ok!'),
    _wjUtils2.default.showLog(
      '接受完第',
      rxCount,
      '大包数据，内容 ',
      strTemData
    )
  }
  return (
    bleCount <= rxCount
      ? ((a.serviceCode = 0),
      (a.serviceInfo = '数据接收完成！'),
      (a.serviceData = {}),
      (a.serviceData.strData = strRxBuffer))
      : ((a.serviceCode = 1), (a.serviceInfo = '数据接收中。。。')),
    a
  )
}
function init() {
  ;(rxCount = iPackageLen = 0), (isPagFinish = !(strRxBuffer = strTemData = ''))
}
module.exports = { decode_GB: decode_GB, decode_WX: decode_WX, init: init }
