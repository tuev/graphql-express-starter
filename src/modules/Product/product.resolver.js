import Product from './product.model'
import { pick, get } from 'lodash'
import { subscriptionCreator } from '@utils'
import * as productConst from './product.constant'

/* ------------------------------- QUERY ------------------------------- */

const products = async () => {
  const products = await Product.find({})
  return products
}

const product = async (_, { id }) => {
  const product = await Product.findById(id)
  return product
}

/* ----------------------------- MUTATION ---------------------------- */

const addProduct = async (_, args = {}, { pubsub } = {}) => {
  const productInfo = pick(args.input, [
    'name',
    'description',
    'isPublic',
    'status',
    'releaseDate'
  ])
  const productRelation = pick(args, ['SKUs'])
  const slug = args.slug || productInfo.name
  const product = await Product.create({
    ...productInfo,
    ...productRelation,
    slug,
    releaseDate: productInfo.releaseDate || new Date()
  })
  pubsub.publish(productConst.PRODUCT_ADDED, product)
  return product
}

const updateProduct = async (_, args = {}, { pubsub } = {}) => {
  const productInfo = pick(args.input, [
    'name',
    'description',
    'isPublic',
    'status',
    'releaseDate'
  ])
  const productRelation = pick(args, ['SKUs'])
  const product = await Product.findByIdAndUpdate(
    args.id,
    {
      ...productInfo,
      ...productRelation,
      releaseDate: productInfo.releaseDate || new Date()
    },
    { new: true }
  )
  pubsub.publish(productConst.PRODUCT_UPDATED, product)
  return product
}

const deleteProduct = async (_, { id }, { pubsub } = {}) => {
  const result = await Product.deleteOne({ _id: id })
  pubsub.publish(productConst.PRODUCT_DELETED, id)
  return !!get(result, 'deletedCount', false)
}

/* ---------------------------- APPLY MIDDLEWARE ---------------------------- */

/* -------------------------------- SUBCRIBE -------------------------------- */

const productAdded = subscriptionCreator({ name: productConst.PRODUCT_ADDED })
const productUpdated = subscriptionCreator({ name: productConst.PRODUCT_UPDATED })
const productDeleted = subscriptionCreator({ name: productConst.PRODUCT_DELETED })

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const productResolvers = {
  Query: { products, product },
  Mutation: { addProduct, deleteProduct, updateProduct },
  Subscription: { productAdded, productUpdated, productDeleted }
}
