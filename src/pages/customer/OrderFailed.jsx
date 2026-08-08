import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { XCircle, RefreshCw, ShoppingCart } from 'lucide-react';
import Button from '../../components/common/Button';

export const OrderFailed = () => {
  const location = useLocation();
  const errorMessage = location.state?.error || 'There was a problem processing your payment transaction.';

  return (
    <div className="max-w-2xl mx-auto my-12 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 text-center space-y-6 shadow-xs">
      <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
        <XCircle size={48} />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Order Processing Failed</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">{errorMessage}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link to="/checkout">
          <Button>
            <RefreshCw size={18} /> Retry Checkout
          </Button>
        </Link>
        <Link to="/cart">
          <Button variant="outline">
            <ShoppingCart size={18} /> Return to Cart
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderFailed;
