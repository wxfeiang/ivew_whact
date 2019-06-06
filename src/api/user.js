import fly from '@/http/http'
import qs from 'query-string'

// 获取用户openid接口
export function getOpenId(data) {
  return fly.request('busi/openid', qs.stringify(data), {
    method: 'GET'
  })
}
// 短信验证码发送接口
export function smsSend(data) {
  return fly.request('busi/sms/send', qs.stringify(data), {
    method: 'GET'
    // baseURL: 'http://192.168.1.158:9090/'
  })
}
// 短信验证码验证接口
export function smsVerify(data) {
  return fly.request('busi/sms/verify', qs.stringify(data), {
    method: 'GET'
    // baseURL: 'http://192.168.1.158:9090/'
  })
}

// 将获取到的用户信息及openid保存
export function userSave(data) {
  return fly.request('busi/user/save', data, {
    method: 'POST'
    // baseURL: 'http://192.168.1.158:9090/'
  })
}

// 根据openid或phone查询用户是否存在
export function userFind(data) {
  return fly.request('busi/user/find', qs.stringify(data), {
    method: 'GET'
    // baseURL: 'http://192.168.1.158:9090/'
  })
}

// 更新用户信息
export function userUpdate(data) {
  return fly.request('busi/user/update', data, {
    method: 'POST'
    // baseURL: 'http://192.168.31.158:9090/'
  })
}
