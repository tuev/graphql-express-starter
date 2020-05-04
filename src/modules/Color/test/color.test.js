import Color from '../color.model'
const chai = require('chai')
const expect = chai.expect

describe('color graphql test', () => {
  it('get colors', done => {
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            colors{
              id
             }
           }`,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const data = res.body.data.colors
        expect(data).is.to.be.an('array')
        done()
      })
  })

  it('get color', async () => {
    const findColor = await Color.findOne({ name: 'color_test' })
    const result = await chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            color(id: "${findColor._id}"){
              id
             }
           }`,
      })

    const status = result.status
    expect(status).to.be.equal(200)
    const data = result.body.data
    expect(data).is.to.be.an('object')
  })

  it('add color', done => {
    const newColor = {
      name: 'new color',
      value: 'blue',
      description: 'color description',
    }
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query:
          'mutation ($name: String!, $description: String!, $value: String!) {\n  addColor(input: {name: $name, description: $description, value: $value}) {\n    id\n  }\n}\n',
        variables: newColor,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const data = res.body.data
        expect(data).is.to.be.an('object')
        done()
      })
  })

  it('delete color', async () => {
    const newColor = await Color.create({
      name: 'color',
      slug: 'slug',
      value: 'yellow',
    })
    const result = await chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          mutation{
            deleteColor(id: "${newColor._id}")
           }`,
      })
    const status = result.status
    expect(status).to.be.equal(200)
    const data = result.body.data
    expect(data).is.to.be.an('object')
    expect(data.deleteColor).is.to.be.equal(true)
  })
})
