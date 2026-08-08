import { CATEGORIES } from '../utils/constants';

export const productApi = {
  getProducts: async (filters = {}) => {
    let products = JSON.parse(localStorage.getItem('ecobazar_products') || '[]');

    const { category, search, minPrice, maxPrice, sortBy } = filters;

    if (category && category !== 'all') {
      products = products.filter(p => p.category === category || p.categorySlug === category);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.categoryName.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (minPrice) {
      products = products.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }

    if (sortBy) {
      if (sortBy === 'price-low') products.sort((a, b) => a.price - b.price);
      if (sortBy === 'price-high') products.sort((a, b) => b.price - a.price);
      if (sortBy === 'rating') products.sort((a, b) => b.rating - a.rating);
      if (sortBy === 'newest') products.sort((a, b) => (b.id > a.id ? 1 : -1));
    }

    return { success: true, data: products, total: products.length };
  },

  getProductById: async (id) => {
    const products = JSON.parse(localStorage.getItem('ecobazar_products') || '[]');
    const product = products.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return { success: true, data: product };
  },

  createProduct: async (productData) => {
    const products = JSON.parse(localStorage.getItem('ecobazar_products') || '[]');
    const newProduct = {
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      images: [productData.image],
      ...productData,
      price: Number(productData.price),
      oldPrice: productData.oldPrice ? Number(productData.oldPrice) : Number(productData.price) * 1.2,
      stock: Number(productData.stock || 10)
    };

    products.unshift(newProduct);
    localStorage.setItem('ecobazar_products', JSON.stringify(products));
    return { success: true, data: newProduct, message: 'Product created successfully' };
  },

  updateProduct: async (id, productData) => {
    const products = JSON.parse(localStorage.getItem('ecobazar_products') || '[]');
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');

    products[index] = {
      ...products[index],
      ...productData,
      price: Number(productData.price || products[index].price),
      stock: Number(productData.stock !== undefined ? productData.stock : products[index].stock)
    };

    localStorage.setItem('ecobazar_products', JSON.stringify(products));
    return { success: true, data: products[index], message: 'Product updated successfully' };
  },

  deleteProduct: async (id) => {
    let products = JSON.parse(localStorage.getItem('ecobazar_products') || '[]');
    products = products.filter(p => p.id !== id);
    localStorage.setItem('ecobazar_products', JSON.stringify(products));
    return { success: true, message: 'Product deleted successfully' };
  },

  getCategories: async () => {
    return { success: true, data: CATEGORIES };
  }
};
