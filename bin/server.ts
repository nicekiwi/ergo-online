import * as Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import logger from "koa-logger"
import Router from 'koa-router'
import cors from '@koa/cors'
import * as serve from 'koa-static'
import socketio from 'socket.io'
import * as http from 'http'

const PORT = process.env.PORT || 3000

const app = new Koa()
const router = new Router()

const server = http.createServer(app.callback())
const io = socketio(server)

import gameController from '../src/controllers/game';

io.on('connection', socket => {

  // start broudcasting games to a user
  gameController.broudcastGames(socket, io)

  console.log('a user connected')
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
