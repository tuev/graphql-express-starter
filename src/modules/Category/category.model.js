import mongoose from 'mongoose'
const { Schema } = mongoose

const categorySchema = new Schema(
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
    description: String,
    images: [Schema.Types.ObjectId],
    // brands: [Schema.Types.ObjectId],
    // collections: [Schema.Types.ObjectId],
    // SKUs: [Schema.Types.ObjectId]
  },
  { timestamps: true }
)

const Category = mongoose.model('Category', categorySchema)

export default Category
