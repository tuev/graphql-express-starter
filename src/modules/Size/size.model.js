import mongoose from 'mongoose'
const { Schema } = mongoose

const sizeSchema = new Schema(
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
    value: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      default: 'M',
    },
    description: String,
    // SKUs: [Schema.Types.ObjectId],
  },
  { timestamps: true }
)

const Size = mongoose.model('Size', sizeSchema)

export default Size
