import Color from './color.model'
import { pick, get } from 'lodash'
import { subscriptionCreator } from '@utils'
import * as colorConst from './color.constant'

import SKU from '@modules/SKU/sku.models'

/* ------------------------------- QUERY ------------------------------- */

const colors = async () => {
  const result = await Color.find({})
  return result
}

const color = async (_, { id }) => {
  const result = await Color.findById({ _id: id })
  return result
}

/* ----------------------------- MUTATION ---------------------------- */

const addColor = async (_, args = {}, { pubsub } = {}) => {
  const colorInfo = pick(args.input, ['name', 'value', 'description'])
  const colorRelation = pick(args, ['SKUs'])
  const color = await Color.create({
    ...colorInfo,
    ...colorRelation,
    slug: args.slug || colorInfo.name
  })
  pubsub.publish(colorConst.COLOR_ADDED, color)
  return color
}

const updateColor = async (_, args = {}, { pubsub } = {}) => {
  const colorInfo = pick(args.input, ['name', 'value', 'description'])
  const id = get(args, 'id', '')
  const colorRelation = pick(args, ['SKUs'])
  const color = await Color.findByIdAndUpdate(
    id,
    {
      ...colorInfo,
      ...colorRelation
    },
    { new: true }
  )
  pubsub.publish(colorConst.COLOR_UPDATED, color)
  return color
}

const deleteColor = async (_, { id }, { pubsub } = {}) => {
  const result = await Color.deleteOne({ _id: id })
  const deletedColor = get(result, 'deletedCount', false)
  pubsub.publish(colorConst.COLOR_DELETED, id)
  return !!deletedColor
}

/* -------------------------------- RELATION -------------------------------- */

const colorRelation = {
  SKUs: async color => {
    const skuIdList = get(color, 'SKUs', [])
    const SKUs = await SKU.find({ _id: { $in: skuIdList } })
    return SKUs
  }
}

/* ---------------------------- APPLY MIDDLEWARE ---------------------------- */

/* -------------------------------- SUBCRIBE -------------------------------- */

const colorAdded = subscriptionCreator({ name: colorConst.COLOR_ADDED })
const colorUpdated = subscriptionCreator({ name: colorConst.COLOR_UPDATED })
const colorDeleted = subscriptionCreator({ name: colorConst.COLOR_DELETED })

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                  */
/* -------------------------------------------------------------------------- */

export const colorResolvers = {
  Query: { colors, color },
  Mutation: { addColor, deleteColor, updateColor },
  Subscription: { colorAdded, colorUpdated, colorDeleted },
  Color: colorRelation
}
