<template>
	<div>
    <section v-if="isLandingPage" class="hero is-info is-medium">
      <div class="hero-body">
        <div class="container has-text-centered">
          <div class="columns">
            <div class="column">
              <h1 class="title" v-text="title"></h1>
              <h2 class="subtitle" v-text="subTitle"></h2>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-else class="hero is-info">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column">
              <h1 class="title is-4" v-text="title"></h1>
              <h2 class="subtitle is-6" v-text="subTitle"></h2>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="section">
      <div class="container">
        <router-view></router-view>
      </div>
    </section>
    <ModalNewGame />
    <ModalJoinGame />
    <ModalError />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { VueEvent, SocketEvent } from './utils/event'
  import Cookies from 'js-cookie'
  import axios from 'axios'
  import ModalNewGame from './components/ModalNewGame.vue'
  import ModalJoinGame from './components/ModalJoinGame.vue'
  import ModalError from './components/ModalError.vue'

  interface PlayerData {
    name: string,
    id: string,
    gameId: string
  }

  export default Vue.extend({
    components: {
      ModalNewGame, ModalJoinGame, ModalError
    },
    data() {
      return {
        isLoaded: false
      }
    },
    mounted() {

      SocketEvent.fire('connected');
      SocketEvent.on('games-list-update', console.log)

      this.init();
    },
    methods: {
      init() {

        let playerCookie = Cookies.get(this.$store.settings.cookieName)

        if (playerCookie !== undefined) {
          this.$store.commit('setPlayerId', playerCookie.split('|')[1] || null)
          this.$store.commit('setPlayerName', playerCookie.split('|')[2] || null)
          this.$store.commit('setGameId', playerCookie.split('|')[0] || null)
        }

        let playerId = this.$store.state.player.id
        let playerName = this.$store.state.player.name
        let gameId = this.$store.state.game.id

        // check if player is in game that has not ended
        if (playerId !== null) {
          axios
            .post('/api/game/connect', { gameId, playerId })
            .then(res => {
              this.isLoaded = true
              if (res.data.success) {
                this.$router.push(`/games/${gameId}`)
              }
            })
            // todo; fix this
            .catch(e => console.error)
        } else {
          this.isLoaded = true
        }
      },
      updatePlayerData(data:PlayerData) {

        if (data && data.gameId) {
          this.player.id = data.id
          this.player.name = data.name
          this.player.gameId = data.gameId
          this.updatePlayerCookie(data)
        } else {
          this.player.id = null
          this.player.name = null
          this.player.gameId = null
          this.deletePlayerCookie()
        }
      },
      updatePlayerCookie(data:PlayerData) {
        Cookies.set(this.cookieName, `${data.gameId}|${data.id}|${data.name}`, { 
          expires: 7, path: '/' 
        })
      },
      deletePlayerCookie() {
        Cookies.remove(this.cookieName)
      }
    },
    watch: {
      isLoaded(val:boolean) {
        if (val) VueEvent.fire('app-ready')
      }
    },
    computed: {
      isLandingPage() {
        return this.$route.path === '/'
      }
    }
  })
</script>

<style lang="styl">
  
</style>