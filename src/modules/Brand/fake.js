import faker from 'faker'
import camelCase from 'lodash/camelCase'

export const fakeBrand = (images = []) => {
  const companyName = faker.company.companyName()
  const newBrand = {
    name: companyName,
    slug: camelCase(companyName),
    description: faker.lorem.sentences(),
    images: faker.random.arrayElement(images)
  }
  return newBrand
}

export default fakeBrand
