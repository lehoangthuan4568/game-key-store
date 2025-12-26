import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersAdmin, setAdminOrdersPage } from '../../features/admin/orderSlice';
import Pagination from '../../components/common/Pagination';
import OrderDetailModal from '../../components/admin/OrderDetailModal';
import { HiShoppingBag, HiCheckCircle, HiOutlineClock, HiXCircle } from 'react-icons/hi';
import { FaReceipt, FaShoppingBag as FaBag } from 'react-icons/fa';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

// Status Badge Component
const StatusBadge = ({ status }) => {
    const statusConfig = {
        completed: { icon: HiCheckCircle, color: 'green', text: 'Hoàn thành' },
        pending: { icon: HiOutlineClock, color: 'yellow', text: 'Đang chờ' },
        cancelled: { icon: HiXCircle, color: 'red', text: 'Đã hủy' },
    };
    
    const config = statusConfig[status] || { icon: HiOutlineClock, color: 'gray', text: status };
    const IconComponent = config.icon;
    
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-${config.color}-500/20 to-${config.color === 'green' ? 'emerald' : config.color === 'yellow' ? 'orange' : config.color === 'red' ? 'pink' : 'gray'}-500/20 border border-${config.color}-500/50 rounded-lg text-xs font-bold text-${config.color}-400 shadow-lg`}>
            <IconComponent size={14} />
            <span>{config.text}</span>
        </span>
    );
};

const AdminOrderList = () => {
    const dispatch = useDispatch();
    const { orders, status, page, totalPages } = useSelector(state => state.adminOrders);

    // --- STATE MỚI ĐỂ QUẢN LÝ MODAL ---
    const [selectedOrder, setSelectedOrder] = useState(null);
    // ----------------------------------

    useEffect(() => {
        dispatch(fetchOrdersAdmin({ page, limit: 10 }));
    }, [dispatch, page]);

    const handlePageChange = (newPage) => {
        dispatch(setAdminOrdersPage(newPage));
        setSelectedOrder(null); // Đóng modal khi chuyển trang
    };

    // Hàm để đóng modal
    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

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
                        <FaReceipt className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold gaming-title">Quản lý Đơn hàng</h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-2"></div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg border-2 border-gray-700/50 overflow-hidden">
                <div className="overflow-x-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th className="p-4 text-gray-300 font-semibold">ID Đơn hàng</th>
                                <th className="p-4 text-gray-300 font-semibold">Khách hàng</th>
                                <th className="p-4 text-gray-300 font-semibold">Ngày đặt</th>
                                <th className="p-4 text-gray-300 font-semibold">Trạng thái</th>
                                <th className="p-4 text-right text-gray-300 font-semibold">Tổng tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {status === 'loading' && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-gray-400">Đang tải đơn hàng...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {status === 'succeeded' && orders.map(order => (
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
                                    <td className="p-4">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="p-4 text-right font-extrabold gaming-price">{formatPrice(order.totalPrice)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Phân trang */}
            {status === 'succeeded' && totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {/* RENDER MODAL (hiển thị có điều kiện) */}
            {selectedOrder && (
                <OrderDetailModal order={selectedOrder} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default AdminOrderList;