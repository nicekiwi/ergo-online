<template>
  <div>
    <a class="button is-link" v-on:click="openNewGameModal()">New Game</a>
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Host</th>
          <th>Players</th>
          <th>Access</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(game, index) in games" :key=index>
          <td>{{ game.name }}</td>
          <td>{{ game.host.name }}</td>
          <td>{{ game.players }}/{{ game.maxPlayers }}</td>
          <td>{{ isPrivate(game.access) ? 'Private' : 'Public' }}</td>
          <td>{{ game.hasStarted ? 'In Progress' : 'Open' }}</td>
          <td>
            <a v-if="!game.hasStarted" class="button is-small is-link is-outlined" v-on:click="openJoinGameModal(game)">Join</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import { VueEvent } from '../utils/event'

  export default {
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
      openNewGameModal() {
        VueEvent.fire('modal-open-new-game')
      },
      isPrivate(access) {
        return access === 'private'
      }
    }
  }
</script>

<style lang="styl" scoped>
  
</style>
