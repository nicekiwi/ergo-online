<template>
  <div class="content game-active" v-if="isLoaded">
    <div class="columns">
      <div class="column">
        <h1 class="title is-3" v-text="game.name"></h1>
        <h2 class="subtitle is-4">{{ game.host.name }}'s game</h2>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <a class="button is-danger" v-on:click="leaveGame()">Leave Game</a>
      </div>
    </div>

    <div class="columns game-settings">
      <div class="column">
        <b>Players:</b> {{ game.players.length }}/{{ game.settings.maxPlayers }}</div>
      <div class="column">
        <b>Score Limit:</b> {{ game.settings.scoreLimit }} points</div>
      <div class="column">
        <b>Turn Limit:</b> {{ game.settings.turnTimeLimit / 1000 }} seconds</div>
      <div class="column">
        <b>Access:</b> {{ game.settings.access }}</div>
    </div>
      
    <div class="columns">
      <div class="column">
        <pre v-if="game.settings.access === 'private'" v-text="game.settings.accessKey"></pre>
      </div>
    </div>

    <div class="game-started" v-if="game.hasStarted">

      <div class="columns">
        <div class="column">
          <h3>Play Area</h3>
          <div class="premises">
            <div v-for="(premise, index) in game.premises" class="premise" :key=index>
              <draggable class="draggable-area" v-model="premise.cards" :options="{group:'cards'}">
                <div class="card" v-for="(card, index1) in premise.cards" :key=index1>{{card.label}}</div>
              </draggable>
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <h3>Your Hand</h3>
          <div class="player-hand">
            <draggable class="draggable-area" v-model="game.me.cards" :options="{group:'cards'}">
              <div class="card" v-for="(card, index) in game.me.cards" :key=index>
                <b v-text="card.label"></b>
              </div>
            </draggable>
          </div>
        </div>
      </div>
    </div>
    <div class="game-waiting" v-else>
      <div class="columns">
        <div class="column">
          <h3 class="title is-5">Players Connected ({{game.players.length}}/{{game.settings.maxPlayers}})</h3>
          <ul class="player-list">
              <li v-for="(player, index) in game.players" :key=index>
                <span v-text="player.name"></span>
              </li>
          </ul>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <a :class="['button is-link is-large', { 'is-loading': isStarting }]" :disabled="isStarting" v-if="isHost" v-on:click.once="startGame()">Start Game</a>
          <a class="button is-light islarge" disabled v-else>Waiting for host to start</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import Vue from 'vue'
  import { VueEvent } from '../utils/event'

  export default Vue.extend({
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
        isLoaded: false,
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
          this.isLoaded = true
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
      isHost() {
        return this.game.host.id && (this.game.host.id === this.$parent.player.id)
      }
    }
  })
</script>

<style lang="stylus" scoped>
  .game-active {

    .draggable-area {
      width: 100%;
      min-height: 50px;
    }

    .card {
      cursor: move;
      float: left;
      padding: 10px;
      width: 45px;
      height: 50px;
      border: 1px solid #ccc;
      border-radius: 3px; 
      text-align: center;
      margin-right: 10px;
      text-transform: uppercase;
      font-size: 22px;
      line-height: 1.2;
    }

    .game-settings {
      background-color: #eee;
    }

    .game-waiting {

      h3 {
        margin-bottom: 10px;
      }

      .player-list {
        list-style: none;
        padding: 0;
        margin: 0 0 25px;

        li {
          width: 25%;
          padding: 0 5px;
          float: left;
          margin-top: 0;
          span {
            display: block;
            padding: 5px 0 8px;
            background-color: #eeeeee;
            font-size: 22px;
            text-align: center;
            color: #333;
          }
        }
      }

      .button {
        width: 100%;  
      }
    }
    
  }

  .player-hand {
    
  }

  .premises {
    width: 100%;
    border: 1px solid #ccc;
    background-color: #efefef;
    padding: 0 15px;
    overflow-x: scroll;
    
    .premise {
      width: 100%;
      height: 70px;
      padding: 10px;
      border-bottom: 3px solid #ccc;
    }
  }
</style>
