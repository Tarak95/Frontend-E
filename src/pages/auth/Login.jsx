import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../hooks/useAuth';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleLoginSubmit = async (credentials) => {
    setIsLoading(true);
    setAuthError('');
    try {
      const res = await login(credentials);
      if (res.success) {
        if (res.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setAuthError(res.message || 'Invalid email or password credentials');
      }
    } catch (err) {
      setAuthError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
        <p className="text-xs text-slate-500 mt-1">Sign in to your EcoBazar customer account</p>
      </div>

      {authError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold">
          {authError}
        </div>
      )}

      <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />

      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-emerald-600 hover:underline">
            Register for Free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
