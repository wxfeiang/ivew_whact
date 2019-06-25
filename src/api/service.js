import fly from '@/http/http'
import qs from 'query-string'

// 下拉列表
export function getSelect(data) {
  return fly.request('/busi/etcagency/list', data, {
    method: 'GET'
  })
}

// 根据下拉列表现实对应列表
export function getSelectList(data) {
  return fly.request('busi/etcagency/list', data, {
    method: 'GET'
  })
}
