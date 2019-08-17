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
        console.error(err)
        if (err) return done(err)
        const data = res.body
        console.log(res.body, 'body')
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

  it('update brand', done => {
    const imageId = '5d57b50b6c92ad7c5fc90d3a'
    const collectionId = '5d260d58fba1a8859baff6f7'
    const categoryId = '5d260cf175e207847d770738'

    const updateData = {
      id: '5d252dcb0d91cf7372bf0aa7',
      name: 'test brand',
      description: 'brand description',
      collections: [collectionId],
      images: [imageId],
      categories: [categoryId]
    }
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query:
          'mutation ($name: String!, $description: String!, $collections: [ID], $images: [ID], $categories: [ID], $id: ID!) {\n  updateBrand(input: {name: $name, description: $description}, collections: $collections, categories: $categories, images: $images, id: $id) {\n    id\n    images {\n      id\n      name\n    }\n    collections{\n      id\n      name\n    }\n    categories{\n      id\n      name\n    }\n  }\n}\n',
        variables: updateData
      })
      .expect(200)
      .end((err, res) => {
        console.error(err)
        if (err) return done(err)
        const data = res.body.data.updateBrand

        console.log(data, ' data')
        expect(data).is.to.be.an('object')
        expect(data.images.some(item => item.id === imageId)).is.to.be.true()
        expect(
          data.collections.some(item => item.id === collectionId)
        ).is.to.be.true()
        expect(
          data.categories.some(item => item.id === categoryId)
        ).is.to.be.true()
        done()
      })
  })
})
