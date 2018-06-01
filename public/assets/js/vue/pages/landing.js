let PageLanding = Vue.component('PageLanding', {
    mounted() {
      if (!this.$parent.isLoaded) {
        VueEvent.on('app-ready', this.init)
      } else {
        this.init()
      }
    },
    data() { return {}},
    methods: {
      init() {
        if (this.$parent.player.gameId) {
          this.$router.push(`/${this.$parent.player.gameId}`)
        }
      },
      openJoinPrivateGameModal() {
        VueEvent.fire('modal-open-join-private-game')
      }
    },
    template: `
    <div class="has-text-centered">
      <p>Pit your skill of proving your existance againt others in a bitter battle for existence or death!</p>
      <p>Okay maybe not the death part, but if you can't prove you exist.. maybe you are already dead?<br><br></p>
      <p>
        <router-link class="button is-link is-large" to="/games">Start Playing</router-link>
      </p>
      <p>
        ----------------------
      </p>
      <p>
        <a class="button is-small" v-on:click="openJoinPrivateGameModal()">Join Private Game</a>
      </p>
    </div>
  `
});