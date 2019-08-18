import express from 'express'
import * as eventController from './event.controller'

const eventRouter = express.Router()

eventRouter.get('/', eventController.getEvent)
  .get('/:event_id', eventController.getEventById)
  .post('/', eventController.createEvent)
  .put('/:event_id', eventController.updateEvent)
  .delete('/:event_id', eventController.deleteEvent)

export { eventRouter }
