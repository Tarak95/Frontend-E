export const orderApi = {
  createOrder: async (orderData) => {
    const orders = JSON.parse(localStorage.getItem('ecobazar_orders') || '[]');
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      status: 'Processing',
      ...orderData
    };

    orders.unshift(newOrder);
    localStorage.setItem('ecobazar_orders', JSON.stringify(orders));
    // Clear cart after order placed
    localStorage.setItem('ecobazar_cart', JSON.stringify([]));

    return { success: true, data: newOrder, message: 'Order created successfully' };
  },

  getMyOrders: async (userId) => {
    const orders = JSON.parse(localStorage.getItem('ecobazar_orders') || '[]');
    const userOrders = userId ? orders.filter(o => o.userId === userId || o.customerEmail === userId) : orders;
    return { success: true, data: userOrders };
  },

  getOrderById: async (id) => {
    const orders = JSON.parse(localStorage.getItem('ecobazar_orders') || '[]');
    const order = orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    return { success: true, data: order };
  },

  getAllOrders: async () => {
    const orders = JSON.parse(localStorage.getItem('ecobazar_orders') || '[]');
    return { success: true, data: orders };
  },

  updateOrderStatus: async (id, status) => {
    const orders = JSON.parse(localStorage.getItem('ecobazar_orders') || '[]');
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Order not found');

    orders[index].status = status;
    localStorage.setItem('ecobazar_orders', JSON.stringify(orders));
    return { success: true, data: orders[index], message: 'Order status updated' };
  }
};
