import mongoose from 'mongoose'
const { Schema } = mongoose

const colorSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    value: String,
    description: String,
  },
  { timestamps: true }
)

const Color = mongoose.model('Color', colorSchema)

export default Color
