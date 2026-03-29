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
    console.log('📦 [Products API] GET /api/products request received');
    const products = await Product.find().sort({ createdAt: -1 });
    console.log(`✅ [Products API] Successfully fetched ${products.length} products from database`);
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error(`❌ [Products API] Get products error: ${error.message}`);
    console.error('Stack:', error.stack);
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
  }
};

// @desc    Get products count for deployment/debug validation
// @route   GET /api/products/debug/count
// @access  Public
exports.getProductsDebugCount = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    console.log(`📊 [Products Debug] Product count: ${count}`);
    res.json({ success: true, count });
  } catch (error) {
    console.error(`❌ [Products Debug] Get product count error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to count products', error: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 [Product Detail] GET /api/products/${id}`);

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(id);
    if (!product) {
      console.warn(`⚠️ [Product Detail] Product not found for ID: ${id}`);
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    console.log(`✅ [Product Detail] Found product: ${product.name}`);
    res.json({ success: true, product });
  } catch (error) {
    console.error(`❌ [Product Detail] Error fetching product ${req.params.id}: ${error.message}`);
    console.error('Stack:', error.stack);
    res.status(500).json({ success: false, message: 'Failed to fetch product', error: error.message });
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

    console.log(`📝 [Create Product] Received request for product: ${name}`);

    const parsedPrice = toNumber(price);
    const parsedOriginalPrice = toNumber(originalPrice);
    const parsedStock = toNumber(stock);

    if (!name || !description || parsedPrice === undefined) {
      console.warn('⚠️ [Create Product] Validation failed: missing required fields');
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

    console.log(`✅ [Create Product] Product created successfully: ${product._id}`);
    res.status(201).json({ success: true, message: 'Product created', product });
  } catch (error) {
    console.error(`❌ [Create Product] Error creating product: ${error.message}`);
    console.error('Stack:', error.stack);
    res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Public (replace with admin auth middleware in production)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔄 [Update Product] PUT /api/products/${id}`);

    if (!isValidObjectId(id)) {
      console.warn(`⚠️ [Update Product] Invalid product ID: ${id}`);
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
      console.warn(`⚠️ [Update Product] Product not found for ID: ${id}`);
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    console.log(`✅ [Update Product] Product updated: ${product._id}`);
    res.json({ success: true, message: 'Product updated', product });
  } catch (error) {
    console.error(`❌ [Update Product] Error updating product ${req.params.id}: ${error.message}`);
    console.error('Stack:', error.stack);
    res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public (replace with admin auth middleware in production)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ [Delete Product] DELETE /api/products/${id}`);

    if (!isValidObjectId(id)) {
      console.warn(`⚠️ [Delete Product] Invalid product ID: ${id}`);
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      console.warn(`⚠️ [Delete Product] Product not found for ID: ${id}`);
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    console.log(`✅ [Delete Product] Product deleted: ${id}`);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error(`❌ [Delete Product] Error deleting product ${req.params.id}: ${error.message}`);
    console.error('Stack:', error.stack);
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
    
    console.log(`⭐ [Add Review] POST /api/products/${id}/reviews from user: ${userName}`);

    if (!isValidObjectId(id)) {
      console.warn(`⚠️ [Add Review] Invalid product ID: ${id}`);
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const parsedRating = Number(rating);
    if (!comment || !comment.trim()) {
      console.warn('⚠️ [Add Review] Review comment is required');
      return res.status(400).json({ success: false, message: 'Review comment is required' });
    }

    if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      console.warn(`⚠️ [Add Review] Invalid rating: ${rating}`);
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const trimmedUserName = (userName || '').trim();
    if (!trimmedUserName) {
      console.warn('⚠️ [Add Review] Reviewer name is required');
      return res.status(400).json({ success: false, message: 'Reviewer name is required' });
    }

    const product = await Product.findById(id);
    if (!product) {
      console.warn(`⚠️ [Add Review] Product not found for ID: ${id}`);
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

    console.log(`✅ [Add Review] Review added successfully. Product rating now: ${product.rating} (${product.numReviews} reviews)`);
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      rating: product.rating,
      numReviews: product.numReviews,
      product
    });
  } catch (error) {
    console.error(`❌ [Add Review] Error adding review to product ${req.params.id}: ${error.message}`);
    console.error('Stack:', error.stack);
    res.status(500).json({ success: false, message: 'Failed to add review', error: error.message });
  }
};