import SKU from './sku.model'
import { pick, get } from 'lodash'

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

const addSKU = async (_, args) => {
  const newSKU = pick(args.input, [
    'name',
    'slug',
    'quantity',
    'price',
    'discount',
    'isPublic'
  ])
  const result = await SKU.create({
    ...newSKU,
    slug: newSKU.slug || newSKU.name
  })
  return result
}

const deleteSKU = async (_, { id }) => {
  const result = await SKU.deleteOne({ _id: id })
  return !!get(result, 'deletedCount', false)
}

/* ---------------------------- APPLY MIDDLEWARE ---------------------------- */

/* ------------------------------ SUBCRIBE ----------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const SKUResolvers = {
  Query: { skus, sku },
  Mutation: { addSKU, deleteSKU },
  Subscription: {}
}
