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
  _wjUtils = require('./wjUtils.js'),
  _wjUtils2 = _interopRequireDefault(_wjUtils),
  _wjService = require('./wjService.js'),
  _wjService2 = _interopRequireDefault(_wjService),
  _wjDataInteract = require('./wjDataInteract.js'),
  _wjDataInteract2 = _interopRequireDefault(_wjDataInteract),
  _wjDataAnalysis = require('./wjDataAnalysis.js'),
  _wjDataAnalysis2 = _interopRequireDefault(_wjDataAnalysis),
  _wjDataEncode = require('./wjDataEncode.js'),
  _wjDataEncode2 = _interopRequireDefault(_wjDataEncode)
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e }
}
var TAG_FUNCTION = 'function'
function connectDevice(t) {
  _wjService2.default.reallyScanConnect(function(e) {
    ;(void 0 === t ? 'undefined' : _typeof(t)) == TAG_FUNCTION && t(e)
  })
}
function connectDevice2(e, t) {
  var a = {}
  _wjService2.default.reallyConnect(e, function(e) {
    ;(a = e), (void 0 === t ? 'undefined' : _typeof(t)) == TAG_FUNCTION && t(a)
  })
}
function disConnectDevice(t) {
  var a = {}
  _wjService2.default.reallyDisConnect(function(e) {
    ;(a = e), (void 0 === t ? 'undefined' : _typeof(t)) == TAG_FUNCTION && t(a)
  })
}
function getDeviceInfo(e, t) {
  var a,
    n = {},
    i = '',
    o = _wjUtils2.default.getCMD_TYPE()
  o == 0 ? (i = '810100' + e) : o == 1 && (i = 'A501' + e),
  (a = _wjDataEncode2.default.encode(i)),
  _wjDataInteract2.default._StartSendData(a.serviceData.dataEncode, function(
    e
  ) {
    ;(n =
        e.serviceCode == 0
          ? (_wjUtils2.default.showLog('获取设备信息成功'),
          _wjDataAnalysis2.default.analysisDeviceInfo(e.serviceData.dataBuff))
          : e),
    (void 0 === t ? 'undefined' : _typeof(t)) == TAG_FUNCTION && t(n)
  })
}
function initIC(t) {
  var e,
    a = {},
    n = '',
    i = _wjUtils2.default.getCMD_TYPE()
  i == 0 ? (n = '80') : i == 1 && (n = 'A2'),
  (e = _wjDataEncode2.default.encode(n)),
  _wjDataInteract2.default._StartSendData(e.serviceData.dataEncode, function(
    e
  ) {
    ;(a =
        e.serviceCode == 0
          ? _wjDataAnalysis2.default.analysisinitIC(e.serviceData.dataBuff)
          : e),
    (void 0 === t ? 'undefined' : _typeof(t)) == TAG_FUNCTION && t(a)
  })
}
function selectDir(a, e, n) {
  var i = {}
  if ((a.length == 4 && e == '10') || e == '20') {
    var t = '010700A4000002' + a,
      o = e,
      d = ''
    _wjUtils2.default.getTRANSFER_TYPE() == 1 &&
      (t = _wjUtils2.default.TPDU2APDU(t))
    var f = _wjUtils2.default.getCMD_TYPE()
    f == 0 ? (d = '82') : f == 1 && (d = 'A3'),
    this.transCommandPlain(t, o, d, function(e) {
      if (e.serviceCode == 0) {
        var t = _wjDataAnalysis2.default._analysisIs9000(
          e.serviceData.dataBuff
        )
          ;(i = e),
        t.serviceCode == 0 &&
              (_wjUtils2.default.showLog('进 ' + a + ' 目录成功'),
              (i.serviceInfo = '进' + a + '目录成功')),
        (void 0 === n ? 'undefined' : _typeof(n)) == TAG_FUNCTION && n(i)
      } else (i = e), (void 0 === n ? 'undefined' : _typeof(n)) == TAG_FUNCTION && n(i)
    })
  } else {
    ;(i.serviceCode = -1),
    (i.serviceInfo = '参数长度有误'),
    (void 0 === n ? 'undefined' : _typeof(n)) == TAG_FUNCTION && n(i)
  }
}
function getCardInfo(t) {
  var a = {},
    e = '010500B095002B0205805C000204',
    n = '',
    i = ''
  _wjUtils2.default.getTRANSFER_TYPE() == 1 &&
    (e = _wjUtils2.default.TPDU2APDU(e))
  var o = _wjUtils2.default.getCMD_TYPE()
  o == 0 ? ((n = '10'), (i = '82')) : o == 1 && ((n = '00'), (i = 'A3')),
  this.transCommandPlain(e, n, i, function(e) {
    ;(a =
        e.serviceCode == 0
          ? (_wjUtils2.default.showLog('获取卡片信息成功'),
          _wjDataAnalysis2.default.analysisCardInfo(e.serviceData.dataBuff))
          : e),
    (void 0 === t ? 'undefined' : _typeof(t)) == TAG_FUNCTION && t(a)
  })
}
function getRand(e, t) {
  var a = {},
    n = '01050084000004',
    i = e,
    o = ''
  _wjUtils2.default.getTRANSFER_TYPE() == 1 &&
    (n = _wjUtils2.default.TPDU2APDU(n))
  var d = _wjUtils2.default.getCMD_TYPE()
  d == 0 ? (o = '82') : d == 1 && (o = 'A3'),
  this.transCommandPlain(n, i, o, function(e) {
    ;(a =
        e.serviceCode == 0
          ? (_wjUtils2.default.showLog('获取IC随机数成功'),
          _wjDataAnalysis2.default.analysisGetRand(e.serviceData.dataBuff))
          : e),
    (void 0 === t ? 'undefined' : _typeof(t)) == TAG_FUNCTION && t(a)
  })
}
function getObuSysInfo(t) {
  var a = {},
    e = '010500B081001B',
    n = '',
    i = ''
  _wjUtils2.default.getTRANSFER_TYPE() == 1 &&
    (e = _wjUtils2.default.TPDU2APDU(e))
  var o = _wjUtils2.default.getCMD_TYPE()
  o == 0 ? ((n = '20'), (i = '82')) : o == 1 && ((n = '00'), (i = 'A0')),
  this.transCommandPlain(e, n, i, function(e) {
    ;(a =
        e.serviceCode == 0
          ? (_wjUtils2.default.showLog('获取系统信息成功'),
          _wjDataAnalysis2.default.analysisgetObuSysInfo(
            e.serviceData.dataBuff
          ))
          : e),
    (void 0 === t ? 'undefined' : _typeof(t)) == TAG_FUNCTION && t(a)
  })
}
function writeObuIssue(e, a) {
  var n = {}
  if (e != null && e.length == 20) {
    var t = '010A' + e,
      i = '',
      o = ''
    _wjUtils2.default.getTRANSFER_TYPE() == 1 &&
      (t = _wjUtils2.default.TPDU2APDU(t))
    var d = _wjUtils2.default.getCMD_TYPE()
    d == 0 ? ((i = '20'), (o = '82')) : d == 1 && ((i = '00'), (o = 'A0')),
    this.transCommandPlain(t, i, o, function(e) {
      if (e.serviceCode == 0) {
        var t = _wjDataAnalysis2.default._analysisIs9000(
          e.serviceData.dataBuff
        )
          ;(n = e),
        t.serviceCode == 0 &&
              (_wjUtils2.default.showLog('OBU激活成功'),
              (n.serviceInfo = 'OBU激活成功')),
        (void 0 === a ? 'undefined' : _typeof(a)) == TAG_FUNCTION && a(n)
      } else (n = e), (void 0 === a ? 'undefined' : _typeof(a)) == TAG_FUNCTION && a(n)
    })
  } else {
    ;(n.serviceCode = -1),
    (n.serviceInfo = '激活参数错误'),
    (void 0 === a ? 'undefined' : _typeof(a)) == TAG_FUNCTION && a(n)
  }
}
function transCommandPlain(e, t, a, n) {
  var i = {}
  if (t == '10' || t == '20' || t == '30' || t == '00') {
    var o
    ;(o = _wjDataEncode2.default.encode(e, t, a)),
    _wjDataInteract2.default._StartSendData(
      o.serviceData.dataEncode,
      function(e) {
        ;(i = (e.serviceCode == 0 &&
            _wjUtils2.default.showLog('APDU透传指令成功'),
        e)),
        (void 0 === n ? 'undefined' : _typeof(n)) == TAG_FUNCTION && n(i)
      }
    )
  } else {
    ;(i.serviceCode = -1),
    (i.serviceInfo = 'command参数错误！'),
    (void 0 === n ? 'undefined' : _typeof(n)) == TAG_FUNCTION && n(i)
  }
}
module.exports = {
  connectDevice: connectDevice,
  connectDevice2: connectDevice2,
  disConnectDevice: disConnectDevice,
  getDeviceInfo: getDeviceInfo,
  getCardInfo: getCardInfo,
  getObuSysInfo: getObuSysInfo,
  writeObuIssue: writeObuIssue,
  transCommandPlain: transCommandPlain,
  selectDir: selectDir,
  getRand: getRand,
  initIC: initIC
}
