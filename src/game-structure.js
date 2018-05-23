const db = require('./db');
const generate = require('nanoid/generate');
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';

let gameStructure = {

  listGames(ctx, next) {
    ctx.body = JSON.stringify(db.gameCollection.find({ 'settings.visibility': 'public', started: false }));
  },

  newGame(ctx, next) {

    let body = ctx.request.body,
        gameId = generate(alphabet, 12), 
        playerId = generate(alphabet, 20);

    db.gameCollection.insert({ 
      id: gameId,
      name: body.gameName,
      ownerId: playerId,
      started: false,
      settings: {
        visibility: body.visibility, 
        maxPlayers: body.maxPlayers,
        turnTimeLimit: body.turnTimeLimit,
        scoreLimit: body.scoreLimit
      },
      players: [{ 
        id: playerId, 
        name: body.playerName 
      }]
    });
    
    ctx.body = JSON.stringify({ gameId, playerId })
  },

  joinGame(ctx, next) {

    let body = ctx.request.body;
    let playerId = body.playerId;
    let gameId = body.gameId;
    let game = db.gameCollection.findOne({ id: gameId });

    let hasPlayer = id => {
      return game.players.find(x => x.id === id);
    }

    let isFull = () => {
      return game.players.length === game.settings.maxPlayers
    }

    // // join game with invalid gameID
    // if (!gameId || !game) {
    //   ctx.body = JSON.stringify({ success: false, message: 'Game not found.' });
    // } else {

    //   let players = game.players.length;
    //   let maxPlayers = game.settings.players;

    //   // join game when you have never been in the game
    //   if (isFull()) {

    //   }


    // }

    

    // join game when you disconnected or rejoined the game

    // join game when it is full and you have never been in it

    if(!game) {
      ctx.body = JSON.stringify({ success: false, message: 'Game not found.' });
    } 
    else if(game.players.length === game.settings.maxPlayers && !hasPlayer(playerId)) {
      ctx.body = JSON.stringify({ success: false, message: 'Game is full.' });
    }
    else if (game.players.length < game.settings.maxPlayers && !hasPlayer(playerId)) {

      game.players.push({ id: playerId })
      game.update()

      ctx.body = JSON.stringify({ success: true, message: 'You may join this game.', game });
    }
    else if (hasPlayer(playerId)) {
      ctx.body = JSON.stringify({ success: true, message: 'You are in this game.', game });
    }
    else {
      ctx.body = JSON.stringify({ success: false, message: 'How did you get here?' });
    }
  },

  addPlayer(gameId, player) {

  }
}

module.exports = gameStructure