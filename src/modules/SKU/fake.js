import faker from 'faker'
import camelCase from 'lodash/camelCase'

export const fakeSKU = ({
  images = [],
  product,
  category,
  collection,
  brand,
  size,
  color
}) => {
  const SKUName = faker.commerce.productName()
  const newSKU = {
    name: SKUName,
    slug: camelCase(SKUName),
    quantity: faker.random.number(1000),
    price: faker.random.number(1000),
    discount: faker.random.number(100),
    isPublic: faker.random.arrayElement([true, false]),
    colorType: color,
    sizeType: size,
    brandType: brand,
    collectionType: collection,
    categoryType: category,
    productType: product,
    images: faker.random.arrayElement(images)
  }
  return newSKU
}

export default fakeSKU
