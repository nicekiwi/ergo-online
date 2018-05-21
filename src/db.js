const Loki = require('lokijs');

const database = new Loki('ergo.db');

let userCollection = database.addCollection('users');
let gameCollection = database.addCollection('games');

module.exports = {
    database, userCollection, gameCollection
}