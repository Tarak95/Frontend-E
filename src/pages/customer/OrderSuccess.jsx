import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Home } from 'lucide-react';
import Button from '../../components/common/Button';

export const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order || { id: 'ORD-98214', totalAmount: 1198.0 };

  return (
    <div className="max-w-2xl mx-auto my-12 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 text-center space-y-6 shadow-xs">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
        <CheckCircle2 size={48} />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Order Placed Successfully!</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Thank you for shopping with EcoBazar. Your order has been logged and is currently being prepared.
        </p>
      </div>

      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 max-w-sm mx-auto text-xs space-y-1 text-slate-700 font-mono">
        <p className="font-bold text-slate-900">Order Reference: {order.id}</p>
        <p>Total Paid: ${order.totalAmount?.toFixed(2)}</p>
        <p className="text-emerald-600 font-bold">Status: Processing</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link to="/my-orders">
          <Button variant="outline">
            <Package size={18} /> View My Orders
          </Button>
        </Link>
        <Link to="/products">
          <Button>
            Continue Shopping <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
