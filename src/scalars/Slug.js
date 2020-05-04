import { GraphQLScalarType, GraphQLString } from 'graphql'
import { camelCase } from 'lodash'

class SlugType extends GraphQLScalarType {
  constructor(type) {
    super({
      name: 'Slug',
      parseValue: value => type.parseValue(value),
      serialize: value => type.serialize(value),
      parseLiteral: ast => {
        console.log(ast.value, 'value')
        return camelCase(ast.value)
      },
    })
  }
}

export { SlugType }

export const slugScalar = {
  Slug: new SlugType(GraphQLString),
}
