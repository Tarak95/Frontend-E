import React, { useState, useRef } from 'react';
import { User, Mail, Phone, MapPin, Save, ShieldCheck, Hash, Camera, Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    zipCode: user?.zipCode || '',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  });

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value })); 
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      setSuccessMsg('Profile information updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Update profile error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Account Profile</h1>
        <p className="text-xs text-slate-500">Manage your personal information and profile picture</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        {/* User Card Header with Avatar Upload */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <div className="relative group">
            <img
              src={formData.avatar}
              alt={formData.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-emerald-500/20 shadow-md transition-all group-hover:brightness-90"
            />
            
            {/* Upload Badge Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
              title="Upload new profile picture"
            >
              <Camera size={16} />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{formData.name || 'User'}</h2>
              <p className="text-xs text-slate-500">{formData.email}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                <ShieldCheck size={12} /> {user?.role || 'Customer'}
              </span>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
              >
                <Upload size={14} /> Upload Photo
              </button>

              <span className="text-slate-300">|</span>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                <LinkIcon size={14} /> {showUrlInput ? 'Hide URL' : 'Image URL'}
              </button>
            </div>

            {/* Optional Image URL Input */}
            {showUrlInput && (
              <div className="pt-2">
                <InputField
                  label="Avatar Image URL"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                  icon={ImageIcon}
                />
              </div>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            icon={User}
            required
          />

          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            icon={Mail}
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
            label="Default Shipping Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="House 42, Road 11, Banani, Dhaka"
            icon={MapPin}
          />

          <InputField
            label="Zip / Postal Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            placeholder="1213"
            icon={Hash}
          />

          {successMsg && (
            <p className="text-xs font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              {successMsg}
            </p>
          )}

          <div className="pt-2">
            <Button type="submit" isLoading={saving}>
              <Save size={18} /> Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
