import Size from './size.model'
import { pick, get } from 'lodash'
import { subscriptionCreator } from '@utils'
import * as sizeConst from './size.constant'
import { IMAGE_DELETED } from '../Image/image.constant'
import fakeSz from './fake'

// import SKU from '@modules/SKU/sku.model'

/* ------------------------------- QUERY ------------------------------- */

const sizes = async () => {
  const sizes = await Size.find({})
  return sizes
}

const size = async (_, { id }) => {
  const size = await Size.findById(id)
  return size
}

/* ----------------------------- MUTATION ---------------------------- */

const fakeSize = async (_, args = {}) => {
  const result = []
  const quantity = get(args, 'quantity', 10)
  for (let i = 0; i < quantity; i++) {
    const newSize = fakeSz()
    try {
      const isSizeExist = await Size.count({ slug: newSize.slug })
      if (!isSizeExist) {
        const size = await Size.create(newSize)
        result.push(size)
      }
    } catch (error) {}
  }

  return result
}

const addSize = async (_, args = {}, { pubsub } = {}) => {
  const sizeInfo = pick(args.input, ['name', 'value', 'description'])
  const slug = args.slug || sizeInfo.name
  const sizeRelation = pick(args, ['SKUs'])
  const result = await Size.create({
    ...sizeInfo,
    ...sizeRelation,
    slug
  })
  pubsub.publish(sizeConst.SIZE_ADDED, result)
  return result
}

const updateSize = async (_, args = {}, { pubsub } = {}) => {
  const sizeInfo = pick(args.input, ['name', 'value', 'description'])
  const sizeRelation = pick(args, ['SKUs'])
  const result = await Size.findByIdAndUpdate(
    args.id,
    {
      ...sizeInfo,
      ...sizeRelation
    },
    { new: true }
  )
  pubsub.publish(sizeConst.SIZE_UPDATED, result)
  return result
}

const deleteSize = async (_, { id }, { pubsub } = {}) => {
  const result = await Size.deleteOne({ _id: id })
  pubsub.publish(sizeConst, IMAGE_DELETED, id)
  return !!get(result, 'deletedCount', false)
}

/* -------------------------------- RELATION -------------------------------- */

/* -------------------------------- RELATION -------------------------------- */

const sizeRelation = {
  // SKUs: async size => {
  //   const skuIdList = get(size, 'SKUs', [])
  //   const SKUs = await SKU.find({ _id: { $in: skuIdList } })
  //   return SKUs
  // },
}

/* ---------------------------- APPLY MIDDLEWARE ---------------------------- */

/* -------------------------------- SUBCRIBE -------------------------------- */

const sizeAdded = subscriptionCreator({ name: sizeConst.SIZE_ADDED })
const sizeUpdated = subscriptionCreator({ name: sizeConst.SIZE_UPDATED })
const sizeDeleted = subscriptionCreator({ name: sizeConst.SIZE_DELETED })

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                  */
/* -------------------------------------------------------------------------- */

export const sizeResolvers = {
  Query: { sizes, size },
  Mutation: { addSize, deleteSize, updateSize, fakeSize },
  Subscription: { sizeAdded, sizeUpdated, sizeDeleted },
  Size: sizeRelation
}
