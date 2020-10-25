import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入样式表
import 'assets/fonts/iconfont.css'
import './plugins/element.js'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
