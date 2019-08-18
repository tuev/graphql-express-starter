import Size from './size.model'
import { pick, get } from 'lodash'

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

const addSize = async (_, args) => {
  const newSize = pick(args.input, ['name', 'slug', 'value', 'description'])
  const result = await Size.create({
    ...newSize,
    slug: newSize.slug || newSize.name
  })
  return result
}

const deleteSize = async (_, { id }) => {
  const result = await Size.deleteOne({ _id: id })
  return !!get(result, 'deletedCount', false)
}

/* ---------------------------- APPLY MIDDLEWARE ---------------------------- */

/* ------------------------------ SUBCRIBE ----------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const sizeResolvers = {
  Query: { sizes, size },
  Mutation: { addSize, deleteSize },
  Subscription: {}
}
