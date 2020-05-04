import faker from 'faker'

export const fakeImage = () => {
  const imageFake = faker.image.imageUrl(960, 960, 'shoe')
  const imagenmae = faker.lorem.slug()
  const sizeItem = {
    name: imagenmae,
    slug: imagenmae,
    url: imageFake,
    description: faker.lorem.sentence(),
  }
  return sizeItem
}

export default fakeImage
