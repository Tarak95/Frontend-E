import React, { useState, useEffect } from 'react';
import UserTable from '../../components/admin/UserTable';
import Loader from '../../components/common/Loader';
import { userApi } from '../../api/userApi';

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
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
        await userApi.deleteUser(id);
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
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

      <UserTable users={users} onDeleteUser={handleDeleteUser} />
    </div>
  );
};

export default ManageUsers;
