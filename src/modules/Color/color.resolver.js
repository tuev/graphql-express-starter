import Color from './color.model'
import { pick, get } from 'lodash'
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

const addColor = async (_, args = {}) => {
  const newColor = pick(args.input, ['name', 'slug', 'value', 'description'])
  const color = await Color.create({
    ...newColor,
    value: newColor.value || 'white',
    slug: newColor.slug || newColor.name
  })
  return color
}

const deleteColor = async (_, { id }) => {
  const result = await Color.deleteOne({ _id: id })
  const deletedColor = get(result, 'deletedCount', false)
  return !!deletedColor
}

/* ---------------------------- APPLY MIDDLEWARE ---------------------------- */

/* ------------------------------ SUBCRIBE ----------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const colorResolvers = {
  Query: { colors, color },
  Mutation: { addColor, deleteColor },
  Subscription: {}
}
