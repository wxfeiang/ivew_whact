import fly from '@/http/http'
import qs from 'query-string'

// 帮助列表接口
export function helpList(data) {
  return fly.request('busi/help/all', data, {
    method: 'GET'
    // baseURL: 'http://192.168.1.158:9090/'
  })
}

// 反馈接口
export function helpSave(data) {
  return fly.request('busi/help/save', data, {
    method: 'POST'
    // baseURL: 'http://192.168.1.158:9090/'
  })
}

// 帮助列表详情接口
export function helpDetail(data) {
  return fly.request(
    `busi/help/${data}`,
    {},
    {
      method: 'GET'
      // baseURL: 'http://192.168.1.158:9090/'
    }
  )
}

// 通行记录查询接口
// color 车牌颜色 0 蓝色 1黄色 2 黑色 3 白色 4 渐变绿色 5 黄绿双拼 6 蓝白渐变
export function trafficList(data) {
  return fly.request('busi/vehicle/pass', data, {
    method: 'GET'
    // baseURL: 'http://192.168.1.158:9090/'
  })
}

// 获取etc卡片数据
export function getCardList(data) {
  return fly.request('busi/vehicle/etc', qs.stringify(data), { method: 'GET' })
}
