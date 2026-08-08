import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Users, 
  ShoppingBag, 
  ArrowLeft,
  ShoppingBasket,
  X,
  User
} from 'lucide-react';

export const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Products', path: '/admin/products', icon: Package },
    { label: 'Add Product', path: '/admin/products/create', icon: PlusCircle },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
    { label: 'Manage Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Admin Profile', path: '/admin/profile', icon: User },
  ];

  const handleClose = () => {
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shrink-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" onClick={handleClose} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md">
              <ShoppingBasket size={20} />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight">EcoBazar</span>
              <span className="block text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Control Panel</span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden cursor-pointer"
            title="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider px-3 mb-2">
            Admin Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to store */}
        <div className="p-4 border-t border-slate-800">
          <Link
            to="/"
            onClick={handleClose}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Storefront</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
