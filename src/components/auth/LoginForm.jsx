// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Mail, Lock, LogIn } from 'lucide-react';
// import InputField from '../common/InputField';
// import Button from '../common/Button';
// import { validateEmail, validatePassword } from '../../utils/validators';

// export const LoginForm = ({ onSubmit, isLoading }) => {
//   const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const emailErr = validateEmail(formData.email);
//     const passErr = validatePassword(formData.password);

//     if (emailErr || passErr) {
//       setErrors({ email: emailErr, password: passErr });
//       return;
//     }

//     onSubmit(formData);
//   };

//   const handleQuickFill = (email, password) => {
//     const newData = { email, password, rememberMe: true };
//     setFormData(newData);
//     setErrors({});
//     onSubmit(newData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 w-full">
//       <InputField
//         label="Email Address"
//         type="email"
//         name="email"
//         value={formData.email}
//         onChange={handleChange}
//         placeholder="user@ecobazar.com"
//         icon={Mail}
//         error={errors.email}
//         required
//       />

//       <InputField
//         label="Password"
//         type="password"
//         name="password"
//         value={formData.password}
//         onChange={handleChange}
//         placeholder="••••••••"
//         icon={Lock}
//         error={errors.password}
//         required
//       />

//       <div className="flex items-center justify-between text-xs pt-1">
//         <label className="flex items-center gap-2 cursor-pointer text-slate-600">
//           <input
//             type="checkbox"
//             name="rememberMe"
//             checked={formData.rememberMe}
//             onChange={handleChange}
//             className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded border-slate-300"
//           />
//           Remember me
//         </label>
//         <Link to="/forgot-password" className="font-semibold text-emerald-600 hover:underline">
//           Forgot Password?
//         </Link>
//       </div>

//       <Button type="submit" isLoading={isLoading} className="w-full mt-2" size="lg">
//         <LogIn size={18} /> Sign In
//       </Button>

//       {/* Quick Demo Credentials Buttons */}
//       <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
//         <div className="flex items-center justify-between">
//           <span className="font-bold text-slate-700">Demo Accounts:</span>
//           <span className="text-[10px] text-slate-400 font-normal">Click to Sign In</span>
//         </div>
//         <div className="grid grid-cols-2 gap-2">
//           <button
//             type="button"
//             onClick={() => handleQuickFill('user@ecobazar.com', 'password123')}
//             className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-500 rounded-lg text-slate-700 hover:text-emerald-700 font-bold shadow-xs transition-all cursor-pointer group text-left"
//           >
//             <span className="text-base group-hover:scale-110 transition-transform">👤</span>
//             <div className="overflow-hidden">
//               <span className="block text-xs leading-none font-bold text-slate-800">User</span>
//               <span className="text-[10px] text-slate-400 font-normal font-mono block mt-0.5 truncate">user@ecobazar.com</span>
//             </div>
//           </button>

//           <button
//             type="button"
//             onClick={() => handleQuickFill('admin@ecobazar.com', 'password123')}
//             className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-500 rounded-lg text-slate-700 hover:text-emerald-700 font-bold shadow-xs transition-all cursor-pointer group text-left"
//           >
//             <span className="text-base group-hover:scale-110 transition-transform">🛡️</span>
//             <div className="overflow-hidden">
//               <span className="block text-xs leading-none font-bold text-slate-800">Admin</span>
//               <span className="text-[10px] text-slate-400 font-normal font-mono block mt-0.5 truncate">admin@ecobazar.com</span>
//             </div>
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default LoginForm;








import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import axios from 'axios';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { validateEmail, validatePassword } from '../../utils/validators';

export const LoginForm = ({ onSubmit, isLoading: externalLoading }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name] || errors.form) {
      setErrors(prev => ({ ...prev, [name]: '', form: '' }));
    }
  };

// লগইন করার মূল ফাংশন
const handleLoginSubmit = async (dataToSubmit) => {
  setLoading(true);
  setErrors({});

  try {
    // ব্যাকএন্ডের /login অ্যান্ডপয়েন্টে ডাটা পাঠানো হচ্ছে
    const response = await axios.post('http://localhost:5000/login', {
      email: dataToSubmit.email,
      password: dataToSubmit.password
    });

    // 👇 এই অংশটুকু পরিবর্তন হচ্ছে 👇
    if (response.data.success) {
      // ১. ইউজার ডাটা LocalStorage এ সেভ করা
      localStorage.setItem('user', JSON.stringify(response.data.data));

      // ২. Navbar কে জানানোর জন্য Custom Event ফায়ার করা
      window.dispatchEvent(new Event('authChange'));

      if (onSubmit) {
        onSubmit(response.data);
      }

      // ৩. ইউজার Admin নাকি সাধারণ User তা দেখে রিডাইরেক্ট করা
      navigate(response.data.data.role === 'admin' ? '/admin' : '/');
    } else {
      // ব্যাকএন্ড থেকে success: false আসলে
      setErrors({ form: response.data.message || 'Login failed' });
    }
  } catch (err) {
    console.error('Login Error:', err);
    setErrors({
      form: err.response?.data?.message || 'Server error occurred. Please try again.'
    });
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    handleLoginSubmit(formData);
  };

  const handleQuickFill = (email, password) => {
    const newData = { email, password, rememberMe: true };
    setFormData(newData);
    setErrors({});
    handleLoginSubmit(newData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {/* ব্যাকএন্ড থেকে আসা এরর মেসেজ বক্স */}
      {errors.form && (
        <div className="p-2.5 text-xs text-rose-600 bg-rose-50 rounded border border-rose-200 font-medium">
          {errors.form}
        </div>
      )}

      <InputField
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="user@ecobazar.com"
        icon={Mail}
        error={errors.email}
        required
      />

      <InputField
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        icon={Lock}
        error={errors.password}
        required
      />

      <div className="flex items-center justify-between text-xs pt-1">
        <label className="flex items-center gap-2 cursor-pointer text-slate-600">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded border-slate-300"
          />
          Remember me
        </label>
        <Link to="/forgot-password" className="font-semibold text-emerald-600 hover:underline">
          Forgot Password?
        </Link>
      </div>

      <Button type="submit" isLoading={loading || externalLoading} className="w-full mt-2" size="lg">
        <LogIn size={18} /> Sign In
      </Button>

      {/* Quick Demo Credentials Buttons */}
      <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-700">Demo Accounts:</span>
          <span className="text-[10px] text-slate-400 font-normal">Click to Sign In</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('user@ecobazar.com', 'password123')}
            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-500 rounded-lg text-slate-700 hover:text-emerald-700 font-bold shadow-xs transition-all cursor-pointer group text-left"
          >
            <span className="text-base group-hover:scale-110 transition-transform">👤</span>
            <div className="overflow-hidden">
              <span className="block text-xs leading-none font-bold text-slate-800">User</span>
              <span className="text-[10px] text-slate-400 font-normal font-mono block mt-0.5 truncate">user@ecobazar.com</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill('admin@ecobazar.com', 'password123')}
            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-500 rounded-lg text-slate-700 hover:text-emerald-700 font-bold shadow-xs transition-all cursor-pointer group text-left"
          >
            <span className="text-base group-hover:scale-110 transition-transform">🛡️</span>
            <div className="overflow-hidden">
              <span className="block text-xs leading-none font-bold text-slate-800">Admin</span>
              <span className="text-[10px] text-slate-400 font-normal font-mono block mt-0.5 truncate">admin@ecobazar.com</span>
            </div>
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
