const createServer = require('./router/server.ts')
const api = require('./router/lib/api.ts')
const fs = require('fs')
const Promise = require('es6-promise')

// NOTE: The file to be read and counted. This can be changed here.
const FILENAME = './src/oliver-twist.txt'
const PORT = process.env.PORT || 3000

// NOTE: Returns a Promise that resolves a utf8 string from a destination file path.
const read = filename => new Promise((resolve, reject) => {
  fs.readFile(filename, 'utf8', (err, file) => err ? reject(err) : resolve(file))
})

// NOTE: Takes a string and returns a homogenized mutation of that string.
const homogenize = str => {
  // NOTE: Remove non-alphabetical characters.
  const remove = str.replace(/[^a-zA-Z\n\r\s.,!?"'()*]/g, '')
  // NOTE: Mutate all name-dividing grammar markers into exclamation marks to
  // NOTE: differentiate them from full stops which can occur between a title and last name.
  const mutate = remove.replace(/[,!?"'()*]/g, '!')
  // NOTE: Homogenize whitespace.
  const whitespace = mutate.replace(/[\n\r\s]+/g, ' ')
  return whitespace
}

// NOTE: There is no string splice function and a slice-slice is faster than a
// NOTE: split followed by a join.
const spliceSlice = (str, index, count, add) => {
  if (index < 0) {
    index = str.length + index
    if (index < 0) index = 0
  }
  return str.slice(0, index) + (add || '') + str.slice(index + count)
}

// NOTE: Takes the path of a file to be read and counted. Writes a new file to
// NOTE: the lib directory called 'output.txt' and returns a counted object.
const countNames = (file, reference) => new Promise((resolve, reject) => {
  read(file)
  .then(str => {
    let text = homogenize(str)
    for (let i = 0; i < reference.title.length; i++) {
      console.log(`looking for ${reference.title[i]}`)
      let match = text.indexOf(reference.title[i])
      while (match > -1) {
        console.log(match)
        text = spliceSlice(text, match, reference.title[i].length, '')
        match = text.indexOf(reference.title[i])
      }
    }
    resolve({
      chars: str.length,
      words: text
    })
  })
  .catch(err => reject(err))
})

console.log('technical test starting')

const fileIO = [
  read('./src/titles.txt'),
  read('./src/first-names.txt'),
  read('./src/last-names.txt')
]

Promise.all(fileIO)
  .then(files => {
    const [t, f, l] = files
    const reference = { title: t.split('\n'), first: f.split('\n'), last: l.split('\n') }

    console.log(`loaded ${reference.title.length} titles, ${reference.first.length} first names and ${reference.last.length} last names, for ${reference.title.length + reference.first.length + reference.last.length} total entries`)
    console.log(`commencing count for file '${FILENAME}'`)

    countNames(FILENAME, reference)
    .then(counted => {
      console.log(counted)

      const app = createServer()
      app.get('/name-count', api(counted))
      app.get('*', (_req, res) => res.json({ msg: 'this has worked' }))
      app.listen(PORT, () => { console.log(`technical test server coming online, listening for web traffic on port ${PORT}`); })
    })
    .catch(err => console.log(err))
  }).catch(err => console.log(err))
