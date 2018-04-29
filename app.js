const Loki = require('lokijs');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');

const generate = require('nanoid/generate');
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-';

const app = new Koa();
const router = new Router();
const db = new Loki('ergo.db');

// Add a collection to the database
let users = db.addCollection('users');
let games = db.addCollection('games');

router.get('/games', (ctx, next) => {
  ctx.body = JSON.stringify(games.find({ type: 'public' }));
});

router.post('/games/new', (ctx, next) => {
  let gameId = generate(alphabet, 12);
  games.insert({ 
    id: gameId, 
    user: '1', 
    type: 'public', 
    maxPlayers: 4, 
    currentPlayers: 1, 
    name: 'Game 1', 
    started: false, 
    owner: ctx.body.userId 
  });
  ctx.body = JSON.stringify({ id: gameId })
});

router.post('/user/create', (ctx, next) => {
  let userId = generate(alphabet, 24);
  users.insert({ id: userId, name : ctx.body.name });
  ctx.body = JSON.stringify({ id: userId });
});

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);