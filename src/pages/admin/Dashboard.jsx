import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, Package, Plus, ArrowUpRight, AlertCircle } from 'lucide-react';
import Loader from '../../components/common/Loader';
import { productApi } from '../../api/productApi';
import { orderApi } from '../../api/orderApi';
import { userApi } from '../../api/userApi';

export const Dashboard = () => {
  const [stats, setStats] = useState({ productsCount: 0, ordersCount: 0, usersCount: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [prodRes, ordRes, usrRes] = await Promise.all([
          productApi.getProducts().catch(() => ({ data: [] })),
          orderApi.getAllOrders('all').catch(() => ({ data: [] })),
          userApi.getUsers().catch(() => ({ data: [] }))
        ]);

        // 1. Products Extraction
        const prods = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data?.products || [];

        // 2. Orders Extraction
        const ords = Array.isArray(ordRes.data) ? ordRes.data : ordRes.data?.orders || ordRes.data?.data || [];

        // 3. Users Extraction 
        const usrs = usrRes.data?.userData || (Array.isArray(usrRes.data) ? usrRes.data : []);

        // Revenue Calculation (Safe Number parsing)
        const rev = ords.reduce((acc, o) => {
          const val = Number(o.totalAmount || o.totalPrice || 0);
          return acc + (isNaN(val) ? 0 : val);
        }, 0);

        setStats({
          productsCount: prods.length,
          ordersCount: ords.length,
          usersCount: usrs.length, 
          totalRevenue: rev
        });

        setRecentOrders(ords.slice(0, 5));
        setLowStockProducts(prods.filter(p => Number(p.stock ?? 0) <= 15).slice(0, 4));
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return <Loader text="Loading dashboard metrics..." />;

  const statCards = [
    { label: 'Total Revenue', value: `$${(stats.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Total Orders', value: stats.ordersCount, icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Total Users', value: stats.usersCount, icon: Users, color: 'bg-purple-500' },
    { label: 'Active Catalog', value: stats.productsCount, icon: Package, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Executive Overview</h1>
          <p className="text-xs text-slate-500">Real-time metrics, order activities, and stock status</p>
        </div>

        <Link to="/admin/products/create" className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm">
          <Plus size={16} /> Add New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className={`p-3 rounded-2xl text-white ${card.color} shadow-sm shrink-0`}>
                <Icon size={22} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">{card.label}</span>
                <span className="text-xl font-black text-slate-900">{card.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Recent Customer Orders</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentOrders.length > 0 ? (
              recentOrders.map((ord) => {
                const amount = Number(ord.totalAmount || ord.totalPrice || 0);
                return (
                  <div key={ord._id || ord.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-mono font-bold text-xs text-slate-900 block">{ord._id || ord.id}</span>
                      <span className="text-[11px] text-slate-500">{ord.customerName || ord.user?.name || 'Customer'} • {ord.items?.length || 1} item(s)</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-xs text-slate-900 block">
                        ${isNaN(amount) ? '0.00' : amount.toFixed(2)}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {ord.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No recent orders found.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-500" /> Stock Monitor
            </h3>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((p) => {
                const img = p.image || p.images?.[0] || 'https://via.placeholder.com/40';
                const title = p.title || p.name || 'Product';
                return (
                  <div key={p._id || p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={img} alt={title} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{title}</h4>
                        <span className="text-[10px] text-slate-400 capitalize">{p.categoryName || p.category || 'General'}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      {p.stock ?? 0} left
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No low stock alerts.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;