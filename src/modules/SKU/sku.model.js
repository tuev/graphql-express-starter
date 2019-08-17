import mongoose from 'mongoose'
const { Schema } = mongoose

const skuSchema = new Schema(
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
    quantity: Number,
    price: String,
    discount: String,
    isPublic: {
      type: Boolean,
      default: false
    },
    color: Schema.Types.ObjectId,
    size: Schema.Types.ObjectId,
    brandType: Schema.Types.ObjectId,
    collectionType: Schema.Types.ObjectId,
    categoryType: Schema.Types.ObjectId,
    productType: Schema.Types.ObjectId,
    images: [Schema.Types.ObjectId]
  },
  { timestamps: true }
)

const SKU = mongoose.model('SKU', skuSchema)

export default SKU
