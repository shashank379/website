const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: {
      type: String,
      required: [true, 'Reviewer name is required'],
      trim: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

const productSchema = new mongoose.Schema(
  {
    legacyId: {
      type: String,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: 0
    },
    originalPrice: {
      type: Number,
      min: 0
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      trim: true
    },
    image: {
      type: String,
      trim: true,
      default: ''
    },
    images: {
      type: [String],
      default: []
    },
    category: {
      type: String,
      trim: true,
      default: 'General'
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0
    },
    reviews: [reviewSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);