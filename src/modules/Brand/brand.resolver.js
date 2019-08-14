// import applyMiddleware from '@utils/applyMiddlewares'
// import { requireAuthorization } from '@middlewares'
import { get, pick } from 'lodash'
import Brand from './brand.model'

/* ------------------------------- QUERY ------------------------------- */

const brands = async () => {
  const result = await Brand.find({})
  return result
}

const brand = async (_, { id }) => {
  const result = await Brand.findById(id)
  return result
}

/* ----------------------------- MUTATION ---------------------------- */

const addBrand = async (_, args = {}) => {
  const newBrand = pick(args.input, ['name', 'description', 'slug'])
  const result = await Brand.create({
    ...newBrand,
    slug: newBrand.slug || newBrand.name
  })
  return result
}

const deleteBrand = async (_, { id }) => {
  try {
    const result = await Brand.deleteOne({ _id: id })
    const deleteCount = get(result, 'deletedCount', 0)

    return !!deleteCount
  } catch (error) {
    return false
  }
}

/* ---------------------------- APPLY MIDDLEWARE ---------------------------- */

/* ------------------------------ SUBCRIBE ----------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const brandResolvers = {
  Query: { brands, brand },
  Mutation: { addBrand, deleteBrand },
  Subscription: {}
}
