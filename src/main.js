import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入样式表
import 'assets/fonts/iconfont.css'
import './plugins/element.js'
import axios from 'axios'

import TreeTable from 'vue-table-with-tree-grid'
//引入富文本
import VueQuillEditor from 'vue-quill-editor'
//引入样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use( config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
},err => {
  console.log(err);
})

Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

Vue.filter( 'dataFormat' ,function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')

  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
