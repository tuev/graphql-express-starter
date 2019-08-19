import Collection from './collection.model'
import { get, pick } from 'lodash'
import { subscriptionCreator } from '@utils'
import * as collectionConst from './collection.constant'

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

const addCollection = async (_, args = {}, { pubsub } = {}) => {
  const collectionInfo = pick(args.input, ['name', 'description'])
  const slug = get(args, 'slug', collectionInfo.name)
  const collectionRelation = pick(args, [
    'brands',
    'categories',
    'SKUs',
    'images'
  ])
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
  const collectionRelation = pick(args, [
    'brands',
    'categories',
    'SKUs',
    'images'
  ])
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
  Mutation: { addCollection, deleteCollection, updateCollection },
  Subscription: { collectionAdded, collectionUpdated, collectionDeleted }
}
