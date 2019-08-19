import Category from './category.model'
import { get, pick } from 'lodash'
import { subscriptionCreator } from '@utils'
import * as categoryConst from './category.const'

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

const addCategory = async (_, args = {}, { pubsub } = {}) => {
  const categoryInfo = pick(args.input, ['name', 'description'])
  const slug = get(args, 'slug', categoryInfo.name)
  const categoryRelation = pick(args, [
    'brands',
    'collections',
    'SKUs',
    'images'
  ])
  const result = await Category.create({
    ...categoryInfo,
    ...categoryRelation,
    slug
  })
  pubsub.publish(categoryConst.CATEGORY_ADDED, result)
  return result
}

const updateCategory = async (_, args = {}, { pubsub } = {}) => {
  const id = get(args, 'id', '')
  const categoryInfo = pick(args.input, ['name', 'description'])
  const categoryRelation = pick(args, [
    'brands',
    'collections',
    'SKUs',
    'images'
  ])
  const result = await Category.findByIdAndUpdate(
    id,
    {
      ...categoryInfo,
      ...categoryRelation
    },
    { new: true }
  )
  pubsub.publish(categoryConst.CATEGORY_UPDATED, result)
  return result
}

const deleteCategory = async (_, { id }, { pubsub } = {}) => {
  const result = await Category.deleteOne({ _id: id })
  const deletedCount = get(result, 'deletedCount', 0)
  pubsub.publish(categoryConst.CATEGORY_DELETED, id)
  return !!deletedCount
}

/* ---------------------------- APPLY MIDDLEWARE ---------------------------- */

/* -------------------------------- SUBCRIBE -------------------------------- */

const categoryAdded = subscriptionCreator({ name: categoryConst.CATEGORY_ADDED })

const categoryUpdated = subscriptionCreator({
  name: categoryConst.CATEGORY_UPDATED
})

const categoryDeleted = subscriptionCreator({
  name: categoryConst.CATEGORY_DELETED
})

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                  */
/* -------------------------------------------------------------------------- */

export const categoryResolvers = {
  Query: { categories, category },
  Mutation: { addCategory, deleteCategory, updateCategory },
  Subscription: { categoryAdded, categoryUpdated, categoryDeleted }
}
