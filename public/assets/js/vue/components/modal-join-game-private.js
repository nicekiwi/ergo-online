let ModalJoinGamePrivate = Vue.component('ModalJoinGamePrivate', {
    mounted () {
      this.resetData()
      VueEvent.on('modal-open-join-private-game', () => {
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
            gameId: '',
            playerName: 'Chaos_Servant'
        }
      },
      closePopup() {
        this.resetData()
      },
      joinGame() {
        axios.post('/game/join', { 
          gameId: this.formData.gameId,
          playerName: this.formData.playerName 
        }).then(res => {
          if (res.data.success) {
  
            // set play and game cookie
            this.$parent.updatePlayerData({
              id: res.data.playerId,
              name: this.formData.playerName,
              gameId: this.formData.gameId
            })
  
            this.closePopup();
  
            this.$router.push(`/${this.formData.gameId}`)
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
              <h2 class="title is-3">Join private game</h2>
            </div>
          </div>
          <div class="columns">
            <div class="column">
                <div class="field">
                    <label class="label">Game ID</label>
                    <div class="control">
                        <input v-model="formData.gameId" class="input" type="text">
                    </div>
                </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Player Name</label>
                <div class="control">
                  <input v-model="formData.playerName" class="input" type="text" placeholder="Surf_King">
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