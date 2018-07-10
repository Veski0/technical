// NOTE: There is no string splice function and a slice + slice is faster than a
// NOTE: split followed by a join.
const spliceSlice = (str, index, count, add) => {
  if (index < 0) {
    index = str.length + index
    if (index < 0) index = 0
  }
  return str.slice(0, index) + (add || '') + str.slice(index + count)
}
// NOTE: Exports a function that takes a string to homogenized
// NOTE: and returns a Promise that resolves a homogenized array.
module.exports = (str, titles) => new Promise((resolve, _reject) => {
  console.log('Homogenizing target data.')
  // NOTE: Remove all trailing periods from titles to remove a class of cases.
  for (let i = 0; i < titles.length; i++) {
    // NOTE: This assignment creates a mutable variable. Functional programming
    // NOTE: seeks to eliminate mutable values for a myriad of reasons and so with
    // NOTE: more time I would implement immutable variables, likely immutable.js.
    let match = str.indexOf(`${titles[i]}.`)
    while (match > -1) {
      str = spliceSlice(str, match + titles[i].length, 1, '')
      match = str.indexOf(`${titles[i]}.`)
    }
  }
  // NOTE: Remove non-alphabetical/grammatical characters, then mutate all
  // NOTE: name-dividing grammar markers into exclamation marks to differentiate
  // NOTE: them from full stops which can occur between a title and last name.
  // NOTE: Then homogenize whitespace and finally tokenise the string on space characters.
  // NOTE: The order is significant.
  let tokens = str.replace(/[^a-zA-Z\n\r\s.,!?:;"'()*]/g, '')
                  .replace(/[.,!?:;"'()*]/g, '!')
                  .replace(/[\n\r\s]+/g, ' ')
                  .split(' ')
  // NOTE: Walk the tokens, seperating words that end with a grammatical mark
  // NOTE: from their grammatical marks. This loops every token in order to
  // NOTE: RegEx it. This could be made quite a bit faster.
  console.log('Parsing grammatical characters, this may take a minute.')
  const recurse = (token) => {
    if (token.length > 1 && /!$/.test(token)) {
      token = token.substr(0, token.length - 1)
      return recurse(token)
    } else if (token.length > 1 && /!s$/.test(token)) {
      token = token.substr(0, token.length - 2)
      return recurse(token)
    } else return token
  }
  // NOTE: This helper function prevents repeating very similar sections of code.
  const splice = (index, offset) => {
    tokens[index] = tokens[index].substr(0, tokens[index].length - offset)
    tokens[index] = recurse(tokens[index])
    tokens.splice(index + 1, 0, '!')
  }
  let increment = 1
  for (let i = 0; i < tokens.length; i = i + increment) {
    if (i % 25000 === 0) console.log(`${((i/tokens.length) * 100).toFixed(0)}%`)
    if (tokens[i].length > 1 && /!$/.test(tokens[i])) {
      splice(i, 1)
      increment = 2
    } else if (tokens[i].length > 1 && /!s$/.test(tokens[i])) {
      splice(i, 2)
      increment = 3
    } else increment = 1
  }
  console.log(`100%\nParsing complete.`)
  resolve(tokens)
})
