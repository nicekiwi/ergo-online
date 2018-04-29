
let CreateUser = Vue.component('CreateUser', {
  data: function () {
    return {
      count: 0
    }
  },
  methods: {
    
  },
  template: `
    <div>
      <h2 class="title">Create Username</h2>
      <div class="field">
        <label class="label">Username</label>
        <div class="control has-icons-left has-icons-right">
          <input class="input is-success" type="text" placeholder="Text input" value="bulma">
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
          <span class="icon is-small is-right">
            <i class="fas fa-check"></i>
          </span>
        </div>
      </div>
    </div>
  `
});

let GameBrowser = Vue.component('GameBrowser', {
  mounted() {
    setInterval(() => {
      this.refreshList()
    }, 15000)

    this.refreshList()
  },
  data() {
    return {
      games: []
    }
  },
  methods: {
    refreshList() {
      axios.get('http://127.0.0.1:3000/games').then(res => {
          this.games = res.data;
        });
    },
    newGame() {
      axios.post('http://127.0.0.1:3000/games/new', { userId: Cookies.get('ergoUser') }).then(res => {
        this.$router.push(`/${res.data.id}`)
      });
    },
    joinGame(id) {
      this.$router.push(`/${id}`)
    }
  },
  template: `
    <div>
      <button class="button is-link" v-on:click="newGame()">New Game</button>
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
    </div>
  `
});

let GameActive = Vue.component('GameActive', {
  mounted() {
    axios.get(`http://127.0.0.1:3000/game/data/${this.$route.params.id}`).then(res => {
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

const routes = [
  { path: '/', component: GameBrowser },
  { path: '/create-user', component: CreateUser },
  { path: '/:id', component: GameActive }
]

const router = new VueRouter({ routes })
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
    } else {
      this.$router.push('/create-user');
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