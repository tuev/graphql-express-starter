import faker from 'faker'
import camelCase from 'lodash/camelCase'

export const fakeCategory = (images = []) => {
  const categoryName = faker.commerce.department()
  const newBrand = {
    name: categoryName,
    slug: camelCase(categoryName),
    description: faker.lorem.sentences(),
    images: faker.random.arrayElement(images),
  }
  return newBrand
}

export default fakeCategory
