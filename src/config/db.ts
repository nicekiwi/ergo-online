import Loki from 'lokijs'

const database = new Loki('ergo.db')
const gameCollection = database.addCollection('games', { indices: ['id'] })

export default database

export {
  gameCollection
}