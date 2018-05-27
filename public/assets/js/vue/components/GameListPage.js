let GameListPage = Vue.component('GameListPage', {
    mounted() {
      if (!this.$parent.isLoaded) {
        VueEvent.on('app-ready', this.init)
      } else {
        this.init()
      }
    },
    data() {
        return {
            games: [],
        }
    },
    methods: {
        init() {
          if (this.$parent.player.gameId) {
            this.$router.push(`/${this.$parent.player.gameId}`)
          } else {
            setInterval(() => {
                this.refreshList()
            }, 15000)

            this.refreshList();
          }
        },
        refreshList() {
            // first make check if player is already in a game, if so take them to it directly. force them to manually leave that game before being able to start or join another one.
            axios.get('/games/list').then(res => { this.games = res.data });
        },
        openJoinGameModal(game) {
            VueEvent.fire('modal-open-join-game', game)
        },
        openNewGameModal() {
            VueEvent.fire('modal-open-new-game')
        }
    },
    template: `
    <div>
      <button class="button is-link" v-on:click="openNewGameModal()">New Game</button>
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