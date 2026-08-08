import React, { createContext, useState, useEffect } from 'react';
import { cartApi } from '../api/cartApi';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await cartApi.getCart();
      setCart(res.data || []);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product, quantity = 1) => {
    const res = await cartApi.addToCart(product, quantity);
    setCart(res.data);
    return res;
  };

  const updateQuantity = async (productId, quantity) => {
    const res = await cartApi.updateQuantity(productId, quantity);
    setCart(res.data);
    return res;
  };

  const removeFromCart = async (productId) => {
    const res = await cartApi.removeFromCart(productId);
    setCart(res.data);
    return res;
  };

  const clearCart = async () => {
    const res = await cartApi.clearCart();
    setCart([]);
    return res;
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
