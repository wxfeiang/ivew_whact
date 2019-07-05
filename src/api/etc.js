import fly from '@/http/http'
import qs from 'query-string'

// 校验mac1的接口
export function loadMacCheck(data) {
  return fly.request('busi/mac/check', data, {
    method: 'POST'
    // baseURL: 'http://192.168.1.158:9090/'
  })
}

// 生成mac2的接口
export function loadMacGenerate(data) {
  return fly.request('busi/mac/get', data, {
    method: 'POST'
    // baseURL: 'http://192.168.1.158:9090/'
  })
}

// 圈存前通知的接口
export function noticeLoadBefore(data) {
  return fly.request('busi/enc/save', data, {
    method: 'POST'
    // baseURL: 'http://192.168.1.158:9090/'
  })
}

// 圈存成功通知的接口
export function noticeLoadReport(data) {
  return fly.request('busi/enc/status', data, {
    method: 'POST'
    // baseURL: 'http://192.168.1.158:9090/'
  })
}

// 圈存获取token
export function epayToken(data) {
  return fly.request('', data, {
    method: 'POST',
    baseURL: 'http://61.178.107.23/test/esb/3000/'
  })
}

// 可圈存余额查询
export function epayBalance(data) {
  return fly.request('', data, {
    method: 'POST',
    baseURL: 'http://61.178.107.23/test/esb/3000/'
  })
}

// 预充值账户圈存开始
export function epayStart(data) {
  return fly.request('', data, {
    method: 'POST',
    baseURL: 'http://61.178.107.23/test/esb/3000/'
  })
}

// 预充值账户圈存结束
export function epayEnd(data) {
  return fly.request('', data, {
    method: 'POST',
    baseURL: 'http://61.178.107.23/test/esb/3000/'
  })
}

// OBU激活取3mac数据
export function getTMAC(data) {
  return fly.request('', data, {
    method: 'POST',
    baseURL: 'http://61.178.107.23/test/esb/2000/'
  })
}

// OBU激活次数查询
export function getObuCount(data) {
  return fly.request('busi/etcobu/acount', qs.stringify(data), {
    method: 'GET'
  })
}

// 激活成功保存激活信息
export function saveObuFinish(data) {
  return fly.request('busi/etcobu/save', data, {
    method: 'POST'
  })
}
