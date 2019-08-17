// import applyMiddleware from '@utils/applyMiddlewares'
// import { requireAuthorization } from '@middlewares'
import { get, pick } from 'lodash'
import Brand from './brand.model'
import Collection from '../Collection/collection.model'
import Category from '@modules/Category/category.model'
import SKU from '@modules/SKU/sku.model'
import Image from '../Image/image.model'

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
  const brandInfo = pick(args.input, ['name', 'description'])
  const brandRelation = pick(args, [
    'slug',
    'categories',
    'collections',
    'SKUs',
    'images'
  ])
  try {
    const result = await Brand.create({
      ...brandInfo,
      ...brandRelation,
      slug: brandRelation.slug || brandInfo.name
    })
    return result
  } catch (error) {
    console.error(error)
  }
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

const updateBrand = async (_, args = {}) => {
  const brandInfo = pick(args.input, ['name', 'description'])
  const brandRelation = pick(args, [
    'categories',
    'collections',
    'SKUs',
    'images'
  ])

  const brand = await Brand.findByIdAndUpdate(
    args.id,
    { ...brandInfo, ...brandRelation },
    {
      new: true
    }
  )
  return brand
}

/* --------------------------- BRAND RELATIONS -------------------------- */

const BrandRelations = {
  collections: async brand => {
    const collectionIdList = get(brand, 'collections', [])
    const collections = await Collection.find({ _id: { $in: collectionIdList } })
    return collections
  },
  categories: async brand => {
    const categoryIdList = get(brand, 'categories', [])
    const categories = await Category.find({ _id: { $in: categoryIdList } })
    return categories
  },
  SKUs: async brand => {
    const skuIdList = get(brand, 'SKUs', [])
    const SKUs = await SKU.find({ _id: { $in: skuIdList } })
    return SKUs
  },
  images: async brand => {
    const imageIdList = get(brand, 'images', [])
    const images = await Image.find({ _id: { $in: imageIdList } })
    return images
  }
}

/* ---------------------------- APPLY MIDDLEWARE ---------------------------- */

/* -------------------------------- SUBCRIBE -------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                  */
/* -------------------------------------------------------------------------- */

export const brandResolvers = {
  Query: { brands, brand },
  Mutation: { addBrand, deleteBrand, updateBrand },
  Subscription: {},
  Brand: BrandRelations
}
