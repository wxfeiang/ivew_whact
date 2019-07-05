import fly from '@/http/http'
import qs from 'query-string'

// 支付统一下单接口
export function unifiedOrder(data) {
  return fly.request('busi/payment/order', data, {
    method: 'POST'
  })
}

// 支付接口
export function payment(data) {
  return fly.request('busi/payment/pay', data, {
    method: 'POST'
  })
}

// 支付结果通知接口
export function paymentResult(data) {
  return fly.request('busi/payment/callback', data, {
    method: 'POST'
  })
}

// 充值记录查询接口
export function orderQuery(data) {
  return fly.request('busi/order/query', qs.stringify(data), {
    method: 'GET'
  })
}

// 我的钱包总额查询接口
export function walletQuery(data) {
  return fly.request('busi/wallet', qs.stringify(data), {
    method: 'GET'
  })
}

// 我的钱包资金明细查询接口
export function walletDetail(data) {
  return fly.request('busi/wallet', qs.stringify(data), {
    method: 'GET'
  })
}

// 充值订单明细查询接口
export function orderDetail(data) {
  return fly.request('busi/order/byid', qs.stringify(data), {
    method: 'GET'
  })
}

// 提现记录列表查询接口
export function withdrawList(data) {
  return fly.request('busi/order/query', qs.stringify(data), {
    method: 'GET'
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

// 查询是否有垫付欠款
export function queryDebt(data) {
  return fly.request('/busi/repayment/info', data, {
    method: 'POST'
  })
}
