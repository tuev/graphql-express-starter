import Image from './image.model'
import { pick, get } from 'lodash'

/* ------------------------------- QUERY ------------------------------- */

const images = async () => {
  const images = await Image.find({})
  return images
}

const image = async (_, { id }) => {
  const image = await Image.findById(id)
  return image
}

/* ----------------------------- MUTATION ---------------------------- */

const addImage = async (_, args = {}) => {
  const newImage = pick(args.input, ['name', 'url', 'slug', 'description'])
  const image = await Image.create({
    ...newImage,
    slug: newImage.slug || newImage.name
  })
  return image
}

const deleteImage = async (_, { id }) => {
  const result = await Image.deleteOne({ _id: id })
  return !!get(result, 'deletedCount', false)
}

/* ---------------------------- APPLY MIDDLEWARE ---------------------------- */

/* ------------------------------ SUBCRIBE ----------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                  */
/* -------------------------------------------------------------------------- */

export const imageResolvers = {
  Query: { images, image },
  Mutation: { addImage, deleteImage },
  Subscription: {}
}
