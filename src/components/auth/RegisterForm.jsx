// import React, { useState } from 'react';
// import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react';
// import InputField from '../common/InputField';
// import Button from '../common/Button';
// import { validateEmail, validatePassword, validateRequired } from '../../utils/validators';

// export const RegisterForm = ({ onSubmit, isLoading }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     agreeTerms: false
//   });
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
//     const newErrors = {};

//     const nameErr = validateRequired(formData.name, 'Full name');
//     const emailErr = validateEmail(formData.email);
//     const passErr = validatePassword(formData.password);

//     if (nameErr) newErrors.name = nameErr;
//     if (emailErr) newErrors.email = emailErr;
//     if (passErr) newErrors.password = passErr;
//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }
//     if (!formData.agreeTerms) {
//       newErrors.agreeTerms = 'You must accept the Terms and Conditions';
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     onSubmit(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-3.5 w-full">
//       <InputField
//         label="Full Name"
//         name="name"
//         value={formData.name}
//         onChange={handleChange}
//         placeholder="Lucas"
//         icon={User}
//         error={errors.name}
//         required
//       />

//       <InputField
//         label="Email Address"
//         type="email"
//         name="email"
//         value={formData.email}
//         onChange={handleChange}
//         placeholder="lucas@example.com"
//         icon={Mail}
//         error={errors.email}
//         required
//       />

//       <InputField
//         label="Phone Number"
//         name="phone"
//         value={formData.phone}
//         onChange={handleChange}
//         placeholder="+12123658444"
//         icon={Phone}
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

//       <InputField
//         label="Confirm Password"
//         type="password"
//         name="confirmPassword"
//         value={formData.confirmPassword}
//         onChange={handleChange}
//         placeholder="••••••••"
//         icon={Lock}
//         error={errors.confirmPassword}
//         required
//       />

//       <div className="pt-1">
//         <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
//           <input
//             type="checkbox"
//             name="agreeTerms"
//             checked={formData.agreeTerms}
//             onChange={handleChange}
//             className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded border-slate-300"
//           />
//           I agree to the <span className="text-emerald-600 font-semibold underline">Terms & Conditions</span>
//         </label>
//         {errors.agreeTerms && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.agreeTerms}</p>}
//       </div>

//       <Button type="submit" isLoading={isLoading} className="w-full mt-2" size="lg">
//         <UserPlus size={18} /> Create Account
//       </Button>
//     </form>
//   );
// };

// export default RegisterForm;







import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validators';

export const RegisterForm = ({ onSubmit, isLoading: externalLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // পুরনো সব এরর ক্লিয়ার করা হলো
    setSuccessMsg('');

    const newErrors = {};
    const nameErr = validateRequired(formData.name, 'Full name');
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);

    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must accept the Terms and Conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/registration', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      // রেজিস্ট্রেশন সফল মেসেজ
      setSuccessMsg(response.data.message || 'Registration Successful. Please check your email.');

      // ফর্ম ক্লিয়ার করা
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      });

      // নোট: onSubmit(response.data); লাইনটি কমেন্ট/বাদ দেওয়া হলো যেন প্যারেন্ট কম্পোনেন্টের এরর এখানে না আসে

    } catch (err) {
      console.error('Registration Error:', err);
      setErrors({
        form: err.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 w-full">
      {/* এরর মেসেজ বক্স */}
      {errors.form && (
        <div className="p-2.5 text-xs text-rose-600 bg-rose-50 rounded border border-rose-200">
          {errors.form}
        </div>
      )}

      {/* সাকসেস মেসেজ বক্স */}
      {successMsg && (
        <div className="p-2.5 text-xs text-emerald-600 bg-emerald-50 rounded border border-emerald-200">
          {successMsg}
        </div>
      )}

      <InputField
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Lucas"
        icon={User}
        error={errors.name}
        required
      />

      <InputField
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="lucas@example.com"
        icon={Mail}
        error={errors.email}
        required
      />

      <InputField
        label="Phone Number"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="+12123658444"
        icon={Phone}
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

      <InputField
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="••••••••"
        icon={Lock}
        error={errors.confirmPassword}
        required
      />

      <div className="pt-1">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded border-slate-300"
          />
          I agree to the <span className="text-emerald-600 font-semibold underline">Terms & Conditions</span>
        </label>
        {errors.agreeTerms && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.agreeTerms}</p>}
      </div>

      <Button type="submit" isLoading={loading || externalLoading} className="w-full mt-2" size="lg">
        <UserPlus size={18} /> Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;