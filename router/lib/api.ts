// NOTE: This module exports a function that curries a function that responds
// NOTE: to api requests using the counted object which was parsed from the files.
module.exports = names => {
  return (req, res) => {
    for (let i = 0; i < names.length; i++) {
      if (names[i].name === req.query.name) return res.json(names[i])
    }
    return res.json({ msg: 'That name could not found.' })
  }
}
