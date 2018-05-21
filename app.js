
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');

const generate = require('nanoid/generate');
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-';

const app = new Koa();
const router = new Router();

const gameStructure = require('./src/game-structure');

router.get('/games/list', gameStructure.listGames);
router.post('/games/new', gameStructure.createGame);

router.get('/games/join/:gameId/:playerId', gameStructure.joinGame);

router.post('/user/create', (ctx, next) => {
  let userName = ctx.body.name;

  

  // Make sure not to create existing user
  // if (users.findOne({ name: userName })) {
  //   ctx.body = JSON.stringify({ success: false, message: 'Username already exists.' });
  //   return;
  // }

  // let userId = generate(alphabet, 24);
  // let userKey = generate(alphabet, 8);
  // let userKeyHash = bcrypt.hashSync(userKey);
  // users.insert({ id: userId, name : ctx.body.name, key: userKeyHash });
  // ctx.body = JSON.stringify({ id: userId, key: userKey });
});

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);