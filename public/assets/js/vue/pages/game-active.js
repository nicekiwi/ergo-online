let PageGameActive = Vue.component('PageGameActive', {
    mounted() {
        if (!this.$parent.isLoaded) {
            VueEvent.on('app-ready', this.init)
        } else {
            this.init()
        }
    },
    beforeMount() {
      this.updateData = true
    },
    beforeDestroy() {
      this.updateData = false
    },
    data() {
      return {
        game: {},
        isStarting: false,
        isJoining: false,
        updateData: true
      }
    },
    watch: {
      '$route': 'init'
    },
    methods: {
      init() {
        let paramGameId = this.$route.params.gameId
        let userGameId = this.$parent.player.gameId

        if (userGameId === null) {
          VueEvent.fire('modal-open-error', { 
            title: 'Unable to join',
            message: 'Please use the game browser to check if game exists and join it there.'
          })
          this.$router.push(`/games`)
        } else if (userGameId !== paramGameId) {
          this.$router.push(`/games/${userGameId}`)
        } else {
          this.updateGame()
        }
      },
      leaveGame() {
          axios.post(`/api/game/leave`, {
              gameId: this.$parent.player.gameId,
              playerId: this.$parent.player.id
          }).then(res => {
              this.$parent.updatePlayerData(null)
              this.$router.push('/games')
          })
      },
      startGame() {
        this.isStarting = true
        axios.post(`/api/game/start`, {
          gameId: this.$parent.player.gameId,
          playerId: this.$parent.player.id
        }).then(res => {
          if (!res.data.success) {
            this.isStarting = false
            VueEvent.fire('modal-open-error', { 
              title: res.data.title,
              message: res.data.message
            })
          }
        })
      },
      updateGameData() {
        axios.post(`/api/game/data`, {
          gameId: this.$parent.player.gameId,
          playerId: this.$parent.player.id
        }).then(res => {
          if (res.data.success) {
            this.game = res.data.game
          } else {
            this.$parent.updatePlayerData(null)
            this.$router.push('/games')
          }
        })
      },
      updateGame() {
        setTimeout(() => { if(this.updateData) this.updateGame() }, 3000)
        this.updateGameData()
      }
    },
    computed: {
      isOwner() {
        return this.game.ownerId && (this.game.ownerId === this.$parent.player.id)
      }
    },
    template: `
    <div class="content">
        <h1 class="title" v-text="game.name"></h1>
        <h2 class="subtitle">{{ game.ownerName }}'s game</h2>

        <div v-if="game.accessKey">
          <pre v-text="game.accessKey"></pre>
        </div>

        <a class="button is-danger" v-on:click="leaveGame()">Leave Game</a>

        <div v-if="game.hasStarted">
            <p>Game Started</p>
        </div>
        <div v-else>
            <h3>Players:</h3>
            <ul>
                <li v-for="(player, index) in game.players" :key=index v-text=player.name></li>
            </ul>

            <a :class="['button is-link', { 'is-loading': isStarting }]" :disabled="isStarting" v-if="isOwner" v-on:click.once="startGame()">Start Game</a>
        </div>
    </div>
  `
});