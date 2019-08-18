import Product from './product.model'
import { pick, get } from 'lodash'

/* ------------------------------- QUERY ------------------------------- */

const products = async () => {
  const products = await Product.find({})
  console.log(products, 'products')
  return products
}

const product = async (_, { id }) => {
  const product = await Product.findById(id)
  return product
}

/* ----------------------------- MUTATION ---------------------------- */

const addProduct = async (_, args) => {
  const newProduct = pick(args.input, [
    'name',
    'slug',
    'description',
    'isPublic',
    'status',
    'releaseDate'
  ])
  const product = await Product.create({
    ...newProduct,
    slug: newProduct.slug || newProduct.name,
    releaseDate: newProduct.releaseDate || new Date()
  })
  return product
}

const deleteProduct = async (_, { id }) => {
  const result = await Product.deleteOne({ _id: id })
  return !!get(result, 'deletedCount', false)
}

/* ---------------------------- APPLY MIDDLEWARE ---------------------------- */

/* ------------------------------ SUBCRIBE ----------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const productResolvers = {
  Query: { products, product },
  Mutation: { addProduct, deleteProduct },
  Subscription: {}
}
