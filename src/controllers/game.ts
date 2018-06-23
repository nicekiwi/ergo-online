import fs = require('fs');
import db = require('../config/db');
//import logicController = require('./logic');
import generate = require('nanoid/generate');

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
const passabet = '0123456789'

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
    let games = db.gameCollection.find();
    let sanitisedGames = []

    games.forEach(game => {
      sanitisedGames.push({
        id: game.id,
        name: game.name,
        access: game.settings.access,
        players: game.players.length,
        hostName: game.host.name,
        maxPlayers: game.settings.maxPlayers,
        hasStarted: game.hasStarted
      })
    })

    ctx.body = JSON.stringify(sanitisedGames)
  },

  broudcastGames(socket, io) {
    let games = db.gameCollection.find();
    let sanitisedGames = []

    games.forEach(game => {
      sanitisedGames.push({
        id: game.id,
        name: game.name,
        access: game.settings.access,
        players: game.players.length,
        hostName: game.host.name,
        maxPlayers: game.settings.maxPlayers,
        hasStarted: game.hasStarted
      })
    })

    setInterval(() => {
      io.emit('games-list-update', sanitisedGames)
    }, 3000)
  },

  newGame(ctx, next) {

    let body = ctx.request.body,
        gameId = generate(alphabet, 12), 
        playerId = generate(alphabet, 20);

    db.gameCollection.insert({ 
      id: gameId,
      name: body.gameName,
      host: {
        id: playerId,
        name: body.playerName
      },
      hasStarted: false,
      hasEnded: false,
      settings: {
        access: body.access,
        accessKey: generate(passabet, 8),
        maxPlayers: body.maxPlayers,
        turnTimeLimit: body.turnTimeLimit,
        scoreLimit: body.scoreLimit
      },
      players: [{ 
        id: playerId, 
        name: body.playerName 
      }],
      logic: {
        drawPile: [],
        discardPile: [],
        round: 1,
        proof: { valid: false },
        premises: [
          { valid: false, cards: [] },
          { valid: false, cards: [] },
          { valid: false, cards: [] },
          { valid: false, cards: [] }
        ]
      }
    });
    
    ctx.body = JSON.stringify({ gameId, playerId })
  },

  startGame(ctx, next) {

    let body = ctx.request.body;
    let playerId = body.playerId;
    let gameId = body.gameId;
    let game = db.gameCollection.findOne({ id: gameId });

    if (playerId === game.host.id) {

      game.hasStarted = true
      db.gameCollection.update(game)

      //logicController.initGame(gameId)

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

    let hasAccess = game => {
      return game.settings.accessKey === body.accessKey
    }

    let isPrivate = game => {
      return game.settings.access === 'private'
    }

    if(!game) {
      ctx.body = JSON.stringify({ 
        success: false, 
        title: 'Game not found', 
        message: 'Awkward, we can\'t find this game.' 
      })
    } else if(isPrivate(game) && !hasAccess(game)) {
      ctx.body = JSON.stringify({ 
        success: false, 
        title: 'Incorrect Access Key', 
        message: 'Sharron, you got a lot of that wrong (means you can\'t join this game).' 
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
      ctx.body = JSON.stringify({ success: true, playerId });
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
    let game = db.gameCollection.findOne({ id: body.gameId });

    if(game && hasPlayer(game, body.playerId)) {

      let meIndex = game.players.findIndex(x => x.id === body.playerId)

      let sanitisedData = {
        id: body.gameId,
        name: game.name,
        host: { id: null, name: game.host.name },
        hasStarted: game.hasStarted,
        hasEnded: game.hasEnded,
        settings: game.settings,
        players: game.players,
        me: game.players[meIndex],
        premises: game.logic.premises
      }

      if (body.playerId === game.host.id) {
        sanitisedData.host.id = game.host.id
      } else {
        sanitisedData.players.forEach(player => player.id = null)
        sanitisedData.settings.accessKey = null
      }

      ctx.body = JSON.stringify({ success: true, game: sanitisedData });
    } else {
      ctx.body = JSON.stringify({ success: false })
    }
  },

  leaveGame(ctx, next) {
    let body = ctx.request.body
    let game = db.gameCollection.findOne({ id: body.gameId })

    // check game and player ID exists and player is in game
    if (!game || !body.playerId || !hasPlayer(game, body.playerId)) {
      ctx.body = JSON.stringify({ success: true })
    }

    // Remove game if player is the last player
    else if (game.players.length === 1) {
      db.gameCollection.remove(game)
      ctx.body = JSON.stringify({ success: true })
    }

    else {

      // get index of player
      let playerIndex = game.players.findIndex(x => x.id === body.playerId)

      // remove player from game
      game.players.splice(playerIndex, 1)

      // move game ownership to the next player at random
      game.host.id = game.players[0].id;
      game.host.name = game.players[0].name;
      db.gameCollection.update(game);

      // verify the removal actually worked
      if (!hasPlayer(game, body.playerId)) {
        ctx.body = JSON.stringify({ success: true })
      } else {
        ctx.body = JSON.stringify({ success: false })
      }
    }
  },

  spaFallback: async (ctx, next) => {
    ctx.type = 'html'
    ctx.body = fs.createReadStream('public/index.html')
  }
}

export default gameStructure