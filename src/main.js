import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入样式表
import 'assets/fonts/iconfont.css'
import './plugins/element.js'
import axios from 'axios'

axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use( config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
},err => {
  console.log(err);
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
