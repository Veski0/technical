// NOTE: Exports a function that takes the path of a file to be read and counted
// NOTE: and returns a Promise that writes a file and resolves a counted object.
module.exports = (reference, tokens, flags) => new Promise((resolve, _reject) => {
  // NOTE: Recurse through tokens checking that they are middle names.
  // NOTE: Defined as a closure over tokens.
  const recurse = (index, name) => {
    if (reference.first.indexOf(tokens[index]) > -1) {
      name.push(tokens[index])
      recurse(index + 1, name)
    } else if (reference.last.indexOf(tokens[index]) > -1) {
      name.push(tokens[index])
      return index
    } else return index - 1
  }
  console.log(`Counting names on target.`)
  const names = []
  for (let i = 0; i < tokens.length; i++) {
    if (i % 25000 === 0) console.log(`${((i/tokens.length) * 100).toFixed(0)}%`)
    // NOTE: Find, catalogue and remove names beginning with a title.
    // NOTE: There is a lot of code repeated here, and there are other more effective
    // NOTE: methods for executing these checks, however this is quite readable.
    if (reference.title.indexOf(tokens[i]) > -1) {
      const name = [tokens[i]]
      if (reference.first.indexOf(tokens[i + 1]) > -1) {
        name.push(tokens[i + 1])
        recurse(i + 2, name)
        tokens.splice(i, name.length)
        names.push(name)
      } else if (reference.last.indexOf(tokens[i + 1]) > -1) {
        name.push(tokens[i + 1])
        tokens.splice(i, name.length)
        names.push(name)
      } else {
        tokens.splice(i, name.length)
      }
    // NOTE: Find, catalogue and remove names beginning with a first name.
    } else if (reference.first.indexOf(tokens[i]) > -1) {
      const name = [tokens[i]]
      if (reference.first.indexOf(tokens[i + 1]) > -1) {
        name.push(tokens[i + 1])
        recurse(i + 2, name)
        tokens.splice(i, name.length)
        names.push(name)
      } else if (reference.last.indexOf(tokens[i + 1]) > -1) {
        name.push(tokens[i + 1])
        tokens.splice(i, name.length)
        names.push(name)
      } else {
        tokens.splice(i, name.length)
        names.push(name)
      }
    // NOTE: Find, catalogue and remove names beginning with a last name.
    // NOTE: This is only available when the 'last' flag is on.
    } else if (flags.last && reference.last.indexOf(tokens[i]) > -1) {
      const name = [tokens[i]]
      tokens.splice(i, name.length)
      names.push(name)
    }
  }
  console.log(`100%\nCounting complete.`)
  // NOTE: This object is capable of cataloguing names.
  const counted = {
    _arr: [],
    submit: function (name) {
      for (const entry of this._arr) {
        if (entry.name === name.join(' ')) {
          entry.count++
          return
        }
      }
      this._arr.push({ name: name.join(' '), count: 1 })
    },
    read: function () { return this._arr }
  }
  for (const entry of names) counted.submit(entry)
  resolve(counted)
})
