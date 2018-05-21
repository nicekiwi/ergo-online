
let GameNewModal = Vue.component('GameNewModal', {
  props: [ 'modalOpen' ],
  mounted() {},
  data() {
    return {
      playerName: "Surf_King",
      gameName: "BattleBots Attack!",
      maxPlayers: 4,
      turnTimeLimit: 30000,
      visibility: "public",
      scoreLimit: 50
    }
  },
  methods: {
    closePopup() {
      VueEvent.fire('modal-close-new-game');
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
                <input v-model="playerName" class="input" type="text" placeholder="Surf_King">
              </div>
              <p class="help">Your player name in the game, max 12 characters, numbers and letters only.</p>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">Game Name</label>
              <div class="control">
                <input v-model="gameName" class="input" type="text" placeholder="BattleBots_Attack">
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
                  <select v-model="maxPlayers">
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
                  <select v-model="turnTimeLimit">
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
                  <select v-model="visibility">
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
                <select v-model="scoreLimit">
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
            <a class="button is-large is-primary">Start Game</a>
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

    VueEvent.on('modal-close-new-game', data => {
      this.newGameModalOpen = false;
    });
  },
  data() {
    return {
      games: [],
      newGameModalOpen: false
    }
  },
  methods: {
    refreshList() {
      axios.get('http://127.0.0.1:3000/games/list').then(res => { this.games = res.data});
    },
    openNewGameModal() {
      this.newGameModalOpen = true;
    },
    joinGame(id) {
      this.$router.push(`/games/${id}`)
    }
  },
  template: `
    <div>
      <button class="button is-link" v-on:click="openNewGameModal()">New Game</button>
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Players</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="game in games">
            <td>{{ game.name }}</td>
            <td>{{ game.type }}</td>
            <td>{{ game.currentPlayers }}</td>
            <td><button v-on:click="joinGame(game.id)">Join</button></td>
          </tr>
        </tbody>
      </table>
      <GameNewModal :modalOpen=newGameModalOpen />
    </div>
  `
});

let GameActivePage = Vue.component('GameActivePage', {
  mounted() {
    axios.get(`/game/data/${this.$route.params.id}`).then(res => {
      this.games = res.data;
    });
  },
  data: function () {
    return {
      count: 0
    }
  },
  template: `
    <div>Game ID: {{ $route.params.id }}
      <div class="board">
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

    // Check for existing Cookie
    let userIdCookie = Cookies.get('ergoUserId');
    let userNameCookie = Cookies.get('ergoUserName');

    // load into store is present
    if (userIdCookie) {
      this.user.id = userIdCookie;
      this.user.name = userNameCookie;
    }
  },
  data() {
    return {
      user: {
        id: null,
        name: null
      }
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
              <div class="column" v-if="user.id">
                <div class="user-space">
                  <p>{{ user.id }}</p>
                  <i class="fas fa-user-circle fa-3x"></i>
                </div>
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
    </div>
  `
}).$mount('#ergoApp')