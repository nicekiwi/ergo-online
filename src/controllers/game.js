const db = require('../db');
const generate = require('nanoid/generate');
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';

let hasPlayer = (game, id) => {
  return game.players.find(x => x.id === id);
}

let isFull = game => {
  return game.players.length === game.settings.maxPlayers
}

let gameStructure = {

  // When a player connects to the app
  playerConnect(ctx, next) {
    let body = ctx.request.body
    let playerId = body.playerId
    let gameId = body.gameId
    let game = db.gameCollection.findOne({ id: gameId })

    // check the game exists, hasn't ended and the player is in it
    if (game && !game.hasEnded && hasPlayer(game, playerId)) {
      ctx.body = {
        success: true
      }
    } else {
      ctx.body = {
        success: false
      }
    }
  },

  listGames(ctx, next) {
    let games = db.gameCollection.find({ 
      'settings.visibility': 'public', 
      hasStarted: false 
    });

    let sanitisedGames = []

    games.forEach(game => {
      sanitisedGames.push({
        id: game.id,
        name: game.name,
        ownerName: game.owner.name,
        players: game.players.length,
        maxPlayers: game.settings.maxPlayers
      })
    })

    ctx.body = JSON.stringify(sanitisedGames)
  },

  newGame(ctx, next) {

    let body = ctx.request.body,
        gameId = generate(alphabet, 12), 
        playerId = generate(alphabet, 20);

    db.gameCollection.insert({ 
      id: gameId,
      name: body.gameName,
      owner: {
        id: playerId,
        name: body.playerName
      },
      hasStarted: false,
      hasEnded: false,
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

  startGame(ctx, next) {

    let body = ctx.request.body;
    let playerId = body.playerId;
    let gameId = body.gameId;
    let game = db.gameCollection.findOne({ id: gameId });

    if (playerId === game.owner.id) {

      game.hasStarted = true
      db.gameCollection.update(game)

      ctx.body = JSON.stringify({ success: true })
    } else {
      ctx.body = JSON.stringify({ success: false })
    }
  },

  joinGame(ctx, next) {

    let body = ctx.request.body;
    let playerId = generate(alphabet, 20);
    let playerName = body.playerName;
    let gameId = body.gameId;
    let game = db.gameCollection.findOne({ id: gameId });

    if(!game) {
      ctx.body = JSON.stringify({ 
        success: false, 
        title: 'Game not found', 
        message: 'Awkward, we can\'t find this game.' 
      })
    } else if(isFull(game) && !hasPlayer(game, playerId)) {
      ctx.body = JSON.stringify({ 
        success: false, 
        title: 'Game is full', 
        message: 'Awkward, this game is full.' 
      })
    } else if (!isFull(game) && !hasPlayer(game, playerId)) {
      // Add player to game
      game.players.push({ id: playerId, name: playerName })
      db.gameCollection.update(game)
      ctx.body = JSON.stringify({ success: true });
    } else {
      ctx.body = JSON.stringify({ 
        success: false, 
        title: 'How the hell did you get here?', 
        message: 'Seriously, you should not have been able to reach this point.' 
      })
    }
  },

  getData(ctx, next) {
    let body = ctx.request.body;
    let game = db.gameCollection.findOne({ id: body.gameId, hasEnded: false });

    if(game && hasPlayer(game, body.playerId)) {

      let sanitisedData = {
        id: body.gameId,
        name: game.name,
        ownerName: game.owner.name,
        hasStarted: game.hasStarted,
        players: []
      }

      game.players.forEach(player => {
        sanitisedData.players.push({ name: player.name })
      })

      if (body.playerId === game.owner.id) {
        sanitisedData.ownerId = game.owner.id
      }

      ctx.body = JSON.stringify({ success: true, data: sanitisedData });
    } else {
      ctx.body = JSON.stringify({ success: false })
    }
  },

  leaveGame(ctx, next) {
    let body = ctx.request.body
    let game = db.gameCollection.findOne({ id: body.gameId })
    
    game.players.splice(game.players.findIndex(x => x.id === body.playerId), 1)
    db.gameCollection.update(game)

    if(!hasPlayer(game, body.playerId)) {

      // if player was the only one left, remove the game
      if (!game.players.length) {
        db.gameCollection.remove(game)
      }

      ctx.body = JSON.stringify({ success: true })
    } else {
      ctx.body = JSON.stringify({ success: false })
    }
  }
}

module.exports = gameStructure