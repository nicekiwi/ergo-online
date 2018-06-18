import Vue from 'vue'
import App from './vue/App.vue'

Vue.config.productionTip = false

/* eslint-disable no-new */
let v = new Vue({
  el: '#ergoApp',
  template: '<App/>',
  components: { App }
})