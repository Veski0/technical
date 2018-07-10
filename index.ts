const Promise = require('es6-promise')
const homogenize = require('./lib/homogenize.ts')
const countNames = require('./lib/count-names.ts')
const fs = require('fs')
const createServer = require('./router/server.ts')
const api = require('./router/lib/api.ts')

const TARGET = './src/oliver-twist.txt'
const PORT = process.env.PORT || 3000

// NOTE: Returns a Promise that resolves a utf8 string from a destination file path.
const read = filename => new Promise((resolve, reject) => {
  fs.readFile(filename, 'utf8', (err, file) => err ? reject(err) : resolve(file))
})

const fileIO = [
  read('./src/titles.txt'),
  read('./src/first-names.txt'),
  read('./src/last-names.txt'),
  read(TARGET)
]

Promise.all(fileIO)
  .then(files => {
    const [t, f, l, target] = files
    homogenize(target, t)
    .then(tokens => {
      countNames({ title: t.split('\n'), first: f.split('\n'), last: l.split('\n') }, tokens, { last: process.argv.indexOf('last') > -1 })
      .then(counted => {
        const arr = counted.read()
        const print = []
        arr.map((v, i) => { print.push(`${arr[i].name}: ${arr[i].count}`) })
        fs.writeFile('./out/output.txt', print.join(`\n`), (err) => {
          if (err) return console.log(err)
          console.log(`Output was written to './out/output.txt'.`)
          const app = createServer()
          app.get('/name-count', api(counted.read()))
          app.get('*', (_req, res) => res.json({ msg: '404' }))
          app.listen(PORT, () => { console.log(`Technical test server coming online, listening for web traffic on port ${PORT}.`) })
        })
      }).catch(err => console.log(`Technical test encountered a fatal error counting names. more information: ${JSON.stringify(err)}`))
    }).catch(err => console.log(`Technical test encountered a fatal error homogenizing target. more information: ${JSON.stringify(err)}`))
  }).catch(err => console.log(`Technical test encountered a fatal error reading files. more information: ${JSON.stringify(err)}`))
