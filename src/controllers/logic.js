const db = require('../db')

Array.prototype.shuffle = function () {
  var m = this.length;
  while (m) {
    let i = Math.floor(Math.random() * m--);
    [this[m], this[i]] = [this[i], this[m]];
  }
  return this;
}

let defaults = {
  cards: {
    total: 55,
    variables: {
      a: {
        name: 'a',
        value: undefined,
        count: 4
      },
      b: {
        name: 'b',
        value: undefined,
        count: 4
      },
      c: {
        name: 'c',
        value: undefined,
        count: 4
      },
      d: {
        name: 'd',
        value: undefined,
        count: 4
      }
    },
    operators: {
      or: { name: 'V', count: 4 },
      and: { name: '.', count: 4 },
      then: { name: '>', count: 4 }
    },
    special: {
      not: { name: '~', count: 6 },
      parenthesis: { name: '(', count: 8 },
      fallacy: { name: 'o', count: 3 },
      justification: { name: 'x', count: 3 },
      tabulaRasa: { name: '-', count: 1 },
      revolution: { name: '<->', count: 1 },
      wildVariable: { name: 'V.>', count: 1 },
      wildOperator: { name: 'ABCD', count: 1 },
      ergo: { name: '...', count: 3 }
    }
  },
  premise: {
    active: 0,
    total: 4
  },
  players: {
    minimum: 2,
    maximum: 4,
    total: 0
  }
}

let Player = function (player, variable) {
  this.id = player.id;
  this.name = player.name;
  this.variable = variable;
  this.score = 0;
  this.roundsWon = 0;
  this.cards = [];
};

let Card = function (name, label) {
  this.name = name;
  this.label = label;
  this.premise = null
  this.position = 0;
  this.player = null;
};

let buildDeck = function() {

  let deck = [];
  let cards = defaults.cards

  Object.keys(cards.variables).forEach(function(key) {
    let obj = cards.variables[key];
    for (let i=0;i<obj.count;i++) { deck.push(new Card(key, obj.name)) }
  });

  Object.keys(cards.operators).forEach(function(key) {
    let obj = cards.operators[key];
    for (let i=0;i<obj.count;i++) { deck.push(new Card(key, obj.name)) }
  });

  Object.keys(cards.special).forEach(function(key) {
    let obj = cards.special[key];
    for (let i=0;i<obj.count;i++) { deck.push(new Card(key, obj.name)) }
  });

  return deck;
};

let Game = function (round) {

  let playerVariables = ['a','b','c','d'].shuffle();

  this.deck = buildDeck().shuffle();
  this.drawPile = [];
  this.discardPile = []
  this.players = [];
  this.round = 1;

  this.options = {
    playOrder: 0, // 0 = Clockwise, 1 = Anti-Clockwise
  };

  this.premises = {
    count: 0,
    active: 0
  }

  this.proof = {
    valid: false
  }

  this.addPlayer = function (player, letter) {
    this.players.push(new Player(player, letter));
  }

  this.addPlayers = function (players) {
    for (let i=0;i<players.length;i++) {
      this.addPlayer(players[i], playerVariables[i]);
    }
  }

  this.dealCards = function () {

    // deal to players
    for (let i=0;i<this.players.length;i++) {
      for (let c=0;c<5;c++) {
        this.deck[0].player = this.players[i].id
        this.players[i].cards.push(this.deck[0]);
        this.deck.shift();
      }
    }

    // deal to draw pile
    for (let i=0;i<this.deck.length;i++) {
      this.drawPile.push(this.deck[i]);
    }

    // clear deck
    this.deck = [];
  }

  this.drawCards = function(player) {
    player.cards.push(this.drawPile.shift())
    player.cards.push(this.drawPile.shift())
  }

  // this.disgardCards = function(player, cardInexOne, cardIndexTwo) {
  //   player.cards.push(this.deck.shift())
  //   player.cards.push(this.deck.shift())
  //   return player
  // }

};

let gameLogic = {

  initGame(gameId) {

    let dbGame = db.gameCollection.findOne({ id: gameId })
    let dbPlayers = dbGame.players;

    let gameObject = new Game()

    gameObject.addPlayers(dbPlayers);
    gameObject.dealCards();

    dbGame.logic.drawPile = gameObject.drawPile
    dbGame.logic.discardPile = gameObject.discardPile

    dbGame.players = gameObject.players

    // Update game
    db.gameCollection.update(dbGame)
    
    console.log(dbGame.players)

  }

}

module.exports = gameLogic