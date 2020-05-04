import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const { Schema } = mongoose

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    dob: Date,
    email: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
)

userSchema.methods = {
  hashPassword(rawPassword) {
    if (!rawPassword) {
      throw new Error('Password is invalid!')
    }

    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(rawPassword, salt)
  },
}

userSchema.pre('save', function(next) {
  this.password = this.hashPassword(this.password)
  next()
})

const User = mongoose.model('User', userSchema)

export default User
