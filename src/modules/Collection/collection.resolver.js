import { get, pick } from 'lodash'
import { subscriptionCreator } from '@utils'
import * as collectionConst from './collection.constant'

import Collection from '@modules/Collection/collection.model'
import Image from '@modules/Image/image.model'
import fakeCl from './fake'

/* ------------------------------- QUERY ------------------------------- */

const collections = async () => {
  const result = await Collection.find({})
  return result
}

const collection = async (_, { id }) => {
  const result = await Collection.findById(id)
  return result
}

/* ----------------------------- MUTATION ---------------------------- */

const fakeCollection = async (_, args = {}) => {
  const result = []
  const images = await Image.find({}).select('_id')
  const quantity = get(args, 'quantity', 10)
  for (let i = 0; i < quantity; i++) {
    const newCollection = fakeCl(images)
    try {
      const isCollectionExist = await Collection.count({
        slug: newCollection.slug
      })
      if (!isCollectionExist) {
        const collection = await Collection.create(newCollection)
        result.push(collection)
      }
    } catch (error) {}
  }

  return result
}

const addCollection = async (_, args = {}, { pubsub } = {}) => {
  const collectionInfo = pick(args.input, ['name', 'description'])
  const slug = get(args, 'slug', collectionInfo.name)
  const collectionRelation = pick(args, ['images'])
  const result = await Collection.create({
    ...collectionInfo,
    ...collectionRelation,
    slug
  })
  pubsub.publish(collectionConst.COLLECTION_ADDED, result)
  return result
}

const updateCollection = async (_, args = {}, { pubsub } = {}) => {
  const collectionInfo = pick(args.input, ['name', 'description'])
  const id = get(args, 'id', '')
  const collectionRelation = pick(args, ['images'])
  const result = await Collection.findByIdAndUpdate(
    id,
    {
      ...collectionInfo,
      ...collectionRelation
    },
    { new: true }
  )
  pubsub.publish(collectionConst.COLLECTION_UPDATED, result)
  return result
}

const deleteCollection = async (_, { id }, { pubsub } = {}) => {
  const result = await Collection.deleteOne({ _id: id })
  const deletedCount = get(result, 'deletedCount', 0)
  pubsub.publish({ name: collectionConst.COLLECTION_DELETED, id })
  return !!deletedCount
}

const CollectionRelation = {
  // categories: async collection => {
  //   const categoryIdList = get(collection, 'categories', [])
  //   const categories = await Category.find({ _id: { $in: categoryIdList } })
  //   return categories
  // },
  // brands: async collection => {
  //   const brandIdList = get(collection, 'categories', [])
  //   const brands = await Brand.find({ _id: { $in: brandIdList } })
  //   return brands
  // },
  // SKUs: async collection => {
  //   const skuIdList = get(collection, 'SKUs', [])
  //   const SKUs = await SKU.find({ _id: { $in: skuIdList } })
  //   return SKUs
  // },
  images: async collection => {
    const imageIdList = get(collection, 'images', [])
    const images = await Image.find({ _id: { $in: imageIdList } })
    return images
  }
}

/* ---------------------------- APPLY MIDDLEWARE ---------------------------- */

/* -------------------------------- SUBSCRIBE ------------------------------- */

const collectionAdded = subscriptionCreator({
  name: collectionConst.COLLECTION_ADDED
})
const collectionUpdated = subscriptionCreator({
  name: collectionConst.COLLECTION_UPDATED
})
const collectionDeleted = subscriptionCreator({
  name: collectionConst.COLLECTION_DELETED
})

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                  */
/* -------------------------------------------------------------------------- */

export const collectionResolvers = {
  Query: { collection, collections },
  Mutation: {
    addCollection,
    deleteCollection,
    updateCollection,
    fakeCollection
  },
  Subscription: { collectionAdded, collectionUpdated, collectionDeleted },
  Collection: CollectionRelation
}
