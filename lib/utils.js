import { mongo } from './mongo.js'

export async function fetch (id, options) {
  await mongo.connect(options)
  return mongo.findOne({ id }).then(_result => {
    if (!_result) {
      return mongo.findOne({ free: true }).then(result => {
        return mongo.updateOne({ _id: result._id }, { $set: { id, free: false } })
          .then(() => result)
      })
    } else return _result
  }).then(result => {
    mongo.close()
    return result
  })
}

fetch('10sadwdasda').then(res => {
  console.log(res)
  console.log('done')
})
