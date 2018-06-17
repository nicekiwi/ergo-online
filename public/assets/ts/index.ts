import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

/* eslint-disable no-new */
let v = new Vue({
  el: '#ergoApp',
  template: '<App/>',
  components: { App }
})