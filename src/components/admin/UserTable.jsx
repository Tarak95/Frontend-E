import React, { useState } from 'react';
import { Search, Trash2, Shield, User, Calendar, CheckCircle, XCircle } from 'lucide-react';

export const UserTable = ({ users = [], onDeleteUser }) => {
  const [search, setSearch] = useState('');

  // 🎯 সেফ ফিল্টারিং (Null/Undefined হ্যান্ডেল করবে)
  const filtered = users.filter((u) => {
    const name = u?.name || '';
    const email = u?.email || '';
    const query = search.toLowerCase();
    return name.toLowerCase().includes(query) || email.toLowerCase().includes(query);
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-4 space-y-4">
      <div className="relative w-full sm:w-72">
        <Search size={16} className="absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Role</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Address</th>
              <th className="p-3">Joined Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length > 0 ? (
              filtered.map((usr) => {
                // MongoDB _id অথবা সাধারণ id দুটোর জন্যই সেফ কি (key)
                const userId = usr._id || usr.id;

                // 🎯 Joined Date ফরম্যাটিং (createdAt, joinedAt অথবা fallback)
                const rawDate = usr.createdAt || usr.joinedAt || usr.created_at;
                const joinedDate = rawDate
                  ? new Date(rawDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'N/A';

                // 🎯 Status হ্যান্ডলিং
                const userStatus = usr.status ? usr.status.toLowerCase() : 'active';
                const isActive = userStatus === 'active';

                return (
                  <tr key={userId} className="hover:bg-slate-50 transition-colors">
                    {/* User Profile */}
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {usr.avatar ? (
                          <img
                            src={usr.avatar}
                            alt={usr.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                            {usr.name ? usr.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}

                        <div>
                          <span className="font-bold text-slate-900 block">
                            {usr.name || 'Unnamed User'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {usr.email || 'No email provided'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          usr.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {usr.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                        {usr.role || 'user'}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="p-3 text-slate-600">{usr.phone || 'N/A'}</td>

                    {/* Address */}
                    <td className="p-3 text-slate-600 max-w-xs truncate">
                      {typeof usr.address === 'string'
                        ? usr.address
                        : usr.address?.street || 'N/A'}
                    </td>

                    {/* Joined Date (নতুন যোগ করা হয়েছে) */}
                    <td className="p-3 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{joinedDate}</span>
                      </div>
                    </td>

                    {/* Status (নতুন যোগ করা হয়েছে) */}
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-100 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {isActive ? <CheckCircle size={11} /> : <XCircle size={11} />}
                        {userStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right">
                      {usr.role !== 'admin' && (
                        <button
                          onClick={() => onDeleteUser(userId)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="p-6 text-center text-slate-400 font-medium">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;