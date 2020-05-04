import faker from 'faker'

export const fakeColor = () => {
  const colorFake = faker.commerce.color()
  const colorItem = {
    name: colorFake,
    slug: colorFake,
    value: colorFake,
    description: faker.lorem.sentence(),
  }
  return colorItem
}

export default fakeColor
