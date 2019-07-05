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

// 新申请获取上传id 接口
export function getApplyId(data) {
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

// 确认收货接口
export function confirmReceipt(data) {
  return fly.request('busi/etcissue/confirm', data, {
    method: 'POST'
  })
}

// 订单列表接口
export function queryList(data) {
  return fly.request('busi/etcissue/list', data, {
    method: 'GET'
  })
}

// 订单详情接口
export function queryDetail(data) {
  return fly.request('busi/etc/detail', data, {
    method: 'GET'
  })
}

// 补单 获取ocr数据
export function supplyOCR(data) {
  return fly.request('busi/etcapply/id', data, {
    method: 'GET'
  })
}

// 补单 获取照片数据
export function supplyPhoto(data) {
  return fly.request(
    `gfs/img/read/${data}`,
    {},
    {
      method: 'GET'
    }
  )
}

// 补单 获取照片数据
export function reSupply(data) {
  return fly.request('busi/etcapply/update', data, {
    method: 'POST'
  })
}

// 补单 获取照片数据
export function hasOrder(data) {
  return fly.request(`busi/etcapply/progress`, data, {
    method: 'GET'
  })
}
