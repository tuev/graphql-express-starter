import mongoose from 'mongoose'
const { Schema } = mongoose

const colorSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    value: String
  },
  { timestamps: true }
)

const Color = mongoose.model('ColorModel', colorSchema)

export default Color