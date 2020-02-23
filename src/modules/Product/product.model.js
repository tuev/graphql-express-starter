import mongoose from 'mongoose'
const { Schema } = mongoose

const productSchema = new Schema(
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
    description: String,
    isPublic: Boolean,
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    status: {
      type: Boolean,
      default: false
    },
    releaseDate: {
      type: Date,
      default: new Date()
    },
    rate: {
      type: Number,
      default: 0
    }
    // SKUs: [Schema.Types.ObjectId]
  },
  { timestamps: true }
)

const Product = mongoose.model('Product', productSchema)

export default Product
