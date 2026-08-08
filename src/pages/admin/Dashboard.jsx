import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  Plus, 
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import Loader from '../../components/common/Loader';
import { productApi } from '../../api/productApi';
import { orderApi } from '../../api/orderApi';
import { userApi } from '../../api/userApi';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    usersCount: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [prodRes, ordRes, usrRes] = await Promise.all([
          productApi.getProducts(),
          orderApi.getOrders(),
          userApi.getUsers()
        ]);

        const prods = prodRes.data || [];
        const ords = ordRes.data || [];
        const usrs = usrRes.data || [];

        const rev = ords.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

        setStats({
          productsCount: prods.length,
          ordersCount: ords.length,
          usersCount: usrs.length,
          totalRevenue: rev
        });

        setRecentOrders(ords.slice(0, 5));
        setLowStockProducts(prods.filter(p => p.stock <= 15).slice(0, 4));
      } catch (err) {
        console.error('Error loading admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return <Loader text="Loading dashboard metrics..." />;

  const statCards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Total Orders', value: stats.ordersCount, icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Total Users', value: stats.usersCount, icon: Users, color: 'bg-purple-500' },
    { label: 'Active Catalog', value: stats.productsCount, icon: Package, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Title & Quick Add */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Executive Overview</h1>
          <p className="text-xs text-slate-500">Real-time metrics, order activities, and stock status</p>
        </div>

        <Link
          to="/admin/products/create"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus size={16} /> Add New Product
        </Link>
      </div>

      {/* Metrics Grid */}
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
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Recent Customer Orders</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentOrders.map((ord) => (
              <div key={ord.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="font-mono font-bold text-xs text-slate-900 block">{ord.id}</span>
                  <span className="text-[11px] text-slate-500">{ord.customerName} • {ord.items?.length || 1} item(s)</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-xs text-slate-900 block">${ord.totalAmount?.toFixed(2)}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-500" /> Stock Monitor
            </h3>
          </div>

          <div className="space-y-3">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                    <span className="text-[10px] text-slate-400 capitalize">{p.categoryName || p.category}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
