import mongoose from 'mongoose'
const { Schema } = mongoose

const collectionSchema = new Schema(
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
    url: String,
    // brands: [Schema.Types.ObjectId],
    // categories: [Schema.Types.ObjectId],
    images: [Schema.Types.ObjectId]
    // SKUs: [Schema.Types.ObjectId]
  },
  { timestamps: true }
)

const Collection = mongoose.model('Collection', collectionSchema)

export default Collection
