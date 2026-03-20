import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAdminAuth } from '../utils/adminAuth';

function AdminRoute({ children }) {
  const location = useLocation();
  const adminAuth = getAdminAuth();
  const adminToken = adminAuth?.token;
  const role = adminAuth?.admin?.role;

  if (!adminToken || role !== 'admin') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default AdminRoute;
