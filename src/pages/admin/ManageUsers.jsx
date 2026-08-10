import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from '../../components/admin/UserTable';
import Loader from '../../components/common/Loader';
import { Users } from 'lucide-react';

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await axios.get('http://localhost:5000/allusers');
      
      if (res.data && Array.isArray(res.data.userData)) {
        setUsers(res.data.userData);
      } else if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setErrorMessage('Failed to load users. Please check backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!id) return;

    // (Instant UI update)
    setUsers((prevUsers) => prevUsers.filter((user) => (user._id || user.id) !== id));

    try {
      await axios.delete(`http://localhost:5000/deleteuser/${id}`);
    } catch (err) {
      console.error('Error deleting user:', err);
      setErrorMessage('Failed to delete user on server.');
      fetchUsers();
    }
  };

  if (loading) return <Loader text="Loading registered accounts..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage User Accounts</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
              <Users size={14} /> Total: {users.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">View registered customers and permissions</p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      <UserTable users={users} onDeleteUser={handleDeleteUser} />
    </div>
  );
};

export default ManageUsers;