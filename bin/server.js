const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const logger = require("koa-logger")
const Router = require('koa-router')
const cors = require('@koa/cors')
const serve = require('koa-static')
const PORT = process.env.PORT || 3000

const app = new Koa()
const router = new Router()
const server = require("http").createServer(app.callback())
const io = require("socket.io")(server)

const gameController = require('../src/controllers/game')

io.on('connection', socket => {

  console.log('a user connected')

  socket.on('connect', payload => {
    gameController.playerConnect(socket, io)
  })

  socket.on('request-games', payload => {
    // start broudcasting games to a user
    gameController.broudcastGames(socket, io)
  })

  // socket.on('request-game-data', payload => {
  //   // start broudcasting games to a user
  //   gameController.broudcastGames(socket, io)
  // })



  
})

router.get('/api/games/list', gameController.listGames)
router.post('/api/games/new', gameController.newGame)
router.post('/api/game/join', gameController.joinGame)
router.post('/api/game/data', gameController.getData)

router.post('/api/game/connect', gameController.playerConnect)
router.post('/api/game/leave', gameController.leaveGame)
router.post('/api/game/start', gameController.startGame)

router.get('*', gameController.spaFallback)

app
  .use(logger())
  .use(cors())
  .use(bodyParser())
  .use(serve('public'))
  .use(router.routes())
  .use(router.allowedMethods())

server.listen(PORT, event => {
  console.log(`Listening on http://localhost:${PORT}`)
})
