import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-gray-400">Admin access required</p>
          <Link to="/" className="mt-4 inline-block text-red-500 hover:text-red-400">
            Go Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-dark-200/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/admin" className="text-xl font-bold text-gradient">
              Admin Panel
            </Link>
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              Back to Site
            </Link>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default AdminLayout;