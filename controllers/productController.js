const mongoose = require('mongoose');
const Product = require('../models/Product');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const toNumber = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Public (replace with admin auth middleware in production)
exports.createProduct = async (req, res) => {
  try {
    const {
      legacyId,
      name,
      price,
      originalPrice,
      description,
      image,
      images,
      category,
      stock
    } = req.body;

    const parsedPrice = toNumber(price);
    const parsedOriginalPrice = toNumber(originalPrice);
    const parsedStock = toNumber(stock);

    if (!name || !description || parsedPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'name, price, and description are required'
      });
    }

    const product = await Product.create({
      legacyId,
      name,
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      description,
      image: image || '',
      images: Array.isArray(images) ? images : [],
      category: category || 'General',
      stock: parsedStock ?? 0
    });

    res.status(201).json({ success: true, message: 'Product created', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Public (replace with admin auth middleware in production)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const updatePayload = {};
    const fields = ['legacyId', 'name', 'description', 'image', 'category'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updatePayload[field] = req.body[field];
      }
    });

    const parsedPrice = toNumber(req.body.price);
    if (parsedPrice !== undefined) updatePayload.price = parsedPrice;

    const parsedOriginalPrice = toNumber(req.body.originalPrice);
    if (parsedOriginalPrice !== undefined) updatePayload.originalPrice = parsedOriginalPrice;

    const parsedStock = toNumber(req.body.stock);
    if (parsedStock !== undefined) updatePayload.stock = parsedStock;

    if (req.body.images !== undefined) {
      updatePayload.images = Array.isArray(req.body.images) ? req.body.images : [];
    }

    const product = await Product.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product updated', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public (replace with admin auth middleware in production)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Public
exports.addProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, userName, rating, comment } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const parsedRating = Number(rating);
    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: 'Review comment is required' });
    }

    if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const trimmedUserName = (userName || '').trim();
    if (!trimmedUserName) {
      return res.status(400).json({ success: false, message: 'Reviewer name is required' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.reviews.push({
      user: isValidObjectId(user) ? user : undefined,
      userName: trimmedUserName,
      rating: parsedRating,
      comment: comment.trim()
    });

    product.numReviews = product.reviews.length;
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = product.numReviews > 0 ? Number((totalRating / product.numReviews).toFixed(1)) : 0;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      rating: product.rating,
      numReviews: product.numReviews,
      product
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ success: false, message: 'Failed to add review', error: error.message });
  }
};