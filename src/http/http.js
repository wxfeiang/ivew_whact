// import wx from 'wx'
import Fly from 'flyio/dist/npm/wx'

const fly = new Fly()

fly.config.timeout = 30000
fly.config.baseURL = 'https://www.gsunis.cn/'
// fly.config.baseURL = 'http://172.16.10.218:9090/'
fly.config.headers = {
  'content-type': 'application/json;charset=utf-8'
}

fly.interceptors.request.use(request => {
  // request.body.appId = 'xxx'
  // 用户的openid在获取之后添加到全局变量中如果存在，我们将它添加到请求参数里面
  // let openid = Vue.prototype.globalData.openid
  // if (openid) {
  //   request.body.openid = openid
  // }
  // 给所有请求添加自定义header
  // request.headers = {
  //   'content-type': 'application/json'
  //   'token': wx.getStorageSync('token')
  // }
  //
  // 公共参数
  // const authParams = {
  //   'fromSource': 'wxmp'
  // }
  // request.body && Object.keys(request.body).forEach((val) => {
  //   if (request.body[val] === '') {
  //     delete request.body[val]
  //   }
  // })
  // request.body = {
  //   ...request.body,
  //   ...authParams
  // }
  console.log(
    `请求地址: ${request.baseURL}
     请求url: ${request.url}
     请求params: ${JSON.stringify(request.params)}
     请求body: ${JSON.stringify(request.body)}`
  )
  return request
})

fly.interceptors.response.use(
  (response, promise) => {
    // if(typeof (response.data)=='string' && response.data!=''){
    //   response.data=JSON.parse(response.data);
    // }
    return promise.resolve(response.data)
  },
  (err, promise) => {
    console.log('http response err:  ' + JSON.stringify(err))
    let errMsg = ''
    if (err.status === 0) {
      errMsg = '网络异常,请稍后再试!'
    } else if (err.status === 1) {
      errMsg = '网络连接超时,请稍后再试!'
    } else if (err.status === 401) {
      errMsg = '用户未登录,请稍后再试!'
    } else if (err.status === 500) {
      errMsg = err.response.data.reasonPhrase
    } else {
      if (err.response.data.message) {
        errMsg = `${err.response.data.message}` || '网络异常!'
      } else {
        errMsg = '网络异常,请稍后再试!'
      }
    }
    return errMsg
    // return promise.resolve(err)
  }
)

export default fly
