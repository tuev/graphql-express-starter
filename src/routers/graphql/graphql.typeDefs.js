import { gql } from 'apollo-server-express'

/* ------------------------- TYPE FOR DIRECTIVE ------------------------- */

import { directives } from '@directives/directives.typeDef'

/* --------------------------- TYPE FOR SCALAR -------------------------- */

import { scalars } from '@scalars/scalars.typeDef'

/* --------------------------- TYPE FOR MODULE -------------------------- */

import { userType } from '@modules/User'
import { brandType } from '@modules/Brand'
import { categoryType } from '@modules/Category'
import { collectionType } from '@modules/Collection'
import { colorType } from '@modules/Color'
import { imageType } from '@modules/Image'
import { productType } from '@modules/Product'
import { sizeType } from '@modules/Size'
import { SKUType } from '@modules/SKU'

/* ------------------------- DEFINE GRAPHQL TYPEDEF ------------------------ */

const baseType = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`
const typeDefs = [
  baseType,
  scalars,
  directives,
  userType,
  brandType,
  categoryType,
  collectionType,
  colorType,
  imageType,
  productType,
  sizeType,
  SKUType
]

export default typeDefs
