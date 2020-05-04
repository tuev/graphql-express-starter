import User from './user.model'
import applyMiddleware from '@utils/applyMiddlewares'
import { requireAuthorization } from '@middlewares'
import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'

/* ------------------------------- QUERY ------------------------------- */

const getUserList = async () => {
  const result = await User.find({})
  return result
}

const signin = async (_, { username, password }) => {
  const user = await User.findOne({ username }, 'username email password dob')
  if (!user) {
    throw new Error('Invalid username')
  }
  const isValid = bcrypt.compareSync(password, user.password)
  if (isValid) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_IN_MS,
    })
    delete user.password
    return {
      token,
      user,
    }
  }
  throw new Error('Invalid password')
}

/* ----------------------------- MUTATION ---------------------------- */

const signup = async (_, { username, password, email }) => {
  const user = await User.create({ username, password, email })
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN_MS,
  })

  return {
    token,
    user,
  }
}

/* ---------------------------- APPLY MIDDLEWARE ---------------------------- */

const users = applyMiddleware([requireAuthorization])(getUserList)

/* ------------------------------ SUBCRIBE ----------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const userResolvers = {
  Query: { users, signin },
  Mutation: { signup },
  Subscription: {},
}
