import React, { useState } from 'react';
import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validators';

export const RegisterForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 w-full">
      <InputField
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Mahdiyat Mim"
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
        placeholder="mahdiyat@example.com"
        icon={Mail}
        error={errors.email}
        required
      />

      <InputField
        label="Phone Number"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="+880 1711 000111"
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

      <Button type="submit" isLoading={isLoading} className="w-full mt-2" size="lg">
        <UserPlus size={18} /> Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;
