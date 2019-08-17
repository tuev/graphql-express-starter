import { SchemaDirectiveVisitor } from 'graphql-tools'
import { defaultFieldResolver } from 'graphql'
import { ApolloError } from 'apollo-server-express'
import Brand from '@modules/Brand/brand.model'
import Category from '@modules/Category/category.model'
import Collection from '@modules/Collection/collection.model'
import Color from '@modules/Color/color.model'
import Image from '@modules/Image/image.model'
import Product from '@modules/Product/product.model'
import Size from '@modules/Size/size.model'
import SKU from '@modules/SKU/sku.model'
import User from '@modules/User/user.model'

const mapValidType = {
  BrandId: Brand,
  CollectionId: Collection,
  CategoryId: Category,
  ProductId: Product,
  ColorId: Color,
  ImageId: Image,
  SizeId: Size,
  SKUId: SKU,
  UserId: User
}

class ValidIdDirective extends SchemaDirectiveVisitor {
  visitInputFieldDefinition (field) {
    const { resolve = defaultFieldResolver } = field
    field.resolve = async function (...args) {
      console.log(args, 'args in resolve')

      const result = await resolve.apply(this, args)
      return `${result}10000`
    }
  }

  visitArgumentDefinition (argument, details) {
    const originalResolver = details.field.resolve
    details.field.resolve = async (...resolveArgs) => {
      const argName = argument.name
      const args = resolveArgs[1]
      const valueToValidate = args[argName]
      if (valueToValidate) {
        const brandValid = await mapValidType[this.args.type].findById(
          valueToValidate
        )
        if (!brandValid) {
          throw new ApolloError(
            `No valid ID for ${this.args.type}`,
            'INVALID_ARGUMENT'
          )
        }
      }

      return originalResolver.apply(this, resolveArgs)
    }
  }
}

export const validIdDirectives = {
  validId: ValidIdDirective
}
