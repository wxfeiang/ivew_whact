import fly from '@/http/http'
import qs from 'query-string'

// 获取商品信息接口
export function goodsList(data) {
  return fly.request('busi/goods/total', qs.stringify(data), {
    method: 'GET'
  })
}

// 保存商品订货单接口
export function goodsSave(data) {
  return fly.request('busi/etcapply/save', data, {
    method: 'POST'
  })
}

// 查询用户是否下单接口
export function hasOrder(data) {
  return fly.request('busi/etcissue/userid', data, {
    method: 'GET'
  })
}

// 查询用户下单的审核信息接口
export function checkAudit(data) {
  return fly.request('busi/etcissue/audit', data, {
    method: 'GET'
  })
}
