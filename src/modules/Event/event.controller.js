import Event from './event.model'
import express from 'express'
import faker from 'faker'

const eventRouter = express.Router()

eventRouter.post('/event', async (req, res) => {
  for (let i = 0; i < 10; i++) {
    const newEvent = {
      name: faker.commerce.productName(),
      author: faker.name.findName(),
      description: faker.lorem.paragraph(),
      date: faker.date.future(),
      price: faker.commerce.price(),
      location: faker.address.streetAddress()
    }

    await Event.create(newEvent)
  }
  return res.json({ status: 'ok' })
})

export default eventRouter
