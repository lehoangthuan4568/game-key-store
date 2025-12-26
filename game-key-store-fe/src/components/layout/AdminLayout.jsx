// src/components/layout/AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/user/userSlice';
// === THÊM HiTag VÀO ĐÂY ===
import { HiViewGrid, HiCube, HiUsers, HiShoppingCart, HiLogout, HiChartBar, HiTag } from 'react-icons/hi';
// =============================

const AdminLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/'); // Chuyển hướng về trang chủ
    };

    const navLinkClass = ({ isActive }) =>
        `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-cyan-500 text-white' : 'hover:bg-gray-700 text-gray-300'
        }`;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 p-4 flex flex-col flex-shrink-0 border-r border-gray-700">
                <div>
                    <h1 className="text-2xl font-bold text-cyan-400 mb-8 px-2">Admin Panel</h1>
                    <nav className="space-y-2">
                        <NavLink to="/admin/dashboard" className={navLinkClass}>
                            <HiViewGrid className="mr-3 flex-shrink-0" size={20} />
                            Bảng điều khiển
                        </NavLink>
                        <NavLink to="/admin/reports" className={navLinkClass}>
                            <HiChartBar className="mr-3 flex-shrink-0" size={20} />
                            Báo cáo
                        </NavLink>
                        <NavLink to="/admin/products" className={navLinkClass}>
                            <HiCube className="mr-3 flex-shrink-0" size={20} />
                            Sản phẩm
                        </NavLink>
                        <NavLink to="/admin/categories" className={navLinkClass}>
                            <HiTag className="mr-3 flex-shrink-0" size={20} />
                            Nền tảng & Thể loại
                        </NavLink>
                        <NavLink to="/admin/orders" className={navLinkClass}>
                            <HiShoppingCart className="mr-3 flex-shrink-0" size={20} />
                            Đơn hàng
                        </NavLink>
                        <NavLink to="/admin/users" className={navLinkClass}>
                            <HiUsers className="mr-3 flex-shrink-0" size={20} />
                            Người dùng
                        </NavLink>
                        
                        {/* Sử dụng HiTag đã import */}
                        
                    </nav>
                </div>

                {/* Nút Đăng xuất */}
                <div className="mt-auto pt-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                        <HiLogout className="mr-3 flex-shrink-0" size={20} />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;