const Loki = require('lokijs');

const database = new Loki('ergo.db');

let gameCollection = database.addCollection('games', { indices: ['id'] });

module.exports = {
    database, gameCollection
}