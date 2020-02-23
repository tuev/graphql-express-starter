import faker from 'faker'

export const fakeSize = () => {
  const sizeFake = faker.random.arrayElement(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
  const sizeItem = {
    name: sizeFake,
    slug: sizeFake,
    value: sizeFake,
    description: faker.lorem.sentence()
  }
  return sizeItem
}

export default fakeSize
