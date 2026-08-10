import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetSubmit = async (formData) => {
    setIsLoading(true);
    setErrorMessage('');

    const newPassword = typeof formData === 'object' ? (formData.newPassword || formData.password) : formData;
    const confirmPassword = typeof formData === 'object' ? (formData.confirmPassword || formData.password) : formData;

    if (!newPassword || !confirmPassword) {
      setErrorMessage('Please fill in both password fields.');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/resetpassword/${token}`, {
        newPassword,
        confirmPassword
      });

      if (response.status === 200) {
        setResetSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Reset Password Error:', err);
      setErrorMessage(
        err.response?.data?.message || 'Invalid or expired token. Please try again.'
      );
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

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

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