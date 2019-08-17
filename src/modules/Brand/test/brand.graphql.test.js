import Brand from '../brand.model'
const chai = require('chai')
const expect = chai.expect

describe('Brand graphql test', () => {
  it('get brands', done => {
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            brands{
              id
             }
           }`
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const data = res.body.data.brands
        console.log(data, 'data')
        expect(data).is.to.be.an('array')
        done()
      })
  })

  it('get brands', async () => {
    const findBrand = await Brand.findOne({ name: 'brand_test' })
    const result = await chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            brand(id: "${findBrand._id}"){
              id
             }
           }`
      })

    const status = result.status
    expect(status).to.be.equal(200)
    const data = result.body.data
    expect(data).is.to.be.an('object')
  })

  it('add brands', done => {
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `mutation($name: String!, $description: String!) {\n  addBrand(input: {name: $name, description: $description} ){\n    id\n  }\n}\n`,
        variables: { name: 'test brand', description: 'test description' }
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const data = res.body.data
        expect(data).is.to.be.an('object')
        done()
      })
  })

  it('delete brands', async () => {
    const newBrand = await Brand.create({ name: 'brand', slug: 'slug' })

    const result = await chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          mutation{
            deleteBrand(id: "${newBrand._id}")
           }`
      })
    const status = result.status
    expect(status).to.be.equal(200)
    const data = result.body.data
    expect(data).is.to.be.an('object')
    expect(data.deleteBrand).is.to.be.equal(true)
  })
})
