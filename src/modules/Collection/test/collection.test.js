import Collection from '../collection.model'
const chai = require('chai')
const expect = chai.expect

describe('test collection', () => {
  it('get collections', done => {
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            collections{
              id
             }
           }`,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const data = res.body.data.collections
        expect(data).is.to.be.an('array')
        done()
      })
  })

  it('get collection', async () => {
    const findCollection = await Collection.findOne({ name: 'collection_test' })
    const result = await chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            collection(id: "${findCollection._id}"){
              id
             }
           }`,
      })

    const status = result.status
    expect(status).to.be.equal(200)
    const data = result.body.data
    expect(data).is.to.be.an('object')
  })

  it('add collection', done => {
    const newCollection = {
      name: 'new collection',
    }
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query:
          'mutation($name: String!, $description: String!) {\n  addCollection(input: {name: $name, description: $description}) {\n    id\n  }\n}',
        variables: {
          name: newCollection.name,
          description: 'collection description',
        },
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const data = res.body.data
        expect(data).is.to.be.an('object')
        done()
      })
  })

  it('delete collection', async () => {
    const newCollection = await Collection.create({
      name: 'Collection',
      slug: 'slug',
    })

    const result = await chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          mutation{
            deleteCollection(id: "${newCollection._id}")
           }`,
      })
    const status = result.status
    expect(status).to.be.equal(200)
    const data = result.body.data
    expect(data).is.to.be.an('object')
    expect(data.deleteCollection).is.to.be.equal(true)
  })
})
