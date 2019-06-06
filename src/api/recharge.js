import fly from '@/http/http'

// 充值记录接口
export function rechargeQuery(data) {
  return fly.request('busi/order/query', data, { method: 'GET' })
}
