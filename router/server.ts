// NOTE: This helper module exports a function that returns a configured express
// NOTE: server object.
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const express = require('express')

const server = express()

const allowCrossDomain = (_req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'example.com')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
}

module.exports = () => {
  server.use(express.static('router/public'))
  server.use(cookieParser())
  server.use(allowCrossDomain)
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: true }))
  server.use(session({
    secret: 'indev',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: null }
  }))
  server.use(flash())
  return server
}
