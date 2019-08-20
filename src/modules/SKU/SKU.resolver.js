import SKU from './sku.model'
import { pick, get } from 'lodash'
import { subscriptionCreator } from '@utils'
import * as SKUConstant from './SKU.constant'

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

const addSKU = async (_, args = {}, { pubsub } = {}) => {
  const SKUInfo = pick(args.input, [
    'name',
    'quantity',
    'price',
    'discount',
    'isPublic'
  ])
  const slug = args.slug || SKUInfo.name
  const SKURelation = pick(args, [
    'color',
    'size',
    'brandType',
    'collectionType',
    'categoryType',
    'productType',
    'images'
  ])
  const result = await SKU.create({
    ...SKUInfo,
    ...SKURelation,
    slug
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
    'isPublic'
  ])
  const SKURelation = pick(args, [
    'color',
    'size',
    'brandType',
    'collectionType',
    'categoryType',
    'productType',
    'images'
  ])
  const result = await SKU.findByIdAndUpdate(
    args.id,
    {
      ...SKUInfo,
      ...SKURelation
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
  Mutation: { addSKU, deleteSKU, updateSKU },
  Subscription: { SKUAdded, SKUUpdated, SKUDeleted }
}
