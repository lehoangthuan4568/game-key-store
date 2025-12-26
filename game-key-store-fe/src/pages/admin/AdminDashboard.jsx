import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../features/admin/dashboardSlice';
import OrderDetailModal from '../../components/admin/OrderDetailModal';
import { HiUsers, HiCube, HiShoppingCart, HiCash, HiChartBar } from 'react-icons/hi';
import { FaChartLine, FaUsers, FaBox, FaShoppingBag, FaDollarSign } from 'react-icons/fa';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

// Component Card Thống Kê với gaming style
const StatCard = ({ icon, title, value, gradientClass, iconClass, textColorClass, borderHoverClass }) => (
    <div className={`group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm p-6 rounded-xl border-2 border-gray-700/50 ${borderHoverClass} transition-all duration-300 overflow-hidden`}>
        {/* Decorative gradient on hover */}
        <div className={`absolute inset-0 bg-gradient-to-r ${gradientClass} transition-all duration-300`}></div>
        
        <div className="relative z-10 flex items-center space-x-4">
            <div className={`p-4 rounded-xl ${iconClass} group-hover:scale-110 transition-transform shadow-lg`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                <p className={`text-3xl font-extrabold gaming-price ${textColorClass}`}>{value}</p>
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { stats, recentOrders, status } = useSelector(state => state.dashboard);

    // --- STATE MỚI ĐỂ QUẢN LÝ MODAL ---
    const [selectedOrder, setSelectedOrder] = useState(null);
    // ----------------------------------

    useEffect(() => {
        // Chỉ fetch khi status là 'idle'
        if (status === 'idle') {
            dispatch(fetchDashboardStats());
        }
    }, [dispatch, status]);

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    if (status === 'loading' && !stats.totalUsers) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xl text-gray-400 font-medium">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/30">
                        <HiChartBar className="text-white" size={24} />
                    </div>
                    <h1 className="text-4xl font-extrabold gaming-title">Bảng điều khiển</h1>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    icon={<FaDollarSign className="text-green-400" size={28} />} 
                    title="Tổng doanh thu" 
                    value={formatPrice(stats.totalRevenue || 0)} 
                    gradientClass="from-green-500/0 to-emerald-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10"
                    iconClass="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30"
                    textColorClass="text-green-400"
                    borderHoverClass="hover:border-green-500/50"
                />
                <StatCard 
                    icon={<FaUsers className="text-sky-400" size={28} />} 
                    title="Tổng người dùng" 
                    value={stats.totalUsers || 0} 
                    gradientClass="from-sky-500/0 to-blue-500/0 group-hover:from-sky-500/10 group-hover:to-blue-500/10"
                    iconClass="bg-gradient-to-br from-sky-500/20 to-blue-500/20 border border-sky-500/30"
                    textColorClass="text-sky-400"
                    borderHoverClass="hover:border-sky-500/50"
                />
                <StatCard 
                    icon={<FaBox className="text-purple-400" size={28} />} 
                    title="Tổng sản phẩm" 
                    value={stats.totalProducts || 0} 
                    gradientClass="from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10"
                    iconClass="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                    textColorClass="text-purple-400"
                    borderHoverClass="hover:border-purple-500/50"
                />
                <StatCard 
                    icon={<FaShoppingBag className="text-yellow-400" size={28} />} 
                    title="Tổng đơn hàng" 
                    value={stats.totalOrders || 0} 
                    gradientClass="from-yellow-500/0 to-orange-500/0 group-hover:from-yellow-500/10 group-hover:to-orange-500/10"
                    iconClass="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
                    textColorClass="text-yellow-400"
                    borderHoverClass="hover:border-yellow-500/50"
                />
            </div>

            {/* Recent Orders Table */}
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg border-2 border-gray-700/50 overflow-hidden">
                <div className="p-6 border-b border-gray-700/50">
                    <div className="flex items-center gap-3">
                        <FaShoppingBag className="text-cyan-400" size={24} />
                        <h2 className="text-2xl font-extrabold gaming-section-title">Đơn hàng gần đây</h2>
                    </div>
                </div>
                <div className="overflow-x-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th className="p-4 text-gray-300 font-semibold">ID Đơn hàng</th>
                                <th className="p-4 text-gray-300 font-semibold">Khách hàng</th>
                                <th className="p-4 text-gray-300 font-semibold">Ngày đặt</th>
                                <th className="p-4 text-right text-gray-300 font-semibold">Tổng tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {status === 'loading' && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-gray-400">Đang làm mới...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {recentOrders.map(order => (
                                <tr
                                    key={order._id}
                                    className="border-b border-gray-700/50 hover:bg-gray-800/50 cursor-pointer transition-all group"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <td className="p-4 text-gray-400 font-mono text-sm group-hover:text-cyan-400 transition-colors">
                                        {order._id.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="p-4 text-gray-300 group-hover:text-white transition-colors">{order.user?.name || 'N/A'}</td>
                                    <td className="p-4 text-gray-400">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td className="p-4 text-right font-extrabold gaming-price">{formatPrice(order.totalPrice)}</td>
                                </tr>
                            ))}
                            {status === 'succeeded' && recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-400">
                                        Không có đơn hàng gần đây.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RENDER MODAL (hiển thị có điều kiện) */}
            {selectedOrder && (
                <OrderDetailModal order={selectedOrder} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default AdminDashboard;