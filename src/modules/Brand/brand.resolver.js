// import applyMiddleware from '@utils/applyMiddlewares'
// import { requireAuthorization } from '@middlewares'
import { get, pick } from 'lodash'

import { BRAND_ADDED, BRAND_UPDATED, BRAND_DELETED } from './brand.constant'
import { subscriptionCreator } from '@utils'

import Brand from '@modules/Brand/brand.model'

import Image from '@modules/Image/image.model'
import fakeBr from './fake'

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

const fakeBrand = async (_, args = {}) => {
  const result = []
  const images = await Image.find({}).select('_id')
  const quantity = get(args, 'quantity', 10)
  for (let i = 0; i < quantity; i++) {
    const newBrand = fakeBr(images)
    try {
      const isBrandExist = await Brand.count({ slug: newBrand.slug })
      if (!isBrandExist) {
        const brand = await Brand.create(newBrand)
        result.push(brand)
      }
    } catch (error) {}
  }

  return result
}

const addBrand = async (_, args = {}, context) => {
  const brandInfo = pick(args.input, ['name', 'description'])
  const slug = get(args, 'slug', brandInfo.name)
  const brandRelation = pick(args, [
    'slug',
    // 'categories',
    // 'collections',
    // 'SKUs',
    'images'
  ])
  try {
    const result = await Brand.create({
      ...brandInfo,
      ...brandRelation,
      slug
    })
    context.pubsub.publish(BRAND_ADDED, result)

    return result
  } catch (error) {
    console.error(error)
  }
}

const deleteBrand = async (_, { id }, context) => {
  try {
    const result = await Brand.deleteOne({ _id: id })
    const deleteCount = get(result, 'deletedCount', 0)
    context.pubsub.publish(BRAND_DELETED, id)
    return !!deleteCount
  } catch (error) {
    return false
  }
}

const updateBrand = async (_, args = {}, context) => {
  const brandInfo = pick(args.input, ['name', 'description'])
  console.log(brandInfo, 'INFO UPDATE --------------------------')
  const brandRelation = pick(args, [
    // 'categories',
    // 'collections',
    // 'SKUs',
    'images'
  ])

  const brand = await Brand.findByIdAndUpdate(
    args.id,
    { ...brandInfo, ...brandRelation },
    {
      new: true
    }
  )
  console.log(brand, 'banrd')
  context.pubsub.publish(BRAND_UPDATED, brand)
  return brand
}

/* --------------------------- BRAND RELATIONS -------------------------- */

const BrandRelations = {
  // collections: async brand => {
  //   const collectionIdList = get(brand, 'collections', [])
  //   const collections = await Collection.find({
  //     _id: { $in: collectionIdList },
  //   })
  //   return collections
  // },
  // categories: async brand => {
  //   const categoryIdList = get(brand, 'categories', [])
  //   const categories = await Category.find({ _id: { $in: categoryIdList } })
  //   return categories
  // },
  // SKUs: async brand => {
  //   const skuIdList = get(brand, 'SKUs', [])
  //   const SKUs = await SKU.find({ _id: { $in: skuIdList } })
  //   return SKUs
  // },
  images: async brand => {
    const imageIdList = get(brand, 'images', [])
    const images = await Image.find({ _id: { $in: imageIdList } })
    return images
  }
}

/* ---------------------------- APPLY MIDDLEWARE ---------------------------- */

/* -------------------------------- SUBCRIBE -------------------------------- */

const brandAdded = subscriptionCreator({ name: BRAND_ADDED })

const brandUpdated = subscriptionCreator({ name: BRAND_UPDATED })

const brandDeleted = subscriptionCreator({ name: BRAND_DELETED })

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                  */
/* -------------------------------------------------------------------------- */

export const brandResolvers = {
  Query: { brands, brand },
  Mutation: { addBrand, deleteBrand, updateBrand, fakeBrand },
  Subscription: { brandAdded, brandUpdated, brandDeleted },
  Brand: BrandRelations
}
