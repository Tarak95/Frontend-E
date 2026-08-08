import React, { useState } from 'react';
import { Lock, CheckCircle } from 'lucide-react';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { validatePassword } from '../../utils/validators';

export const ResetPasswordForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const passErr = validatePassword(formData.password);
    const newErrors = {};

    if (passErr) newErrors.password = passErr;
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData.password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <InputField
        label="New Password"
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
        label="Confirm New Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="••••••••"
        icon={Lock}
        error={errors.confirmPassword}
        required
      />

      <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
        <CheckCircle size={18} /> Update Password
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
