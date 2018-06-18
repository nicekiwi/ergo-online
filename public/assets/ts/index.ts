import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './vue/App.vue'
import PageLanding from './pages/Landing.vue'
import PageGameList from './pages/GameList.vue'
import PageGameActive from './pages/GameActive.vue'
import PageNotFound from './pages/NotFound.vue'
import 'es6-promise'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueRouter)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

const router = new VueRouter({
  //mode: 'history',
  routes: [
    { path: '/', component: PageLanding },
    { path: '/games', component: PageGameList },
    { path: '/games/:gameId', component: PageGameActive },
    { path: '*', component: PageNotFound }
  ]
})

// Make sure a player can only be in one game at a time
router.beforeEach((to, from, next) => {
  next(vm => {
    if (vm.$parent.player.gameId && vm.$parent.player.id) {
      vm.$router.push(`/games/${vm.$parent.player.gameId}`)
    }
  })
})

/* eslint-disable no-new */
let v = new Vue({
  router,
  store,
  el: '#ergoApp',
  template: '<App/>',
  components: { App }
})