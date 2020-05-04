import SKU from './sku.model'
import { pick, get } from 'lodash'
import { subscriptionCreator } from '@utils'
import * as SKUConstant from './SKU.constant'

import Brand from '@modules/Brand/brand.model'
import Category from '@modules/Category/category.model'
import Collection from '@modules/Collection/collection.model'
import Color from '@modules/Color/color.model'
import Image from '@modules/Image/image.model'
import Size from '@modules/Size/size.model'
import Product from '@modules/Product/product.model'

import fakeS from './fake'
import faker from 'faker'

/* ------------------------------- QUERY ------------------------------- */

const skus = async () => {
  const result = await SKU.find({})
  return result
}

const sku = async (_, { id }) => {
  const result = await SKU.findById(id)
  return result
}

/* ----------------------------- MUTATION ---------------------------- */

const fakeSKU = async (_, args = {}) => {
  const result = []
  const size = await Size.find({})
    .limit(20)
    .select('_id')
  const brand = await Brand.find({})
    .limit(20)
    .select('_id')
  const collection = await Collection.find({})
    .limit(20)
    .select('_id')
  const category = await Category.find({})
    .limit(20)
    .select('_id')
  const product = await Product.find({})
    .limit(20)
    .select('_id')
  const image = await Image.find({})
    .limit(20)
    .select('_id')

  const params = pick(args, [
    'size',
    'brand',
    'collection',
    'category',
    'product',
  ])
  const quantity = get(args, 'quantity', 10)
  for (let i = 0; i < quantity; i++) {
    const newProduction = fakeS({
      images: image,
      size: params.size || faker.random.arrayElement(size),
      brand: params.brand || faker.random.arrayElement(brand),
      collection: params.collection || faker.random.arrayElement(collection),
      category: params.category || faker.random.arrayElement(category),
      product: params.product || faker.random.arrayElement(product),
    })
    try {
      const isProductionExist = await SKU.count({
        slug: newProduction.slug,
      })
      if (!isProductionExist) {
        const production = await SKU.create(newProduction)
        result.push(production)
      }
    } catch (error) {}
  }

  return result
}

const addSKU = async (_, args = {}, { pubsub } = {}) => {
  const SKUInfo = pick(args.input, [
    'name',
    'quantity',
    'price',
    'discount',
    'isPublic',
  ])
  const slug = args.slug || SKUInfo.name
  const SKURelation = pick(args, [
    'color',
    'size',
    'brandType',
    'collectionType',
    'categoryType',
    'productType',
    'images',
  ])
  const result = await SKU.create({
    ...SKUInfo,
    ...SKURelation,
    slug,
  })
  pubsub.publish(SKUConstant.SKU_ADDED, result)
  return result
}

const updateSKU = async (_, args = {}, { pubsub } = {}) => {
  const SKUInfo = pick(args.input, [
    'name',
    'quantity',
    'price',
    'discount',
    'isPublic',
  ])
  const SKURelation = pick(args, [
    'color',
    'size',
    'brandType',
    'collectionType',
    'categoryType',
    'productType',
    'images',
  ])
  const result = await SKU.findByIdAndUpdate(
    args.id,
    {
      ...SKUInfo,
      ...SKURelation,
    },
    { new: true }
  )
  pubsub.publish(SKUConstant.SKU_UPDATED, result)
  return result
}

const deleteSKU = async (_, { id }, { pubsub } = {}) => {
  const result = await SKU.deleteOne({ _id: id })
  pubsub.publish(SKUConstant.SKU_DELETED, id)
  return !!get(result, 'deletedCount', false)
}

/* -------------------------------- RELATION -------------------------------- */

const SKURelation = {
  images: async SKU => {
    const imageIdList = get(SKU, 'images', [])
    const images = await Image.find({ _id: { $in: imageIdList } })
    return images
  },
  colorType: async SKU => {
    const color = await Color.findById(SKU.colorType)
    return color
  },
  sizeType: async SKU => {
    const size = await Size.findById(SKU.sizeType)
    return size
  },
  brandType: async SKU => {
    const brand = await Brand.findById(SKU.brandType)
    return brand
  },
  bollectionType: async SKU => {
    const bollection = await Collection.findById(SKU.bollectionType)
    return bollection
  },
  categoryType: async SKU => {
    const category = await Category.findById(SKU.categoryType)
    return category
  },
  productType: async SKU => {
    const product = await Product.findById(SKU.productType)
    return product
  },
}

/* ---------------------------- APPLY MIDDLEWARE ---------------------------- */

/* -------------------------------- SUBCRIBE -------------------------------- */

const SKUAdded = subscriptionCreator({ name: SKUConstant.SKU_ADDED })
const SKUUpdated = subscriptionCreator({ name: SKUConstant.SKU_UPDATED })
const SKUDeleted = subscriptionCreator({ name: SKUConstant.SKU_DELETED })

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const SKUResolvers = {
  Query: { skus, sku },
  Mutation: { addSKU, deleteSKU, updateSKU, fakeSKU },
  Subscription: { SKUAdded, SKUUpdated, SKUDeleted },
  SKU: SKURelation,
}
