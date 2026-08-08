import React, { useState } from 'react';
import { Search, Trash2, Shield, User } from 'lucide-react';

export const UserTable = ({ users = [], onDeleteUser }) => {
  const [search, setSearch] = useState('');

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

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
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((usr) => (
              <tr key={usr.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img src={usr.avatar} alt={usr.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-slate-900 block">{usr.name}</span>
                      <span className="text-[10px] text-slate-400">{usr.email}</span>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                    usr.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {usr.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                    {usr.role}
                  </span>
                </td>
                <td className="p-3 text-slate-600">{usr.phone || 'N/A'}</td>
                <td className="p-3 text-slate-600 max-w-xs truncate">{usr.address || 'N/A'}</td>
                <td className="p-3 text-right">
                  {usr.role !== 'admin' && (
                    <button
                      onClick={() => onDeleteUser(usr.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Delete User"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
