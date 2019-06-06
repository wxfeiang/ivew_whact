import Vue from 'vue'
import App from './App'
import store from './store/index'
import global from './utils/global'
import resetPageData from './utils/resetPageData.js'
import '../static/css/weui.css'

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$global = global
App.mpType = 'app'
Vue.use(resetPageData)
const app = new Vue({
  store,
  ...App
})
app.$mount()
