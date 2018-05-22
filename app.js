
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const cors = require('@koa/cors');

const generate = require('nanoid/generate');
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-';

const app = new Koa();
const router = new Router();

const gameStructure = require('./src/game-structure');

router.get('/games/list', gameStructure.listGames);
router.post('/games/new', gameStructure.newGame);
router.post('/game/join', gameStructure.joinGame);

app
  .use(cors())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);