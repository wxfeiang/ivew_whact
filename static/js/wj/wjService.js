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
  _wjUtils2 = _interopRequireDefault(_wjUtils)
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e }
}
var ListenFlag = void 0,
  DataListenerCallBack = void 0,
  connectedDeviceId = '',
  foundDevices = [],
  TAG_FUNCTION = 'function',
  services = '0000FEE7-0000-1000-8000-00805F9B34FB',
  notifyServiceId = '0000FEC8-0000-1000-8000-00805F9B34FB',
  writeServiceId = '0000FEC7-0000-1000-8000-00805F9B34FB'
function reallyScanConnect(s) {
  wx.closeBluetoothAdapter(),
  _wjUtils2.default.showLog(
    '/***********Runing :: Do reallyScanConnect() begin *************/'
  ),
  (foundDevices = []),
  wx.openBluetoothAdapter({
    success: function(e) {
      wx.startBluetoothDevicesDiscovery({
        services: [],
        success: function(e) {
          wx.onBluetoothDeviceFound(function(e) {
            for (var i = 0; i < e.devices.length; i++) {
              for (var c = !1, t = 0; t < foundDevices.length; t++) {
                if (e.devices[i].deviceId == foundDevices[t].deviceId) {
                  c = !0
                  break
                }
              }
              if (
                (_wjUtils2.default.showLog(
                  'connectedDeviceName',
                  e.devices[i].name
                ),
                c == 0)
              ) {
                foundDevices.push(e.devices[i])
                var n = e.devices[i].name
                if (
                  n.indexOf('WJ') != -1 ||
                    n.indexOf('WanJi') != -1 ||
                    n.indexOf('Wanji') != -1
                ) {
                  ;(connectedDeviceId = e.devices[i].deviceId),
                  _wjUtils2.default.showLog('connectedDeviceId', e.devices)
                  var o = {}
                    ;(o.device_name = n),
                  (o.device_id = connectedDeviceId),
                  wx.stopBluetoothDevicesDiscovery({
                    success: function(e) {
                      _wjUtils2.default.showLog('停止扫描，开始连接'),
                      reallyConnect(o, function(e) {
                        ;(void 0 === s ? 'undefined' : _typeof(s)) ==
                                TAG_FUNCTION && s(e)
                      })
                    },
                    fail: function(e) {
                      _wjUtils2.default.showError(
                        'stopBluetoothDevicesDiscovery fail',
                        e
                      )
                    }
                  })
                  break
                }
              }
            }
          })
        },
        fail: function(e) {
          _wjUtils2.default.showError(
            'startBluetoothDevicesDiscovery fail',
            e
          )
        }
      })
    },
    fail: function(e) {
      _wjUtils2.default.showError('openBluetoothAdapter fail', e)
    }
  }),
  wx.onBLEConnectionStateChange(function(e) {
    e.connected == 0 &&
        (wx.closeBLEConnection({
          deviceId: e.deviceId,
          success: function(e) {
            _wjUtils2.default.showLog('closeBLEConnection:', e)
          }
        }),
        wx.closeBluetoothAdapter({
          success: function(e) {
            _wjUtils2.default.showLog('closeBluetoothAdapter', e)
          }
        })),
    console.error(
      'device ' +
            e.deviceId +
            ' state has changed, connected: ' +
            e.connected
    )
  })
}
function reallyConnect(e, i) {
  var c = {},
    t = e.device_name
  _wjUtils2.default.showLog('name', t),
  (t.indexOf('WJ') == -1 &&
      t.indexOf('WanJi') == -1 &&
      t.indexOf('Wanji') == -1) ||
      ((connectedDeviceId = e.device_id),
      wx.createBLEConnection({
        deviceId: connectedDeviceId,
        success: function(e) {
          _wjUtils2.default.showLog('已连接,开始使能服务', connectedDeviceId),
          _enableService(function(e) {
            e.serviceCode == 0
              ? (_wjUtils2.default.showLog('已连接,并使能成功'),
              ((c = e).serviceInfo = '已连接,并使能成功!'))
              : ((c = e).serviceInfo = '连接成功，但服务使能失败!'),
            (void 0 === i ? 'undefined' : _typeof(i)) == TAG_FUNCTION &&
                  i(c)
          })
        },
        fail: function(e) {
          _wjUtils2.default.showError('createBLEConnection fail', e)
        }
      }))
}
function _enableService(n) {
  var o = {}
  wx.getBLEDeviceServices({
    deviceId: connectedDeviceId,
    success: function(e) {
      for (var i = 0; i < e.services.length; i++) {
        var c = e.services[i].uuid
        c == services &&
          wx.getBLEDeviceCharacteristics({
            deviceId: connectedDeviceId,
            serviceId: c,
            success: function(e) {
              for (var i = 0, c = 0; c < e.characteristics.length; c++) {
                var t = e.characteristics[c].uuid
                t == notifyServiceId ? i++ : t == writeServiceId && i++
              }
              i < 2
                ? ((o.serviceCode = -1),
                (o.serviceInfo = 'getBLEDeviceCharacteristics temp<2!'),
                (void 0 === n ? 'undefined' : _typeof(n)) == TAG_FUNCTION &&
                    n(o))
                : wx.notifyBLECharacteristicValueChange({
                  deviceId: connectedDeviceId,
                  serviceId: services,
                  characteristicId: notifyServiceId,
                  state: !0,
                  success: function(e) {
                    _onBLECharacteristicValueChange(),
                    (o.serviceCode = 0),
                    (o.serviceInfo = 'enable success!'),
                    (void 0 === n ? 'undefined' : _typeof(n)) ==
                          TAG_FUNCTION && n(o)
                  },
                  fail: function() {
                    ;(o.serviceCode = -2),
                    (o.serviceInfo =
                          'notifyBLECharacteristicValueChange fail!'),
                    (void 0 === n ? 'undefined' : _typeof(n)) ==
                          TAG_FUNCTION && n(o)
                  }
                })
            },
            fail: function() {
              ;(o.serviceCode = -3),
              (o.serviceInfo = 'getBLEDeviceCharacteristics fail!'),
              (void 0 === n ? 'undefined' : _typeof(n)) == TAG_FUNCTION &&
                  n(o)
            }
          })
      }
    },
    fail: function() {
      ;(o.serviceCode = -4),
      (o.serviceInfo = 'getBLEDeviceServices fail!'),
      (void 0 === n ? 'undefined' : _typeof(n)) == TAG_FUNCTION && n(o)
    }
  })
}
function reallyDisConnect(i) {
  var c = {}
  wx.closeBLEConnection({
    deviceId: connectedDeviceId,
    success: function(e) {
      _wjUtils2.default.showLog('closeBLEConnection:', e)
    }
  }),
  wx.closeBluetoothAdapter({
    success: function(e) {
      _wjUtils2.default.showLog('closeBluetoothAdapter', e),
      (c.serviceCode = 0),
      (c.serviceInfo = '断开蓝牙成功!'),
      (void 0 === i ? 'undefined' : _typeof(i)) == TAG_FUNCTION && i(c)
    }
  })
}
function _writeBLECharacteristicValue(e, i) {
  var c = {}
  wx.writeBLECharacteristicValue({
    deviceId: connectedDeviceId,
    serviceId: services,
    characteristicId: writeServiceId,
    value: e,
    success: function(e) {
      _wjUtils2.default.showLog(
        'writeBLECharacteristicValue success',
        e.errMsg
      ),
      (c.serviceCode = 0),
      (c.serviceInfo = e.errMsg),
      (void 0 === i ? 'undefined' : _typeof(i)) == TAG_FUNCTION && i(c)
    }
  })
}
function _onBLECharacteristicValueChange() {
  wx.onBLECharacteristicValueChange(function(e) {
    _wjUtils2.default.showLog('有回复'),
    ListenFlag == 1 &&
        (void 0 === DataListenerCallBack
          ? 'undefined'
          : _typeof(DataListenerCallBack)) == TAG_FUNCTION &&
        DataListenerCallBack(e.value)
  })
}
function _SetDataListenerCallBack(e, i) {
  e == 1
    ? ((ListenFlag = !0), (DataListenerCallBack = i))
    : e == 0 && (ListenFlag = !1)
}
module.exports = {
  reallyConnect: reallyConnect,
  reallyScanConnect: reallyScanConnect,
  reallyDisConnect: reallyDisConnect,
  _writeBLECharacteristicValue: _writeBLECharacteristicValue,
  _SetDataListenerCallBack: _SetDataListenerCallBack
}
