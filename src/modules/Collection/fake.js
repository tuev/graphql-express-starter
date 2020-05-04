import faker from 'faker'
import camelCase from 'lodash/camelCase'

export const fakeCollection = (images = []) => {
  const collectionName = faker.commerce.department()
  const newCollection = {
    name: collectionName,
    slug: camelCase(collectionName),
    description: faker.lorem.sentences(),
    images: faker.random.arrayElement(images),
  }
  return newCollection
}

export default fakeCollection
