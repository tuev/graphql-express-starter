import Event from '../event.model'
const chai = require('chai')
const expect = chai.expect

// Get all event
describe('event rest api test', () => {
  it('it should be get event', done => {
    chai
      .sendLocalRequest()
      .get('/api/v1/event')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        console.log(res.body.data)
        expect(res.body.data).is.an('array')
        done()
      })
  })
})
// Get only 1 event
describe('event rest api test', () => {
  it('it should be get only 1 event by id', done => {
    const id = '5d4e7d9df2541d3dd9bd6275'
    chai
      .sendLocalRequest()
      .get(`/api/v1/event/${id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        console.log(res.body)
        expect(res.body).is.an('object')
        expect(res.body._id).to.equal(id)
        done()
      })
  })
})
// Create event
describe('event rest api test', () => {
  it('it should be created a new event', done => {
    const event = {
      name: 'The First Project ',
      author: 'MrBin',
      description: 'Nothing'
    }
    chai
      .sendLocalRequest()
      .post('/api/v1/event')
      .send(event)
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        console.warn(res.body, '-------body')
        // const eventInfo = res.body.eventInfo
        expect(res.body).to.be.a('object')
        expect(res.body).to.have.property('name')
        expect(res.body).to.have.property('author')
        expect(res.body).to.have.property('description')
        done()
      })
  })
})
// Updated all event
describe('event rest api test', () => {
  it('it should be updated', done => {
    const event = {
      name: 'The First Project 3'
    }

    const keys = Object.keys(event)
    const id = '5d4e7d9df2541d3dd9bd6275'
    chai
      .sendLocalRequest()
      .put(`/api/v1/event/${id}`)
      .send(event)
      .set('Accept', 'application/json')
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err)
        const eventUpdated = res.body
        expect(eventUpdated).to.be.a('object')
        keys.map(key => expect(eventUpdated).to.have.property(key).to.equal(event[key]))
        done()
      })
  })
})

describe('event rest api test', () => {
  it('it should be get only 1 event by id', done => {
    const id = '5d4e7d9df2541d3dd9bd6275'
    chai
      .sendLocalRequest()
      .delete(`/api/v1/event/${id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err)
        console.log(res.body)
        const event = await Event.findById(id)
        console.log(event)
        // eslint-disable-next-line no-unused-expressions
        expect(event).to.be.null
        done()
      })
  })
})
