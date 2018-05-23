
let GameJoinModal = Vue.component('GameJoinModal', {
  mounted() {
    VueEvent.on('modal-open-join-game', data => {
      this.modalOpen = true
    });
  },
  data() {
    return {
      modalOpen: false,
      data: {
        playerName: "Surf_King"
      }
    }
  },
  methods: {
    closePopup() {
      this.modalOpen = false
    },
    joinGame() {

    }
  },
  template: `
    <div :class="'modal' + (modalOpen ? ' is-active' : '')">
      <div class="modal-background"></div>
      <div class="modal-content box">
        <div class="columns">
          <div class="column">
            <h2 class="title is-3">Join game</h2>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field">
              <label class="label">Player Name</label>
              <div class="control">
                <input v-model="data.playerName" class="input" type="text" placeholder="Surf_King">
              </div>
              <p class="help">Your player name in the game, max 12 characters, numbers and letters only.</p>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <a v-on:click="joinGame()" class="button is-large is-primary">Join</a>
          </div>
        </div>
      </div>
      <button v-on:click="closePopup()" class="modal-close is-large" aria-label="close"></button>
    </div>
  `
});

let GameNewModal = Vue.component('GameNewModal', {
  mounted() {
    VueEvent.on('modal-open-new-game', data => {
      this.modalOpen = true
    });
  },
  data() {
    return {
      modalOpen: false,
      data: {
        playerName: "Surf_King",
        gameName: "BattleBots Attack!",
        maxPlayers: 4,
        turnTimeLimit: 30000,
        visibility: "public",
        scoreLimit: 50
      }
    }
  },
  methods: {
    closePopup() {
      this.modalOpen = false
    },
    startGame() {
      axios.post('http://127.0.0.1:3000/games/new', this.data).then(res => { 
        Cookies.set(`ergo-player-${res.data.gameId}`, `${res.data.playerId}|${this.playerName}`)
        this.$router.push(`/${res.data.gameId}`)
        this.closePopup()
      });
    }
  },
  template: `
    <div :class="'modal' + (modalOpen ? ' is-active' : '')">
      <div class="modal-background"></div>
      <div class="modal-content box">
        <div class="columns">
          <div class="column">
            <h2 class="title is-3">Start a new game</h2>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field">
              <label class="label">Player Name</label>
              <div class="control">
                <input v-model="data.playerName" class="input" type="text" placeholder="Surf_King">
              </div>
              <p class="help">Your player name in the game, max 12 characters, numbers and letters only.</p>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">Game Name</label>
              <div class="control">
                <input v-model="data.gameName" class="input" type="text" placeholder="BattleBots_Attack">
              </div>
              <p class="help">All games need a name right?</p>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field">
              <label class="label">Number of players</label>
              <div class="control">
                <div class="select is-primary">
                  <select v-model="data.maxPlayers">
                    <option value="2">2 Players</option>
                    <option value="3">3 Players</option>
                    <option value="4" selected>4 Players</option>
                  </select>
                </div>
              </div>
              <p class="help">Minimum 2, Maximum 4.</p>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">Turn time limit</label>
              <div class="control">
                <div class="select is-primary">
                  <select v-model="data.turnTimeLimit">
                    <option selected value="30000">30 seconds</option>
                    <option value="60000">60 seconds</option>
                    <option value="90000">90 seconds</option>
                  </select>
                </div>
              </div>
              <p class="help">Keep the game moving with a time limit on each player\'s turn, after which they\'ll be forced to discard and end their turn.</p>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field">
              <label class="label">Visbility</label>
              <div class="control">
                <div class="select is-primary">
                  <select v-model="data.visibility">
                    <option selected value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>
              <p class="help">Private Games do not display in the Game Browser and can only be joined by those you share the link with.</p>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">Score Limit</label>
              <div class="control">
                <div class="select is-primary">
                <select v-model="data.scoreLimit">
                  <option value="50">50</option>
                  <option selected value="100">100</option>
                  <option value="250">250</option>
                </select>
              </div>
              </div>
              <p class="help">When does the game end?</p>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <a v-on:click="startGame()" class="button is-large is-primary">Start Game</a>
          </div>
        </div>
      </div>
      <button v-on:click="closePopup()" class="modal-close is-large" aria-label="close"></button>
    </div>
  `
});

let GameListPage = Vue.component('GameListPage', {
  mounted() {
    setInterval(() => {
      this.refreshList()
    }, 15000)

    this.refreshList();
  },
  data() {
    return {
      games: [],
    }
  },
  methods: {
    refreshList() {
      axios.get('http://127.0.0.1:3000/games/list').then(res => { this.games = res.data});
    },
    openJoinGameModal(id) {
      VueEvent.fire('modal-open-join-game', { gameId: id})
    },
    openNewGameModal() {
      VueEvent.fire('modal-open-new-game')
    },
    getOwnerName(gameObj) {
      return gameObj.players.find(x => x.id === gameObj.ownerId).name;
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
          <tr v-for="game in games">
            <td>{{ game.name }}</td>
            <td>{{ getOwnerName(game) }}</td>
            <td>{{ game.players.length }}/{{ game.settings.maxPlayers }}</td>
            <td><a class="button is-small is-link is-outlined" v-on:click="openJoinGameModal(game.id)">Join</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  `
});

let GameActivePage = Vue.component('GameActivePage', {
  mounted() {
    this.game.id = this.$route.params.gameId;
    this.player.id = Cookies.get(`ergo-player-${this.game.id}`).split('|')[0];
    this.player.name = Cookies.get(`ergo-player-${this.game.id}`).split('|')[1];
    axios.post(`http://127.0.0.1:3000/game/join`, { gameId: this.game.id, playerId: this.player.id }).then(res => {
      this.game.data = res.data;
    });
  },
  data: function () {
    return {
      player: {
        id: '',
        name: ''
      },
      game: {
        id: null,
        data: {}
      }
    }
  },
  template: `
    <div>Game ID: {{ game.id }}
      <div class="board" v-text="game.data">
      </div>
      <div class="cards"> 
      </div>
  </div>
  `
});

const router = new VueRouter({ routes: [
  { path: '/', component: GameListPage },
  { path: '/:gameId', component: GameActivePage }
] })

const app = new Vue({ 
  router, 
  mounted() {

    VueEvent.on('modal-action', data => {
      this.newGameModalOpen = false;
    });

    
  },
  methods: {

  },
  data() {
    return {
      newGameModalOpen: false,
      joinGameModalOpen: false
    }
  },
  template: `
    <div>
      <section class="hero is-info">
        <div class="hero-body">
          <div class="container">
            <div class="columns">
              <div class="column">
                <h1 class="title is-4">Ergo Online</h1>
                <h2 class="subtitle is-6">Do you even exist? Prove it.</h2>
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
      <GameNewModal />
      <GameJoinModal />
    </div>
  `
}).$mount('#ergoApp')