import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import { authApi } from '../../api/authApi';

export const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sentMessage, setSentMessage] = useState('');

  const handleForgotSubmit = async (email) => {
    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      setSentMessage(res.message || 'Password reset link sent to your inbox.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Forgot Password</h1>
        <p className="text-xs text-slate-500 mt-1">Enter your email and we'll send a password recovery link</p>
      </div>

      {sentMessage ? (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold leading-relaxed">
            {sentMessage}
          </div>
          <Link to="/reset-password" className="block text-center text-xs font-bold text-emerald-600 hover:underline">
            Proceed to enter reset token / new password →
          </Link>
        </div>
      ) : (
        <ForgotPasswordForm onSubmit={handleForgotSubmit} isLoading={isLoading} />
      )}

      <div className="text-center pt-2">
        <Link to="/login" className="text-xs font-bold text-slate-500 hover:text-slate-800">
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
