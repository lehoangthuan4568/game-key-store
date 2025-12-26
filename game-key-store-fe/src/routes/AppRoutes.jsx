import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

// Layouts & Protection
import Layout from '../components/layout/Layout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminProtectedRoute from './AdminProtectedRoute';
import AdminManageCategories from '../pages/admin/AdminManageCategories';

// === IMPORT TẤT CẢ CÁC PAGE COMPONENT THẬT ===
// User Pages
import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import PaymentReturnPage from '../pages/PaymentReturnPage';
import MyOrdersPage from '../pages/MyOrdersPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import WishlistPage from '../pages/WishlistPage';
import UserProfilePage from '../pages/UserProfilePage'; // IMPORT MỚI

// Auth Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AuthCallbackPage from '../pages/AuthCallbackPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import VerifyPinPage from '../pages/VerifyPinPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProductList from '../pages/admin/AdminProductList';
import AdminProductForm from '../pages/admin/AdminProductForm';
import AdminOrderList from '../pages/admin/AdminOrderList';
import AdminUserList from '../pages/admin/AdminUserList';
import AdminInventoryList from '../pages/admin/AdminInventoryList';
import AdminReportPage from '../pages/admin/AdminReportPage';

// === PLACEHOLDERS CHO CÁC TRANG CHƯA TẠO ===
const NotFoundPage = () => <div className="text-3xl">404 - Không tìm thấy trang</div>;

// === ROUTER CONFIGURATION ===
export const router = createBrowserRouter([
    // --- User & Public Routes ---
    {
        path: '/',
        element: <Layout />,
        errorElement: <NotFoundPage />,
        children: [
            { index: true, element: <HomePage /> },
            // Products
            { path: 'products', element: <ProductsPage /> },
            { path: 'products/sale', element: <ProductsPage filterType="sale" /> },
            { path: 'products/new', element: <ProductsPage filterType="new" /> },
            { path: 'products/hot', element: <ProductsPage filterType="hot" /> },
            { path: 'product/:slug', element: <ProductDetailPage /> },
            // Auth
            { path: 'login', element: <LoginPage /> },
            { path: 'register', element: <RegisterPage /> },
            { path: 'auth/callback', element: <AuthCallbackPage /> },
            { path: 'verify-email', element: <VerifyEmailPage /> },
            { path: 'forgot-password', element: <ForgotPasswordPage /> },
            { path: 'verify-pin', element: <VerifyPinPage /> },
            { path: 'reset-password', element: <ResetPasswordPage /> },
            // User Protected
            { path: 'cart', element: <ProtectedRoute><CartPage /></ProtectedRoute> },
            { path: 'checkout', element: <ProtectedRoute><CheckoutPage /></ProtectedRoute> },
            { path: 'payment/vnpay_return', element: <ProtectedRoute><PaymentReturnPage /></ProtectedRoute> },
            { path: 'user/my-orders', element: <ProtectedRoute><MyOrdersPage /></ProtectedRoute> },
            { path: 'user/change-password', element: <ProtectedRoute><ChangePasswordPage /></ProtectedRoute> },
            { path: 'user/wishlist', element: <ProtectedRoute><WishlistPage /></ProtectedRoute> },
            { path: 'user/profile', element: <ProtectedRoute><UserProfilePage /></ProtectedRoute> }, // ROUTE MỚI
        ],
    },

    // --- Admin Routes ---
    {
        path: '/admin',
        element: <AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>,
        errorElement: <NotFoundPage />,
        children: [
            { index: true, element: <Navigate to="/admin/dashboard" replace /> },
            { path: 'dashboard', element: <AdminDashboard /> },
            { path: 'products', element: <AdminProductList /> },
            { path: 'products/new', element: <AdminProductForm /> },
            { path: 'products/edit/:slug', element: <AdminProductForm /> },
            { path: 'inventory/:productId', element: <AdminInventoryList /> },
            { path: 'orders', element: <AdminOrderList /> },
            { path: 'users', element: <AdminUserList /> },
            { path: 'reports', element: <AdminReportPage /> },
            { path: 'categories', element: <AdminManageCategories /> }
        ]
    },
    // Catch-all 404
    { path: "*", element: <Layout><NotFoundPage /></Layout> }
]);