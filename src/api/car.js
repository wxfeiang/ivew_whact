import fly from '@/http/http'
import qs from 'query-string'

// 车辆绑定接口
export function carBind(data) {
  return fly.request('busi/vehicle/bind', data, {
    method: 'POST'
    // baseURL: 'http://192.168.1.158:9090/'
  })
}

// 已绑定车辆列表接口
export function carBindList(data) {
  return fly.request('busi/vehicle/list', qs.stringify(data), {
    method: 'GET'
    // baseURL: 'http://192.168.1.158:9090/'
  })
}

// 已绑定车辆解绑接口
export function carRelease(data) {
  return fly.request('busi/vehicle/update', data, {
    method: 'POST'
    // baseURL: 'http://192.168.1.158:9090/'
  })
}
// 车主服务校验用户状态接口
export function carServices(data) {
  return fly.request('busi/vehicle/querystate', data, {
    method: 'POST'
  })
}

// 车主服务授权开通接口
export function carServicesOpen(data) {
  return fly.request('busi/vehicle/authorization', data, {
    method: 'POST'
  })
}

// 微信代扣签约接口
export function entrustOpen(data) {
  return fly.request('busi/withhold/signatory', data, {
    method: 'POST'
  })
}

// 是否开通车主服务通知接口
export function carServiceNotify(data) {
  return fly.request('busi/vehicle/notify', data, {
    method: 'POST'
  })
}
