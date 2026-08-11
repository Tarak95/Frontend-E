import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from '../../components/admin/UserTable';
import Loader from '../../components/common/Loader';
import { Users, Search, Trash2, UserCheck } from 'lucide-react';

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'deleted'
  
  // Search Input Handler States
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Active Users Fetch
  const fetchActiveUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/allusers');
      let data = res.data?.userData || (Array.isArray(res.data) ? res.data : []);
      setUsers(data);
    } catch (err) {
      console.error('Error fetching active users:', err);
      setErrorMessage('Failed to load active users.');
    }
  };

  // Deleted Users Fetch
  const fetchDeletedUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/deletedusers');
      let data = res.data?.userData || (Array.isArray(res.data) ? res.data : []);
      setDeletedUsers(data);
    } catch (err) {
      console.error('Error fetching deleted users:', err);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchActiveUsers(), fetchDeletedUsers()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Soft Delete User
  const handleDeleteUser = async (id) => {
    if (!id) return;
    try {
      await axios.delete(`http://localhost:5000/deleteuser/${id}`);
      fetchAllData();
    } catch (err) {
      console.error('Error deleting user:', err);
      setErrorMessage('Failed to delete user on server.');
    }
  };

  // Restore User
  const handleRestoreUser = async (id) => {
    if (!id) return;
    try {
      await axios.put(`http://localhost:5000/restoreuser/${id}`);
      fetchAllData();
    } catch (err) {
      console.error('Error restoring user:', err);
      setErrorMessage('Failed to restore user on server.');
    }
  };

  // Search Handle Function (Button Click or Enter Press)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedSearch(searchInput.trim());
  };

  // Filter users based on applied search term
  const targetList = activeTab === 'active' ? users : deletedUsers;
  const filteredUsers = targetList.filter((user) => {
    const name = user.name || user.username || '';
    const email = user.email || '';
    const term = appliedSearch.toLowerCase();
    
    return name.toLowerCase().includes(term) || email.toLowerCase().includes(term);
  });

  if (loading) return <Loader text="Loading accounts..." />;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {activeTab === 'active' ? 'Users' : 'Deleted Users'}
          </h1>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border ${
            activeTab === 'deleted' 
              ? 'bg-rose-100 text-rose-800 border-rose-200' 
              : 'bg-emerald-100 text-emerald-800 border-emerald-200'
          }`}>
            <Users size={14} /> Total: {filteredUsers.length}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {activeTab === 'active' ? 'View registered customers and permissions' : 'View soft-deleted user accounts'}
        </p>
      </div>

      {/* Search Form + Tab Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Bar with Submit Button */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all w-full md:w-96 shadow-xs"
        >
          <div className="pl-3 text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium bg-transparent focus:outline-none text-slate-800"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 transition-colors flex items-center gap-1 cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Users & Deleted Users Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <UserCheck size={16} /> Users ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('deleted')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'deleted'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Trash2 size={16} /> Deleted Users ({deletedUsers.length})
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* User Table Component */}
      <UserTable 
        users={filteredUsers} 
        onDeleteUser={activeTab === 'active' ? handleDeleteUser : null}
        onRestoreUser={activeTab === 'deleted' ? handleRestoreUser : null}
        isDeletedView={activeTab === 'deleted'}
      />
    </div>
  );
};

export default ManageUsers;