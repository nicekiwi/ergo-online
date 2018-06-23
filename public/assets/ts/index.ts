import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import io from 'socket.io-client'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'
import App from './vue/App.vue'
import PageLanding from './vue/pages/Landing.vue'
import PageGameList from './vue/pages/GameList.vue'
import PageGameActive from './vue/pages/GameActive.vue'
import PageNotFound from './vue/pages/NotFound.vue'
import 'es6-promise'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueRouter)

Vue.prototype.$io = io
Vue.prototype.$http = axios
Vue.prototype.$event = {
  fire (event:string, data?:object) { this.$emit(event, data || null) },
  on (event:string, callback?:Function) { this.$on(event, callback) }
}

const store = new Vuex.Store({
  state: {
    settings: {
      cookieName: 'ergo-player',
      title: 'Ergo Online',
      subTitle: 'Do you event exist? Prove it!'
    },
    game: {
      id: null,
      history: []
    },
    player: {
      id: null,
      name: null
    },
    games: []
  },
  mutations: {
    setPlayerId (state, id) {
      state.player.id = id
    },
    setPlayerName (state, name) {
      state.player.name = name
    },
    setGameId (state, id) {
      state.game.id = id
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
    if (vm.$store.state.player.gameId && vm.$store.state.player.id) {
      vm.$router.push(`/games/${vm.$store.state.player.gameId}`)
    }
  })
})

const unsync = sync(store, router)

/* eslint-disable no-new */
let v = new Vue({
  router,
  store,
  el: '#app',
  template: '<App/>',
  components: { App },
  destroyed() {
    unsync()
  }
})