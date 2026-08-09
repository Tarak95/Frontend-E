import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from '../../components/admin/UserTable';
import Loader from '../../components/common/Loader';

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await axios.get('http://localhost:5000/allusers');
      
      console.log('Backend Data:', res.data);

      // 🎯 ব্যাকএন্ডের res.data.userData ধরে সেট করা হলো
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
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/deleteuser/${id}`);
        setUsers((prevUsers) => prevUsers.filter((user) => (user._id || user.id) !== id));
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user.');
      }
    }
  };

  if (loading) return <Loader text="Loading registered accounts..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage User Accounts</h1>
        <p className="text-xs text-slate-500">View registered customers and permissions</p>
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