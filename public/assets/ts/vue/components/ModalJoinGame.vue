<template>
  <div :class="'modal' + (modalOpen ? ' is-active' : '')">
    <div class="modal-background"></div>
    <div class="modal-content box">
      <div class="columns">
        <div class="column">
          <h2 class="title is-3">Join {{ game.host ? game.host.name : '' }}'s game</h2>
          <h2 class="subtitle" v-text="game.name"></h2>
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
        <div class="column" v-if="isPrivate">
          <div class="field">
            <label class="label">Access Key</label>
            <div class="control">
              <input v-model="formData.accessKey" class="input" type="text">
            </div>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <a v-on:click="joinGame()" class="button is-large is-primary">Join Game</a>
        </div>
      </div>
    </div>
    <button v-on:click="closePopup()" class="modal-close is-large" aria-label="close"></button>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import { VueEvent } from '../utils/event'

  export default {
    mounted () {
      this.resetData()
      VueEvent.on('modal-open-join-game', (game:object) => {
        this.modalOpen = true
        this.game = game
      });
    },
    data() {
      return {
        modalOpen: false,
        game: {},
        formData: {}
      }
    },
    methods: {
      resetData() {
        this.modalOpen = false
        this.game = {}
        this.formData = {
          playerName: 'Chaos_Servant',
          accessKey: ''
        }
      },
      closePopup() {
        this.resetData()
      },
      joinGame() {
        axios.post('/api/game/join', { 
          gameId: this.game.id,
          playerName: this.formData.playerName,
          accessKey: this.formData.accessKey
        }).then(res => {
          if (res.data.success) {
            this.$parent.updatePlayerData({
              id: res.data.playerId,
              name: this.formData.playerName,
              gameId: this.game.id
            })
            this.$router.push(`/games/${this.game.id}`)
          } else {
            VueEvent.fire('modal-open-error', { 
              title: res.data.title,
              message: res.data.message
            })
          }
          this.closePopup()
        })
      }
    },
    computed: {
      isPrivate() {
        return this.game.access === 'private'
      }
    }
  }
</script>

<style lang="stylus" scoped>
  
</style>
