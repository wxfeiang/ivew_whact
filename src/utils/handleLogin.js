import store from '../store/index'
import * as types from '@/store/mutation-types'
import { getOpenId } from '@/api/user'
export function login(callback) {
  wx.showLoading({ title: '加载中', mask: true })
  wx.login({
    success(res) {
      if (res.code) {
        // 登录成功，获取用户信息
        store.commit(types.SYSTEM_CODE, res.code)
        getUserInfo(res.code, callback)
      } else {
        // 否则弹窗显示
        wx.hideLoading()
        showToast()
      }
    },
    fail() {
      wx.hideLoading()
      showToast()
    }
  })
}

// 获取用户信息
export function getUserInfo(code, callback) {
  wx.getUserInfo({
    // 获取成功，全局存储用户信息，开发者服务器登录
    withCredentials: true,
    success(res) {
      // 全局存储用户信息
      store.commit(types.SYSTEM_USER, res.userInfo)
      store.commit(types.SYSTEM_SIGNATURE, res.signature)
      store.commit(types.SYSTEM_ENCRYPTED_DATA, res.encryptedData)
      store.commit(types.SYSTEM_IV, res.iv)
      postLogin(code, res.iv, res.encryptedData, callback)
    },
    fail() {
      // 用户未授权过的情况下进入fail回调，弹窗提示一键登录
      wx.hideLoading()
      // 获取用户信息失败，清楚全局存储的登录状态，弹窗提示一键登录
      // 使用token管理登录态的，清楚存储全局的token
      // 使用cookie管理登录态的，可以清楚全局登录状态管理的变量
      store.commit(types.SYSTEM_AUTHENTICATED, false)
      showToast()
      // 获取不到用户信息，说明用户没有授权或者取消授权。弹窗提示一键登录
    }
  })
}

// 开发者服务端登录
export function postLogin(code, iv, encryptedData, callback) {
  let params = {
    code: code,
    channel: 'wx_jsapi'
  }
  getOpenId(params)
    .then(res => {
      wx.hideLoading()
      if (res.status === 200 && res.data && res.data.openid) {
        store.commit(types.SYSTEM_OPEN_ID, res.data.openid)
        store.commit(types.SYSTEM_SESSION_KEY, res.data.session_key)
        store.commit(types.SYSTEM_AUTHENTICATED, true)
        callback && callback()
      } else {
        store.commit(types.SYSTEM_AUTHENTICATED, false)
        showToast()
      }
    })
    .catch(err => {
      wx.hideLoading()
      showToast(`授权失败，请稍后再试`)
      console.log('从服务端获取openid error: ' + err)
    })
}

// 显示toast弹窗
export function showToast(content = '授权失败，请稍后再试') {
  wx.showToast({
    title: content,
    icon: 'none',
    duration: 4000
  })
}

// 判断是否登录
export function isLogin(callback) {
  let mobile = store.state.mobile
  if (mobile) {
    // 如果有全局存储的登录态，暂时认为他是登录状态
    callback && callback()
  } else {
    // 如果没有登录态，弹窗提示一键登录
    showLoginModal()
  }
}

// 校验用户session_key是否过期
export function checkSession(callback) {
  // let authenticated = store.state.authenticated
  wx.checkSession({
    success: function(res) {},
    fail: function(res) {
      wx.login({})
    }
  })
}

// 接口调用失败处理，
export function handleError(res, callback) {
  // 规定-3041和-3042分别代表未登录和登录态失效
  if (res.code === -3041 || res.code === -3042) {
    // 弹窗提示一键登录
    showAuthModal()
  } else if (res.msg) {
    // 弹窗显示错误信息
    showToast(res.msg)
  }
}

// 显示一键登录授权的弹窗
export function showAuthModal() {
  wx.showModal({
    title: '提示',
    content: '您还未登录，请先登录',
    confirmText: '一键登录',
    showCancel: false,
    success(res) {
      if (res.confirm) {
        wx.navigateTo({
          url: '../auth/main'
        })
      }
    }
  })
}
// 显示一键登录授权的弹窗
export function showLoginModal() {
  wx.showModal({
    title: '提示',
    content: '您还未绑定手机，绑定后可获得完整体验',
    confirmText: '一键绑定',
    success(res) {
      if (res.confirm) {
        wx.navigateTo({
          url: '../user/main'
        })
      }
    }
  })
}
