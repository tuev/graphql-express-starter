import faker from 'faker'
import camelCase from 'lodash/camelCase'

export const fakeProduction = (skus = []) => {
  const productionName = faker.commerce.product()
  const newProduct = {
    name: productionName,
    slug: camelCase(productionName),
    description: faker.lorem.sentences(),
    isPublic: faker.random.arrayElement([true, false]),
    views: faker.random.number(3000),
    likes: faker.random.number(3000),
    status: faker.random.arrayElement([true, false]),
    releaseDate: faker.date.past(),
    rate: faker.random.number(5),
    SKUs: faker.random.arrayElement(skus),
  }
  return newProduct
}

export default fakeProduction
