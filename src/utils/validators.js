// // Form and Input Validators

// export const validateEmail = (email) => {
//   if (!email) return 'Email is required';
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) return 'Please enter a valid email address';
//   return '';
// };

// export const validatePassword = (password) => {
//   if (!password) return 'Password is required';
//   if (password.length < 6) return 'Password must be at least 6 characters long';
//   return '';
// };

// export const validatePhone = (phone) => {
//   if (!phone) return 'Phone number is required';
//   if (phone.trim().length < 8) return 'Please enter a valid phone number';
//   return '';
// };

// export const validateRequired = (value, fieldName = 'This field') => {
//   if (!value || (typeof value === 'string' && !value.trim())) {
//     return `${fieldName} is required`;
//   }
//   return '';
// };

// export const validateProductForm = (formData) => {
//   const errors = {};
//   if (!formData.name || !formData.name.trim()) errors.name = 'Product name is required';
//   if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) errors.price = 'Valid positive price is required';
//   if (!formData.category) errors.category = 'Category selection is required';
//   if (formData.stock === '' || isNaN(formData.stock) || Number(formData.stock) < 0) errors.stock = 'Valid stock count is required';
//   if (!formData.image) errors.image = 'Product main image URL is required';
//   return errors;
// };





// Form and Input Validators

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  
  // Safe string conversion (undefined বা null আসলেও ক্র্যাশ করবে না)
  const safeEmail = String(email || '').toLowerCase().trim();
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(safeEmail)) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (String(password).length < 6) return 'Password must be at least 6 characters long';
  return '';
};

export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  if (String(phone).trim().length < 8) return 'Please enter a valid phone number';
  return '';
};

export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return '';
};

export const validateProductForm = (formData) => {
  const errors = {};
  if (!formData?.name || !formData.name.trim()) errors.name = 'Product name is required';
  if (!formData?.price || isNaN(formData.price) || Number(formData.price) <= 0) errors.price = 'Valid positive price is required';
  if (!formData?.category) errors.category = 'Category selection is required';
  if (formData?.stock === '' || isNaN(formData.stock) || Number(formData.stock) < 0) errors.stock = 'Valid stock count is required';
  if (!formData?.image) errors.image = 'Product main image URL is required';
  return errors;
};