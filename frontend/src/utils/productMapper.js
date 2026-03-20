// Placeholder image (data URL for a simple colored square)
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23e0e0e0" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23999"%3EImage Not Available%3C/text%3E%3C/svg%3E';

export const resolveProductImageUrl = (imagePath) => {
  if (!imagePath) return PLACEHOLDER_IMAGE;
  
  // If already a data URL (base64 from MongoDB), return as-is
  if (imagePath.startsWith('data:image/')) return imagePath;
  
  // If it's a long base64 string without data: prefix, add it
  if (imagePath.length > 100 && !imagePath.includes('/') && !imagePath.includes('\\')) {
    return `data:image/jpeg;base64,${imagePath}`;
  }

  return imagePath;
};

export const normalizeProduct = (product) => {
  const imageList = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : (product.image ? [product.image] : []);

  return {
    ...product,
    id: product._id,
    desc: product.description,
    discountedPrice: product.price,
    originalPrice: product.originalPrice ?? product.price,
    amount: product.price,
    image: product.image || imageList[0] || '',
    images: imageList,
    category: product.category || 'General',
    stock: product.stock ?? 0,
    rating: product.rating ?? 0,
    numReviews: product.numReviews ?? 0,
    reviews: Array.isArray(product.reviews) ? product.reviews : []
  };
};
