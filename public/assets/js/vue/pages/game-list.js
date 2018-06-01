let PageGameList = Vue.component('PageGameList', {
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
        games: [],
        updateData: true
      }
    },
    methods: {
        init() {
          if (this.$parent.player.gameId) {
            this.$router.push(`/games/${this.$parent.player.gameId}`)
          } else {
            this.refreshList()
          }
        },
        refreshData() {
          axios.get('/api/games/list').then(res => { this.games = res.data })
        },
        refreshList() {
          setTimeout(() => { if(this.updateData) this.refreshList() }, 3000)
          this.refreshData()
        },
        openJoinGameModal(game) {
            VueEvent.fire('modal-open-join-game', game)
        },
        openJoinPrivateGameModal() {
            VueEvent.fire('modal-open-join-private-game')
        },
        openNewGameModal() {
            VueEvent.fire('modal-open-new-game')
        }
    },
    template: `
    <div>
      <a class="button is-link" v-on:click="openNewGameModal()">New Game</a>
      <a class="button" v-on:click="openJoinPrivateGameModal()">Join Private Game</a>
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Owner</th>
            <th>Players</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(game, index) in games" :key=index>
            <td>{{ game.name }}</td>
            <td>{{ game.ownerName }}</td>
            <td>{{ game.players }}/{{ game.maxPlayers }}</td>
            <td><a class="button is-small is-link is-outlined" v-on:click="openJoinGameModal(game)">Join</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  `
});