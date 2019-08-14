import { SchemaDirectiveVisitor } from 'graphql-tools'
import { defaultFieldResolver, GraphQLScalarType, GraphQLNonNull } from 'graphql'
import { ApolloError } from 'apollo-server-express'
import { EmailType, emailRegEx } from '@scalars/Email'

class EmailDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field) {
    this.wrapType(field)
    const { resolve = defaultFieldResolver } = field
    field.resolve = async function (source, args, context, info) {
      const email = await resolve(source, args, context, info)
      if (emailRegEx.test(email)) {
        return email
      }
      return new ApolloError('Email address failed validation', 'INVALID_EMAIL')
    }
  }

  visitInputFieldDefinition (field) {
    this.wrapType(field)
  }

  visitArgumentDefinition (argument) {
    this.wrapType(argument)
  }

  wrapType (field) {
    console.log(field, 'field')
    if (
      field.type instanceof GraphQLNonNull &&
      field.type.ofType instanceof GraphQLScalarType
    ) {
      field.type = new GraphQLNonNull(new EmailType(field.type.ofType))
    } else if (field.type instanceof GraphQLScalarType) {
      field.type = new EmailType(field.type)
    } else {
      throw new Error(`Not a scalar type: ${field.type}`)
    }
  }
}

export const emailDirectives = {
  email: EmailDirective
}
