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
    const result = await this.collection.insertMany(docs)
    // check results
    assert.strictEqual(docs.length, result.result.n)
    assert.strictEqual(docs.length, result.ops.length)
    /* log */ this.log(1, chalk`{yellow Inserted ${result.insertedCount} documents into "${this.collectionName}"}`)
    /* log */ this.log(2, result.ops)
  }

  async insertOne (docs) {
    if (!docs) throw new Error('nothing to insert in DB')
    const result = await this.collection.insertOne(docs)
    // check results
    assert.strictEqual(docs.length, result.result.n)
    assert.strictEqual(docs.length, result.ops.length)
    /* log */ this.log(1, chalk`{yellow Inserted ${result.insertedCount} documents into "${this.collectionName}"}`)
    /* log */ this.log(2, result.ops)
  }

  async find (query = {}) {
    const result = await this.collection.find(query).toArray()
    /* log */ this.log(1, chalk`{yellow Found ${result.length} documents in "${this.collectionName}"}`)
    /* log */ this.log(2, result)
    return result
  }

  async findOne (query = {}) {
    const result = await this.collection.findOne(query).toArray()
    /* log */ this.log(1, chalk`{yellow Found ${result.length} documents in "${this.collectionName}"}`)
    /* log */ this.log(2, result)
    return result
  }

  async delete (query) {
    if (!query) throw new Error('missing query for deletion')
    const result = await this.collection.deleteMany(query)
    /* log */ this.log(1, chalk`{yellow deleted ${result.deletedCount} documents in "${this.collectionName}"}`)
    /* log */ this.log(2, result.result)
    return result
  }

  async deleteOne (query) {
    if (!query) throw new Error('missing query for deletion')
    const result = await this.collection.deleteOne(query)
    /* log */ this.log(1, chalk`{yellow deleted ${result.deletedCount} documents in "${this.collectionName}"}`)
    /* log */ this.log(2, result.result)
    return result
  }

  async update (query, edit) {
    if (!query) throw new Error('missing query for update')
    if (!query) throw new Error('missing edit for update')
    const result = await this.collection.updateMany(query, edit)
    /* log */ this.log(1, chalk`{yellow updated ${result.modifiedCount} documents in "${this.collectionName}"}`)
    /* log */ this.log(2, result.result)
    return result
  }

  async updateOne (query, edit) {
    if (!query) throw new Error('missing query for update')
    if (!query) throw new Error('missing edit for update')
    const result = await this.collection.updateOne(query, edit)
    /* log */ this.log(1, chalk`{yellow updated a document in "${this.collectionName}"}`)
    /* log */ this.log(2, result.result)
    return result
  }

  log (lvl, ...args) {
    if (this.loglvl >= lvl) console.log(...args)
  }

  settings (options) { for (const key in options) { this[key] = options[key] || this[key] || this.defaults[key] } }
  async close () { await this.client.close(); /* log */this.log(1, chalk`{gray Connection closed}`) }
  async connect (options = {}) {
    this.settings(options)
    this.client = await mongodb.MongoClient.connect(this.url, this.config)
    /* log */ this.log(1, chalk`{gray Connected successfully to server}`)
    this.db = this.client.db(this.dbName)
    this.collection = this.db.collection(this.collectionName)
    return this.client
  }
}

export const mongo = new Mongo({
  loglvl: 0,
  dbName: 'serverDevDB',
  url: 'mongodb://localhost:27017',
  config: { useNewUrlParser: true, useUnifiedTopology: true },
  collectionName: 'documents'
})
