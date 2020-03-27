import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'normalize.css'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

import './plugins/element.js'
import axios from './plugins/axios.js'

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
