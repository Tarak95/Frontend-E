import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressForm from '../../components/checkout/AddressForm';
import OrderSummary from '../../components/checkout/OrderSummary';
import Button from '../../components/common/Button';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { orderApi } from '../../api/orderApi';
import { validateEmail, validateRequired } from '../../utils/validators';

export const Checkout = () => {
  const { cart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address || '',
    city: 'Dhaka',
    postalCode: '1213',
    paymentMethod: 'Cash on Delivery'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const nameErr = validateRequired(formData.fullName, 'Full name');
    const emailErr = validateEmail(formData.email);
    const streetErr = validateRequired(formData.street, 'Street address');

    if (nameErr) newErrors.fullName = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (streetErr) newErrors.street = streetErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        userId: user?.id || 'guest',
        customerName: formData.fullName,
        customerEmail: formData.email,
        items: cart,
        totalAmount: cartTotal > 50 ? cartTotal : cartTotal + 10,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode
        },
        paymentMethod: formData.paymentMethod
      };

      const res = await orderApi.createOrder(orderPayload);
      if (res.success) {
        navigate('/order-success', { state: { order: res.data } });
      }
    } catch (err) {
      console.error('Checkout error:', err);
      navigate('/order-failed', { state: { error: err.message } });
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-xs text-slate-500">Complete your delivery address and payment details</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AddressForm formData={formData} onChange={handleChange} errors={errors} />
        </div>

        <div className="space-y-6">
          <OrderSummary items={cart} totalAmount={cartTotal} shippingCost={10} />

          <Button type="submit" isLoading={submitting} size="lg" className="w-full">
            Confirm & Place Order
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
