import React, { useState } from 'react';
import { Trash2, Shield, User, RotateCcw, Eye, X, Calendar, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

export const UserTable = ({ 
  users = [], 
  onDeleteUser, 
  onRestoreUser, 
  isDeletedView = false 
}) => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-4">
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
              {users.length > 0 ? (
                users.map((usr) => {
                  const userId = usr._id || usr.id;

                  return (
                    <tr key={userId} className="hover:bg-slate-50 transition-colors">
                      {/* User Info */}
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                            {usr.name ? usr.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{usr.name || 'N/A'}</span>
                            <span className="text-[10px] text-slate-400">{usr.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          usr.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {usr.role === 'admin' ? <Shield size={10} /> : <User size={10} />}
                          {usr.role || 'user'}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="p-3 text-slate-600">{usr.phone || 'N/A'}</td>
                      <td className="p-3 text-slate-600 max-w-[200px] truncate">{usr.address || 'N/A'}</td>
                      <td className="p-3 text-slate-500">
                        {usr.createdAt ? new Date(usr.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </td>

                      {/* Dynamic Status Badge */}
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isDeletedView 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isDeletedView ? 'Deleted' : (usr.status || 'Active')}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Details Button */}
                          <button
                            onClick={() => setSelectedUser(usr)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>

                          {isDeletedView ? (
                            /* Activate Button */
                            <button
                              onClick={() => onRestoreUser && onRestoreUser(userId)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                              title="Activate User"
                            >
                              <RotateCcw size={12} /> Activate
                            </button>
                          ) : (
                            /* Delete Button */
                            <button
                              onClick={() => onDeleteUser && onDeleteUser(userId)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete User"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-400 font-medium">
                    {isDeletedView ? 'No deleted users found.' : 'No registered users found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal Popup */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-emerald-200">
                {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{selectedUser.name || 'N/A'}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 mt-1 ${
                  selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {selectedUser.role === 'admin' ? <Shield size={10} /> : <User size={10} />}
                  {selectedUser.role || 'user'}
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <Mail size={16} className="text-emerald-600 shrink-0" />
                <div className="truncate">
                  <p className="text-[10px] text-slate-400 font-medium">Email</p>
                  <p className="font-semibold">{selectedUser.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <Phone size={16} className="text-emerald-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Phone</p>
                  <p className="font-semibold">{selectedUser.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <MapPin size={16} className="text-emerald-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Address</p>
                  <p className="font-semibold">{selectedUser.address || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <Calendar size={16} className="text-emerald-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Joined Date</p>
                  <p className="font-semibold">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Account Status</p>
                  <p className="font-semibold capitalize">{selectedUser.isDelete ? 'Deleted' : 'Active'}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserTable;