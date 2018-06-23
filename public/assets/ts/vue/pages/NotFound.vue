<template>
  <div>
    Page not found
  </div>
</template>

<script lang="ts">
  import { VueEvent } from '../utils/event'

  export default {
    mounted() {
      if (!this.$parent.isLoaded) {
        VueEvent.on('app-ready', this.init)
      } else {
        this.init()
      }
    },
    methods: {
      init() {
        if (this.$parent.player.gameId) {
          this.$router.push(`/games/${this.$parent.player.gameId}`)
        }
      }
    }
  }
</script>

<style lang="styl" scoped>
  
</style>
