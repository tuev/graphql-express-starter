import { merge } from 'lodash'

/* ----------------------------- CUSTOM SCALAR . ---------------------------- */

import { emailScalar, passwordScalar, slugScalar } from '@scalars'

/* --------------------------- RESOLVER FOR MODULE -------------------------- */

import { userResolvers } from '@modules/User'
import { brandResolvers } from '@modules/Brand'
import { categoryResolvers } from '@modules/Category'
import { collectionResolvers } from '@modules/Collection'
import { colorResolvers } from '@modules/Color'
import { imageResolvers } from '@modules/Image'
import { productResolvers } from '@modules/Product'
import { sizeResolvers } from '@modules/Size'
import { SKUResolvers } from '@modules/SKU'

/* ------------------------- DEFINE GRAPHQL RESOLVER ------------------------ */

const resolvers = merge(
  {},

  // scalars
  emailScalar,
  passwordScalar,
  slugScalar,

  // resolver
  userResolvers,
  brandResolvers,
  categoryResolvers,
  collectionResolvers,
  colorResolvers,
  imageResolvers,
  productResolvers,
  sizeResolvers,
  SKUResolvers
)

export default resolvers
