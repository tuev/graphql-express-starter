import express from 'express'

import Event from './event.model'
import restify from 'express-restify-mongoose'
import eventRouter from './event.controller'

const eventRestifyRouter = express.Router()

restify.serve(eventRestifyRouter, Event, {
  totalCountHeader: true
})

export { eventRestifyRouter, eventRouter }
