const chai = require('chai')
const { get } = require('lodash')

const expect = chai.expect

describe('User graphql test', () => {
  it('signup success', done => {
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          mutation{
            signup(email:"tes1@gmail.com", password:"1qazZAQ!",username:"t123"){
              token
               user{
                id 
               }
             }
           }`,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const data = res.body.data.signup
        expect(data).to.have.property('token')
        expect(data).to.have.property('user')
        expect(data.user).to.have.property('id')
        done()
      })
  })

  it('signup failed user existed', done => {
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          mutation{
            signup(email:"ascb@asda.qwe", password:"1qazZAQ!",username:"t123"){
              token
               user{
                id 
               }
             }
           }`,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const data = res.body.data
        expect(data).to.equal(null)
        done()
      })
  })

  it('signin success', done => {
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            signin(username:"user_test", password:"123"){
              token
               user{
                id 
               }
             }
           }`,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const data = res.body.data.signin
        expect(data).to.have.property('token')
        expect(data).to.have.property('user')
        expect(data.user).to.have.property('id')
        done()
      })
  })

  it('signin fail params not correct', done => {
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            signin(email:"ascb@asda.qwe", password:"123"){
              token
               user{
                id 
               }
             }
           }`,
      })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        done()
      })
  })

  it('signin fail password not correct', done => {
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            signin(username:"user_test", password:"wrong"){
              token
               user{
                id 
               }
             }
           }`,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const data = res.body.data
        expect(data).to.equal(null)
        done()
      })
  })

  it('list users success', async () => {
    const res = await chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            signin(username:"user_test", password:"123"){
              token
               user{
                id 
               }
             }
           }`,
      })
      .expect(200)
    const token = get(res, 'body.data.signin.token')
    const res2 = await chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          query{
            users{
              id
             }
           }`,
      })
      .expect(200)

    const data = res2.body.data
    expect(data).to.have.property('users')
    expect(data.users).to.be.an('array')
    data.users.map(user => {
      expect(user).to.have.property('id')
    })
  })

  it('list users failed', async () => {
    const res = await chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            users{
              id
             }
           }`,
      })
      .expect(200)

    const data = res.body.data
    expect(data).to.be.equal(null)
  })
})
