let PageNotFound = Vue.component('PageNotFound', {
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
  },
  template: `
  <div>
    Page not found
  </div>
`
});