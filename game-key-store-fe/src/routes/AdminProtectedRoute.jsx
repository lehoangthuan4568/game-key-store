// src/routes/AdminProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated, selectUser } from '../features/user/userSlice';

const AdminProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== 'admin') {
        // Nếu user đã đăng nhập nhưng không phải admin, đá về trang chủ
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminProtectedRoute;