let GameActivePage = Vue.component('GameActivePage', {
    mounted() {
        if (!this.$parent.isLoaded) {
            VueEvent.on('app-ready', this.init)
        } else {
            this.init()
        }
    },
    data: function () {
        return {
            game: {}
        }
    },
    watch: {
        '$route': 'init'
    },
    methods: {
        init() {
            if (this.$parent.player.gameId === null) {
                this.$router.push(`/`)
            } else if (this.$parent.player.gameId !== this.$route.params.gameId) {
                this.$router.push(`/${this.$parent.player.gameId}`)
            } else {
                axios.post(`/game/data`, {
                    gameId: this.$parent.player.gameId,
                    playerId: this.$parent.player.id
                }).then(res => {
                    if (res.data.success) {
                        this.game = res.data.data
                    } else {
                        this.$parent.updatePlayerData(null)
                        this.$router.push('/')
                    }
                })
            }
        },
        leaveGame() {
            axios.post(`/game/leave`, {
                gameId: this.$parent.player.gameId,
                playerId: this.$parent.player.id
            }).then(res => {
                this.$parent.updatePlayerData(null)
                this.$router.push('/')
            })
        },
        startGame() {
            axios.post(`/game/start`, {
                gameId: this.$parent.player.gameId,
                playerId: this.$parent.player.id
            }).then(res => {
                if (res.data.success) {
                    this.game = res.data.data
                } else {
                    VueEvent.fire('modal-open-error', { 
                        title: res.data.title,
                        message: res.data.message
                    })
                }
            })
        }
    },
    computed: {
        isOwner() {
            return this.game.ownerId && (this.game.ownerId === this.$parent.player.id)
        }
    },
    template: `
    <div class="content">
        <h1 class="title" v-text="game.name"></h1>
        <h2 class="subtitle">{{ game.ownerName }}'s game</h2>

        <a class="button is-danger" v-on:click="leaveGame()">Leave Game</a>

        <div v-if="game.hasStarted">
            <p>Game Started</p>
        </div>
        <div v-else>
            <h3>Players: </h3>
            <ul>
                <li v-for="(player, index) in game.players" :key=index v-text=player.name></li>
            </ul>

            <a class="button is-link" v-if="isOwner" v-on:click="startGame()">Start Game</a>
        </div>
    </div>
  `
});