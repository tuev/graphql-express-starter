import Category from '../category.model'
const chai = require('chai')
const expect = chai.expect

describe('Category graphql test', () => {
  it('get categories', done => {
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            categories{
              id
             }
           }`,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)

        const data = res.body.data.categories
        expect(data).is.to.be.an('array')
        done()
      })
  })

  it('get category', async () => {
    const findCategory = await Category.findOne({ name: 'category_test' })
    const result = await chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            category(id: "${findCategory._id}"){
              id
             }
           }`,
      })

    const status = result.status
    expect(status).to.be.equal(200)
    const data = result.body.data
    expect(data).is.to.be.an('object')
  })

  it('add category', done => {
    const newCategory = {
      name: 'new Category',
    }
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query:
          'mutation($name: String!, $description: String!) {\n  addCategory(input: {name: $name, description: $description}) {\n    id\n  }\n}',
        variables: {
          name: newCategory.name,
          description: 'category description',
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

  it('delete category', async () => {
    const newCategory = await Category.create({
      name: 'Category',
      slug: 'slug',
    })

    const result = await chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          mutation{
            deleteCategory(id: "${newCategory._id}")
           }`,
      })
    const status = result.status
    expect(status).to.be.equal(200)
    const data = result.body.data
    expect(data).is.to.be.an('object')
    expect(data.deleteCategory).is.to.be.equal(true)
  })
})
