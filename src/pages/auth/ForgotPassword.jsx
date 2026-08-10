import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

export const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sentMessage, setSentMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  //  Backend Connection 
  const handleForgotSubmit = async (formData) => {
    setIsLoading(true);
    setSentMessage('');
    setErrorMessage('');

    const emailToSend = typeof formData === 'string' ? formData : formData.email;

    try {
      const response = await axios.post('http://localhost:5000/forgotpassword', {
        email: emailToSend
      });

      if (response.data.message) {
        if (response.data.message === 'User not found') {
          setErrorMessage('User not found with this email address.');
        } else {
          setSentMessage(response.data.message);
        }
      }
    } catch (err) {
      console.error('Forgot Password Error:', err);
      setErrorMessage(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      );
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

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Message and next steps when email is sent successfully */}
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