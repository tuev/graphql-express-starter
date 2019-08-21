import { get, pick } from 'lodash'
import { subscriptionCreator } from '@utils'
import * as categoryConst from './category.const'

import Brand from '@modules/Brand/brand.model'
import Collection from '@modules/Collection/collection.model'
import Category from '@modules/Category/category.model'
import SKU from '@modules/SKU/sku.model'
import Image from '@modules/Image/image.model'

/* ------------------------------- QUERY ------------------------------- */

const categories = async () => {
  const categories = await Category.find({})
  return categories
}

const category = async (_, { id }) => {
  const category = await Category.findById(id)
  return category
}

/* ----------------------------- MUTATION ---------------------------- */

const addCategory = async (_, args = {}, { pubsub } = {}) => {
  const categoryInfo = pick(args.input, ['name', 'description'])
  const slug = get(args, 'slug', categoryInfo.name)
  const categoryRelation = pick(args, [
    'brands',
    'collections',
    'SKUs',
    'images'
  ])
  const result = await Category.create({
    ...categoryInfo,
    ...categoryRelation,
    slug
  })
  pubsub.publish(categoryConst.CATEGORY_ADDED, result)
  return result
}

const updateCategory = async (_, args = {}, { pubsub } = {}) => {
  const id = get(args, 'id', '')
  const categoryInfo = pick(args.input, ['name', 'description'])
  const categoryRelation = pick(args, [
    'brands',
    'collections',
    'SKUs',
    'images'
  ])
  const result = await Category.findByIdAndUpdate(
    id,
    {
      ...categoryInfo,
      ...categoryRelation
    },
    { new: true }
  )
  pubsub.publish(categoryConst.CATEGORY_UPDATED, result)
  return result
}

const deleteCategory = async (_, { id }, { pubsub } = {}) => {
  const result = await Category.deleteOne({ _id: id })
  const deletedCount = get(result, 'deletedCount', 0)
  pubsub.publish(categoryConst.CATEGORY_DELETED, id)
  return !!deletedCount
}

/* -------------------------------- RELATION -------------------------------- */

const CategoryRelation = {
  collections: async category => {
    const collectionIdList = get(category, 'collections', [])
    const collections = await Collection.find({ _id: { $in: collectionIdList } })
    return collections
  },
  brands: async category => {
    const brandIdList = get(category, 'brands', [])
    const brands = await Brand.find({ _id: { $in: brandIdList } })
    return brands
  },
  SKUs: async category => {
    const skuIdList = get(category, 'SKUs', [])
    const SKUs = await SKU.find({ _id: { $in: skuIdList } })
    return SKUs
  },
  images: async category => {
    const imageIdList = get(category, 'images', [])
    const images = await Image.find({ _id: { $in: imageIdList } })
    return images
  }
}

/* ---------------------------- APPLY MIDDLEWARE ---------------------------- */

/* -------------------------------- SUBCRIBE -------------------------------- */

const categoryAdded = subscriptionCreator({ name: categoryConst.CATEGORY_ADDED })

const categoryUpdated = subscriptionCreator({
  name: categoryConst.CATEGORY_UPDATED
})

const categoryDeleted = subscriptionCreator({
  name: categoryConst.CATEGORY_DELETED
})

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                  */
/* -------------------------------------------------------------------------- */

export const categoryResolvers = {
  Query: { categories, category },
  Mutation: { addCategory, deleteCategory, updateCategory },
  Subscription: { categoryAdded, categoryUpdated, categoryDeleted },
  Category: CategoryRelation
}
