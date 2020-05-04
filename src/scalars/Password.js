import { GraphQLScalarType, GraphQLString } from 'graphql'
import { ApolloError } from 'apollo-server-express'

export const passwordRegEx = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,50})/

class PasswordType extends GraphQLScalarType {
  constructor(type) {
    super({
      name: 'Password',
      parseValue: value => type.parseValue(value),
      serialize: value => type.serialize(value),
      parseLiteral: ast => {
        if (passwordRegEx.test(ast.value)) {
          return type.parseLiteral(ast)
        }
        throw new ApolloError(
          'Password failed validation. ',
          'INVALID_PASSWORD'
        )
      },
    })
  }
}

export { PasswordType }

export const passwordScalar = {
  Password: new PasswordType(GraphQLString),
}
