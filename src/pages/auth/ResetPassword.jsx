import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';
import { authApi } from '../../api/authApi';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetSubmit = async (newPassword) => {
    setIsLoading(true);
    try {
      await authApi.resetPassword('sample-token', newPassword);
      setResetSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reset Password</h1>
        <p className="text-xs text-slate-500 mt-1">Type your new password to secure your account</p>
      </div>

      {resetSuccess ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold text-center">
          Password updated successfully! Redirecting to login...
        </div>
      ) : (
        <ResetPasswordForm onSubmit={handleResetSubmit} isLoading={isLoading} />
      )}

      <div className="text-center pt-2">
        <Link to="/login" className="text-xs font-bold text-slate-500 hover:text-slate-800">
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
