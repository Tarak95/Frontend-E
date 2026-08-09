import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post(`http://localhost:5000/verifyemail/${token}`);
        setMessage(response.data.message || 'Email verified successfully!');
        setStatus('success');
      } catch (err) {
        setMessage(err.response?.data?.message || 'Verification failed or expired token.');
        setStatus('error');
      }
    };

    if (token) verifyToken();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {status === 'loading' && (
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-10 h-10 animate-spin text-emerald-600" />
          <p className="text-slate-600">Verifying your email address...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center gap-3">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
          <h2 className="text-xl font-bold text-slate-800">Email Verified!</h2>
          <p className="text-slate-600">{message}</p>
          <Link to="/login" className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 transition">
            Go to Login
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center gap-3">
          <XCircle className="w-12 h-12 text-rose-500" />
          <h2 className="text-xl font-bold text-slate-800">Verification Failed</h2>
          <p className="text-slate-600">{message}</p>
          <Link to="/login" className="mt-4 px-6 py-2 bg-slate-800 text-white rounded-md font-medium hover:bg-slate-900 transition">
            Back to Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;