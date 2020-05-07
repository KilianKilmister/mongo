#!/usr/bin/env node

import mongodb from 'mongodb'
import assert from 'assert'
import chalk from 'chalk'

export class Mongo {
  constructor (options = {}) {
    this.defaults = options
    this.loglvl = 0
    this.dbName = 'serverDevDB'
    this.url = 'mongodb://localhost:27017'
    this.config = { useNewUrlParser: true, useUnifiedTopology: true }
    this.collectionName = 'documents'
  }

  async insert (docs) {
    if (!docs) throw new Error('nothing to insert in DB')
    return this.collection.insertMany(docs).then(result => {
      // check results
      assert.strictEqual(docs.length, result.result.n)
      assert.strictEqual(docs.length, result.ops.length)
      /* log */ this.log(1, chalk`{yellow Inserted ${result.insertedCount} documents into "${this.collectionName}"}`)
      /* log */ this.log(2, result.ops)
    })
  }

  async insertOne (docs) {
    if (!docs) throw new Error('nothing to insert in DB')
    return this.collection.insertOne(docs).then(result => {
      // check results
      assert.strictEqual(docs.length, result.result.n)
      assert.strictEqual(docs.length, result.ops.length)
      /* log */ this.log(1, chalk`{yellow Inserted ${result.insertedCount} documents into "${this.collectionName}"}`)
      /* log */ this.log(2, result.ops)
    })
  }

  async find (query = {}) {
    return this.collection.find(query).toArray().then(result => {
      /* log */ this.log(1, chalk`{yellow Found ${result.length} documents in "${this.collectionName}"}`)
      /* log */ this.log(2, result)
      return result
    })
  }

  async findOne (query = {}) {
    return this.collection.findOne(query).then(result => {
      /* log */ this.log(1, chalk`{yellow Found a document in "${this.collectionName}"}`)
      /* log */ this.log(2, result)
      return result
    })
  }

  async delete (query) {
    if (!query) throw new Error('missing query for deletion')
    return this.collection.deleteMany(query).then(result => {
      /* log */ this.log(1, chalk`{yellow deleted ${result.deletedCount} documents in "${this.collectionName}"}`)
      /* log */ this.log(2, result.result)
      return result
    })
  }

  async deleteOne (query) {
    if (!query) throw new Error('missing query for deletion')
    return this.collection.deleteOne(query).then(result => {
      /* log */ this.log(1, chalk`{yellow deleted ${result.deletedCount} documents in "${this.collectionName}"}`)
      /* log */ this.log(2, result.result)
      return result
    })
  }

  async update (query, edit) {
    if (!query) throw new Error('missing query for update')
    if (!query) throw new Error('missing edit for update')
    return this.collection.updateMany(query, edit).then(result => {
      /* log */ this.log(1, chalk`{yellow updated ${result.modifiedCount} documents in "${this.collectionName}"}`)
      /* log */ this.log(2, result.result)
      return result
    })
  }

  async updateOne (query, edit) {
    if (!query) throw new Error('missing query for update')
    if (!query) throw new Error('missing edit for update')
    return this.collection.updateOne(query, edit).then(result => {
      /* log */ this.log(1, chalk`{yellow updated a document in "${this.collectionName}"}`)
      /* log */ this.log(2, result.result)
      return result
    })
  }

  async findOneAndUpdate (query, edit) {
    if (!query) throw new Error('missing query for update')
    if (!query) throw new Error('missing edit for update')
    return this.collection.findOneAndUpdate(query, edit, { returnNewDocument: true }).then(result => {
      /* log */ this.log(1, chalk`{yellow updated ${result.modifiedCount} documents in "${this.collectionName}"}`)
      /* log */ this.log(2, result.result)
      return result
    })
  }

  async findOneAndReplace (query, replacement) {
    if (!query) throw new Error('missing query for update')
    if (!query) throw new Error('missing edit for update')
    return this.collection.findOneAndReplace(query, replacement).then(result => {
      /* log */ this.log(1, chalk`{yellow updated a document in "${this.collectionName}"}`)
      /* log */ this.log(2, result.result)
      return result
    })
  }

  async findOneAndDelete (query) {
    if (!query) throw new Error('missing query for update')
    if (!query) throw new Error('missing edit for update')
    return this.collection.findOneAndDelete(query).then(result => {
      /* log */ this.log(1, chalk`{yellow updated a document in "${this.collectionName}"}`)
      /* log */ this.log(2, result.result)
      return result
    })
  }

  log (lvl, ...args) {
    if (this.loglvl >= lvl) console.log(...args)
  }

  settings (options) { for (const key in options) { this[key] = options[key] || this[key] || this.defaults[key] } }
  async close () { await this.client.close(); /* log */this.log(1, chalk`{gray Connection closed}`) }
  async connect (options = {}) {
    this.settings(options)
    return mongodb.MongoClient.connect(this.url, this.config).then(client => {
      /* log */ this.log(1, chalk`{gray Connected successfully to server}`)
      this.client = client
      this.db = client.db(this.dbName)
      this.collection = this.db.collection(this.collectionName)
      return client
    })
  }
}

export const mongo = new Mongo({
  loglvl: 0,
  dbName: 'serverDevDB',
  url: 'mongodb://localhost:27017',
  config: { useNewUrlParser: true, useUnifiedTopology: true },
  collectionName: 'documents'
})
