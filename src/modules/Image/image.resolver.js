import Image from './image.model'
import { pick, get } from 'lodash'
import { subscriptionCreator } from '@utils'
import * as imageConst from './image.constant'
import fakeImg from './fake'

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

const fakeImage = async (_, args = {}) => {
  const result = []
  const quantity = get(args, 'quantity', 10)
  for (let i = 0; i < quantity; i++) {
    const newImage = fakeImg()
    try {
      const isImageExist = await Image.count({ slug: newImage.slug })
      console.log(isImageExist, newImage)
      if (!isImageExist) {
        const image = await Image.create(newImage)
        result.push(image)
      }
    } catch (error) {}
  }

  return result
}

const addImage = async (_, args = {}, { pubsub }) => {
  const newImage = pick(args.input, ['name', 'url', 'description'])
  const image = await Image.create({
    ...newImage,
    slug: args.slug || newImage.name
  })

  pubsub.publish(imageConst.IMAGE_ADDED, image)
  return image
}

const updateImage = async (_, args = {}, { pubsub }) => {
  const newImage = pick(args.input, ['name', 'url', 'description'])
  const image = await Image.create(
    args.id,
    {
      ...newImage
    },
    { new: true }
  )

  pubsub.publish(imageConst.IMAGE_UPDATED, image)
  return image
}

const deleteImage = async (_, { id }, { pubsub } = {}) => {
  const result = await Image.deleteOne({ _id: id })
  pubsub.publish(imageConst.IMAGE_DELETED, id)
  return !!get(result, 'deletedCount', false)
}

/* ---------------------------- APPLY MIDDLEWARE ---------------------------- */

/* -------------------------------- SUBCRIBE -------------------------------- */

const imageAdded = subscriptionCreator({ name: imageConst.IMAGE_ADDED })
const imageUpdated = subscriptionCreator({ name: imageConst.IMAGE_UPDATED })
const imageDeleted = subscriptionCreator({ name: imageConst.IMAGE_DELETED })

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                  */
/* -------------------------------------------------------------------------- */

export const imageResolvers = {
  Query: { images, image },
  Mutation: { addImage, deleteImage, updateImage, fakeImage },
  Subscription: { imageAdded, imageUpdated, imageDeleted }
}
