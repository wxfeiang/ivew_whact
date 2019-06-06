import fly from '@/http/http'
// import qs from 'query-string'

// 新闻、消息、通知接口
// type:1-系统通知，2-重要通知，3-优惠活动，4-新闻资讯 6-帮主信息 7-提现规则 8-积分规则
// id
// 不传参数查所有 传TYPE按类型查 id查对应的一条新闻
export function newsInfo(data) {
  return fly.request('busi/news/find', data, {
    method: 'POST'
    // baseURL: 'http://192.168.1.158:9090/'
  })
}
