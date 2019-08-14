import { emailDirectives } from './email'
import { validIdDirectives } from './validId'

export { emailDirectives }

export const schemaDirectives = {
  ...emailDirectives,
  ...validIdDirectives
}

export default schemaDirectives
