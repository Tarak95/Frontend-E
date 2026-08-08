import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, Check, X, FolderPlus, Sparkles } from 'lucide-react';

export const ImageUploader = ({ value, onChange, label = 'Product Image' }) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'url' | 'samples'
  const [imageUrl, setImageUrl] = useState(value || '');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const sampleImages = [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
  ];

  const handleApply = (url, name = '', size = '') => {
    setImageUrl(url);
    setFileName(name);
    setFileSize(size);
    onChange(url);
  };

  // Helper to process File object into Base64 Data URL (with canvas optimization if large)
  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    setIsLoading(true);
    const sizeInKB = (file.size / 1024).toFixed(1) + ' KB';
    const reader = new FileReader();

    reader.onload = (e) => {
      const src = e.target.result;

      // If file size is under 1MB, use Data URL directly
      if (file.size < 1024 * 1024) {
        handleApply(src, file.name, sizeInKB);
        setIsLoading(false);
        return;
      }

      // Optimize large image via Canvas to keep state lightweight
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        handleApply(compressedDataUrl, file.name, sizeInKB);
        setIsLoading(false);
      };

      img.onerror = () => {
        handleApply(src, file.name, sizeInKB);
        setIsLoading(false);
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = () => {
    setImageUrl('');
    setFileName('');
    setFileSize('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onChange('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label} <span className="text-rose-500">*</span>
        </label>
        
        {/* Mode switcher tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'upload' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload size={13} /> Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'url' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon size={13} /> Image URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('samples')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'samples' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles size={13} /> Samples
          </button>
        </div>
      </div>

      {/* TAB 1: File Upload Box */}
      {activeTab === 'upload' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/60 scale-[1.01]'
              : 'border-slate-200 hover:border-emerald-500 hover:bg-slate-50/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
              <Upload size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PNG, JPG, WEBP, GIF, SVG up to 10MB
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xs rounded-2xl flex items-center justify-center">
              <span className="text-xs font-bold text-emerald-600 animate-pulse flex items-center gap-2">
                <Upload size={16} className="animate-bounce" /> Processing Image...
              </span>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Image URL Input */}
      {activeTab === 'url' && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <LinkIcon size={16} />
          </div>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => handleApply(e.target.value)}
            placeholder="Paste direct image URL (e.g. https://images.unsplash.com/...)"
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      )}

      {/* TAB 3: Preset Sample Pickers */}
      {activeTab === 'samples' && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <span className="text-xs text-slate-600 font-semibold block">Pick a high-resolution placeholder image:</span>
          <div className="grid grid-cols-4 gap-2">
            {sampleImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApply(img)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                  imageUrl === img ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <img src={img} alt="Sample" className="w-full h-full object-cover" />
                {imageUrl === img && (
                  <div className="absolute inset-0 bg-emerald-600/40 flex items-center justify-center text-white">
                    <Check size={18} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview Card */}
      {imageUrl && (
        <div className="flex items-center gap-4 p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl relative group">
          <div className="w-20 h-20 rounded-xl overflow-hidden border border-emerald-300 shrink-0 bg-white shadow-xs">
            <img
              src={imageUrl}
              alt="Uploaded Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <Check size={14} className="text-emerald-600 shrink-0" />
              <span>Image Attached</span>
            </div>
            <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">
              {fileName || (imageUrl.startsWith('data:') ? 'Uploaded File (Base64)' : imageUrl)}
            </p>
            {fileSize && (
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{fileSize}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
            title="Remove Image"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

