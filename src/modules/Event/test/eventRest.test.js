import Event from '../event.model'
import chai from 'chai'
const expect = chai.expect

describe('Event rest test', () => {
  it('get events', done => {
    chai
      .sendLocalRequest()
      .get('/api/v1/Event')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const data = res.body
        expect(data).is.to.be.an('array')
        done()
      })
  })

  it('get events', done => {
    const postData = {
      name: 'test',
      author: 'asd',
      description: 'test description',
      date: '02/03/2020',
      price: '200',
      location: 'hcm'
    }
    chai
      .sendLocalRequest()
      .post('/api/v1/Event')
      .send(postData)
      .set('Accept', 'application/json')
      .expect(201)
      .end((err, res) => {
        if (err) return done(err)
        const data = res.body
        expect(data).is.to.be.an('object')
        expect(data.name).is.equal(postData.name)
        done()
      })
  })

  it('post events', done => {
    const postData = {
      name: 'test',
      author: 'asd',
      description: 'test description',
      date: '02/03/2020',
      price: '200',
      location: 'hcm'
    }
    chai
      .sendLocalRequest()
      .post('/api/v1/Event')
      .send(postData)
      .set('Accept', 'application/json')
      .expect(201)
      .end((err, res) => {
        if (err) return done(err)
        const data = res.body
        expect(data).is.to.be.an('object')
        expect(data.name).is.equal(postData.name)
        done()
      })
  })

  it('put events', async () => {
    const putData = {
      name: 'test1',
      author: 'asd',
      description: 'test description',
      date: '02/03/2021',
      price: '500',
      location: 'hn'
    }
    const updateEventId = '5d48529831b1e9efc1849d71'
    const res = await chai
      .sendLocalRequest()
      .patch(`/api/v1/Event/${updateEventId}`)
      .send(putData)
      .set('Accept', 'application/json')
      .expect(200)
    const data = res.body
    expect(data).is.to.be.an('object')
    expect(data.name).is.equal(putData.name)
    expect(data.price).is.equal(putData.price)
  })

  it('delete event', done => {
    const deleteEventId = '5d48529831b1e9efc1849d71'

    chai
      .sendLocalRequest()
      .delete(`/api/v1/Event/${deleteEventId}`)
      .set('Accept', 'application/json')
      .expect(204)
      .end((err, res) => {
        if (err) return done(err)
        const data = res.body
        expect(data).is.to.be.an('object')
        done()
      })
  })

  it('mock events', async () => {
    const res = await chai
      .sendLocalRequest()
      .post('/api/v1/mock/event')
      .set('Accept', 'application/json')
      .expect(200)
    const data = res.body
    expect(data).is.to.be.an('object')
    const events = await Event.find()
    expect(events.length).is.greaterThan(10)
  })
})
