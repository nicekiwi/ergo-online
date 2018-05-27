let GameJoinModal = Vue.component('GameJoinModal', {
  mounted () {
    VueEvent.on('modal-open-join-game', game => {
      this.game = game
      this.modalOpen = true
    });
  },
  data() {
    return {
      modalOpen: false,
      game: {},
      data: {
        playerName: 'Surf_King'
      }
    }
  },
  methods: {
    closePopup() {
      this.modalOpen = false
    },
    joinGame() {
      axios.post('/game/join', { 
        gameId: this.game.id,
        playerName: this.data.playerName 
      }).then(res => {
        if (res.data.success) {
          this.$router.push(`/${this.game.id}`)
        } else {
          this.modalOpen = false
          VueEvent.fire('modal-open-error', { 
            title: res.data.title,
            message: res.data.message
          })
        }
      })
    }
  },
  template: `
    <div :class="'modal' + (modalOpen ? ' is-active' : '')">
      <div class="modal-background"></div>
      <div class="modal-content box">
        <div class="columns">
          <div class="column">
            <h2 class="title is-3">Join {{ game.owerName }}'s game</h2>
            <h2 class="subtitle" v-text="game.name"></h2>
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