import { mongo } from './mongo.js'

export async function fetch (id, options) {
  await mongo.connect(options)
  return mongo.findOne({ id }).then(_result => {
    if (!_result) {
      return mongo.findOneAndUpdate({ free: true }, { $set: { id, free: false } })
        .then((result) => result.value)
    } else return _result
  }).then(result => {
    mongo.close()
    return result
  }).catch((err) => { throw err })
}
