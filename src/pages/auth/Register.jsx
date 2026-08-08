import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import { useAuth } from '../../hooks/useAuth';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleRegisterSubmit = async (userData) => {
    setIsLoading(true);
    setAuthError('');
    try {
      const res = await register(userData);
      if (res.success) {
        navigate('/');
      } else {
        setAuthError(res.message || 'Registration failed');
      }
    } catch (err) {
      setAuthError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h1>
        <p className="text-xs text-slate-500 mt-1">Join EcoBazar for exclusive deals & instant checkout</p>
      </div>

      {authError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold">
          {authError}
        </div>
      )}

      <RegisterForm onSubmit={handleRegisterSubmit} isLoading={isLoading} />

      <div className="text-center pt-1">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
