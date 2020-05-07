#!/usr/bin/env node

import * as repl from 'repl'
import { mongo } from './mongo.js'

const collectionName = process.argv[2] || 'documents'
mongo.connect({ collectionName: collectionName, loglvl: 1 })

const help = {
  insert: 'insert documents',
  insertOne: 'insert 1 document',
  find: 'find documents',
  findOne: 'find the first matching document',
  delete: 'delete documents',
  deleteOne: 'delete the first matching document',
  update: 'update documents',
  updateOne: 'update the first matching document'
}

const r = repl.start({
  prompt: 'm > ',
  input: process.stdin,
  output: process.stdout,
  // terminal
  useColors: true,
  useGlobal: false,
  ignoreUndefined: false,
  // completer: tabCompletion function
  replMode: repl.REPL_MODE_SLOPPY, // not `use-strict`
  breakEvalOnSigint: false,
  preview: true
})
mongo.log = function (lvl, ...args) {
  if (this.loglvl >= lvl) {
    console.log(...args)
    r.displayPrompt()
  }
}
r.context.mongo = mongo
r.on('exit', () => {
  mongo.close()
  setTimeout(() => process.exit(0), 10)
})

for (const key in mongo) {
  if (typeof mongo[key] === 'function') {
    r.context[key] = mongo[key]
    r.defineCommand(key, { help: help[key], action () { mongo[key](); r.displayPrompt() } })
  }
}

console.log('collection: ' + collectionName)
r.displayPrompt()
