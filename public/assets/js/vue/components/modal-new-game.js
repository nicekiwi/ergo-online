let ModalNewGame = Vue.component('ModalNewGame', {
    mounted() {
      this.resetData()
      VueEvent.on('modal-open-new-game', data => {
        this.modalOpen = true
      })
    },
    data() {
      return {
        modalOpen: false,
        formData: {}
      }
    },
    methods: {
        resetData() {
          this.modalOpen = false
          this.formData = {
            playerName: "Surf_King",
            gameName: "BattleBots Attack!",
            maxPlayers: 4,
            turnTimeLimit: 30000,
            visibility: "public",
            scoreLimit: 50
          }
        },
        closePopup() {
          this.resetData()
        },
        startGame() {
            axios.post('/games/new', this.formData).then(res => {

                // update cookie and playerDate
                this.$parent.updatePlayerData({ 
                  gameId: res.data.gameId, 
                  id: res.data.playerId, 
                  name: this.formData.playerName
                })

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
                <input v-model="formData.playerName" class="input" type="text" placeholder="Surf_King">
              </div>
              <p class="help">Your player name in the game, max 12 characters, numbers and letters only.</p>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">Game Name</label>
              <div class="control">
                <input v-model="formData.gameName" class="input" type="text" placeholder="BattleBots_Attack">
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
                  <select v-model="formData.maxPlayers">
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
                  <select v-model="formData.turnTimeLimit">
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
                  <select v-model="formData.visibility">
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
                <select v-model="formData.scoreLimit">
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