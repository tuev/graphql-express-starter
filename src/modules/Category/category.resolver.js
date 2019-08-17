import Category from './category.model'
import { get, pick } from 'lodash'

/* ------------------------------- QUERY ------------------------------- */

const categories = async () => {
  const categories = await Category.find({})
  return categories
}

const category = async (_, { id }) => {
  const category = await Category.findById(id)
  return category
}

/* ----------------------------- MUTATION ---------------------------- */

const addCategory = async (_, args = {}) => {
  const newCategory = pick(args.input, ['name', 'description', 'slug'])
  const result = await Category.create({
    ...newCategory,
    slug: newCategory.slug || newCategory.name
  })
  return result
}

const deleteCategory = async (_, { id }) => {
  const result = await Category.deleteOne({ _id: id })
  const deletedCount = get(result, 'deletedCount', 0)
  return !!deletedCount
}

/* ---------------------------- APPLY MIDDLEWARE ---------------------------- */

/* ------------------------------ SUBCRIBE ----------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const categoryResolvers = {
  Query: { categories, category },
  Mutation: { addCategory, deleteCategory },
  Subscription: {}
}
