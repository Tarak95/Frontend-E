export const cartApi = {
  getCart: async () => {
    const cart = JSON.parse(localStorage.getItem('ecobazar_cart') || '[]');
    return { success: true, data: cart };
  },

  addToCart: async (product, quantity = 1) => {
    let cart = JSON.parse(localStorage.getItem('ecobazar_cart') || '[]');
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity,
        stock: product.stock || 20
      });
    }

    localStorage.setItem('ecobazar_cart', JSON.stringify(cart));
    return { success: true, data: cart, message: 'Added to cart!' };
  },

  updateQuantity: async (productId, quantity) => {
    let cart = JSON.parse(localStorage.getItem('ecobazar_cart') || '[]');
    if (quantity <= 0) {
      cart = cart.filter(item => item.id !== productId);
    } else {
      const item = cart.find(i => i.id === productId);
      if (item) item.quantity = quantity;
    }

    localStorage.setItem('ecobazar_cart', JSON.stringify(cart));
    return { success: true, data: cart };
  },

  removeFromCart: async (productId) => {
    let cart = JSON.parse(localStorage.getItem('ecobazar_cart') || '[]');
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('ecobazar_cart', JSON.stringify(cart));
    return { success: true, data: cart };
  },

  clearCart: async () => {
    localStorage.setItem('ecobazar_cart', JSON.stringify([]));
    return { success: true, data: [] };
  }
};
