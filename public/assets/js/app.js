const router = new VueRouter({
  routes: [
    { path: '/', component: PageLanding },
    { path: '/games', component: PageGameList },
    { path: '/:gameId', component: PageGameActive }
  ]
})

// Make sure a player can only be in one game at a time
router.beforeEach((to, from, next) => {
  next(vm => {
    if (vm.$parent.player.gameId && vm.$parent.player.id) {
      vm.$router.push(`/${vm.$parent.player.gameId}`)
    }
  })
})

const app = new Vue({
  router,
  mounted() {
    this.init();
  },
  methods: {
    init() {

      let playerCookie = Cookies.get(this.cookieName)

      if (playerCookie !== undefined) {
        this.player.id = playerCookie.split('|')[1] || null
        this.player.name = playerCookie.split('|')[2] || null
        this.player.gameId = playerCookie.split('|')[0] || null
      }

      // check if player is in game that has not ended
      if (this.player.id !== null) {
        axios
          .post('/game/connect', { 
            gameId: this.player.gameId, 
            playerId: this.player.id 
          })
          .then(res => {
            this.isLoaded = true

            if (res.data.success) {
              this.$router.push(`/${this.player.gameId}`)
            } else {
              this.$router.push(`/`)
            }
          })
          // todo; fix this
          .catch(e => console.error)
      } else {
        this.isLoaded = true
        this.$router.push(`/`)
      }
    },
    updatePlayerData(data) {
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
    updatePlayerCookie(data) {
      Cookies.set(this.cookieName, `${data.gameId}|${data.id}|${data.name}`, { 
        expires: 7, path: '/' 
      })
    },
    deletePlayerCookie() {
      Cookies.remove(this.cookieName)
    }
  },
  watch: {
    isLoaded(val) {
      if (val) VueEvent.fire('app-ready')
    }
  },
  computed: {
    isLandingPage() {
      return this.$route.path === '/'
    }
  },
  data() {
    return {
      title: 'Ergo Online',
      subTitle: 'Do you event exist? Prove it!',
      cookieName: 'ergo-player',
      player: {
        id: null,
        name: null,
        gameId: null
      },
      isLoaded: false
    }
  },
  template: `
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
      <ModalJoinGamePrivate />
      <ModalError />
    </div>
  `
}).$mount('#ergoApp')