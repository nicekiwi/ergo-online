const db = require('./db');
const generate = require('nanoid/generate');
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-';

let gameStructure = {

  listGames(ctx, next) {
    ctx.body = JSON.stringify(db.gameCollection.find({ visibility: 'public' }));
  },

  createGame(ctx, next) {

    let gameId = generate(alphabet, 12), 
        playerId = ctx.body.playerId, 
        playerName = ctx.body.playerName || 'Harry';

    db.gameCollection.insert({ 
      id: gameId,
      owner: playerName,
      started: false,
      settings: {
        name: 'Game 1',
        visibility: 'public', 
        players: 4,
        turnLimit: 90
      },
      players: [{ 
        id: playerName, 
        name: playerName 
      }]
    });
    
    ctx.body = JSON.stringify({ id: gameId })
  },

  joinGame(ctx, next) {
    let playerId = ctx.params.playerId || generate(alphabet, 20);
    let gameId = ctx.params.gameId;
    let game = db.gameCollection.find({ id: gameId });

    let hasPlayer = id => {
      return game.players.find(x => x.id === id);
    }

    let isFull = () => {
      return game.players.length === game.settings.players
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
    else if(game.players.length === game.settings.players && !hasPlayer(playerId)) {
      ctx.body = JSON.stringify({ success: false, message: 'Game is full.' });
    }
    else if (game.players.length < game.settings.players && !hasPlayer(playerId)) {
      ctx.body = JSON.stringify({ success: true, message: 'You may join this game.' });
    }
    else if (hasPlayer(playerId)) {
      ctx.body = JSON.stringify({ success: true, message: 'You are in this game.' });
    }
    else {
      ctx.body = JSON.stringify({ success: false, message: 'How did you get here?' });
    }
  }
}

module.exports = gameStructure