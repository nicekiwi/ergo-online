
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const cors = require('@koa/cors')
const port = process.env.PORT || 3000

const app = new Koa()
const router = new Router()

const gameController = require('./src/controllers/game')

router.get('/games/list', gameController.listGames)
router.post('/games/new', gameController.newGame)
router.post('/game/join', gameController.joinGame)
router.post('/game/data', gameController.getData)

router.post('/game/connect', gameController.playerConnect)
router.post('/game/leave', gameController.leaveGame)
router.post('/game/start', gameController.startGame)

app
  .use(cors())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(port, event => {
  console.log(`Listening on http://localhost:${port}`)
})
