import { GraphQLScalarType, GraphQLString } from 'graphql'
import { ApolloError } from 'apollo-server-express'
export const emailRegEx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

class EmailType extends GraphQLScalarType {
  constructor(type) {
    super({
      name: 'Email',
      parseValue: value => type.parseValue(value),
      serialize: value => type.serialize(value),
      parseLiteral: ast => {
        if (emailRegEx.test(ast.value)) {
          return type.parseLiteral(ast)
        }
        throw new ApolloError(
          'Email address failed validation',
          'INVALID_EMAIL'
        )
      },
    })
  }
}

export { EmailType }

export const emailScalar = {
  Email: new EmailType(GraphQLString),
}
