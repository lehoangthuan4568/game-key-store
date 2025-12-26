import React from 'react';
import { HiX, HiOutlineUser, HiOutlineMail, HiOutlineCalendar, HiOutlineCreditCard } from 'react-icons/hi';
import { FaReceipt, FaUser, FaEnvelope, FaCalendarAlt, FaCreditCard, FaGamepad, FaKey } from 'react-icons/fa';
import { getImageUrl } from '../../utils/imageUtils';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
const placeholderImage = "/placeholder-image.png";

const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
        // Lớp phủ Backdrop với blur
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
        >
            {/* Hộp Modal với gaming style */}
            <div
                onClick={e => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl w-full max-w-3xl rounded-xl shadow-2xl border-2 border-gray-700/50 max-h-[90vh] flex flex-col relative overflow-hidden"
            >
                {/* Decorative gradient border */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                {/* Header Modal */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700/50 flex-shrink-0 relative z-10 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
                    <div className="flex items-center gap-3">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg">
                            <FaReceipt className="text-white" size={20} />
                        </div>
                        <h2 className="text-2xl font-extrabold gaming-section-title">Chi tiết Đơn hàng</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-lg hover:bg-gray-700/50 border border-gray-700/50 hover:border-red-500/50 transition-all group"
                    >
                        <HiX size={24} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                    </button>
                </div>

                {/* Nội dung Modal (có thể cuộn) */}
                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar relative z-10">
                    {/* Thông tin Khách hàng & Đơn hàng */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Box Thông tin Khách hàng */}
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-5 rounded-xl border-2 border-gray-700/50 hover:border-cyan-500/30 transition-all">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700/50">
                                <FaUser className="text-cyan-400" size={18} />
                                <h3 className="font-extrabold text-gray-300 uppercase text-xs tracking-wider">Khách hàng</h3>
                            </div>
                            <div className="space-y-2">
                                <p className="flex items-center gap-2 text-white font-medium">
                                    <HiOutlineUser className="text-gray-400" size={16} />
                                    {order.user?.name || 'N/A'}
                                </p>
                                <p className="flex items-center gap-2 text-gray-400 truncate">
                                    <HiOutlineMail className="text-gray-500" size={16} />
                                    {order.user?.email || 'N/A'}
                                </p>
                            </div>
                        </div>
                        {/* Box Thông tin Đơn hàng */}
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-5 rounded-xl border-2 border-gray-700/50 hover:border-purple-500/30 transition-all">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700/50">
                                <FaReceipt className="text-purple-400" size={18} />
                                <h3 className="font-extrabold text-gray-300 uppercase text-xs tracking-wider">Đơn hàng</h3>
                            </div>
                            <div className="space-y-2">
                                <p className="flex items-center gap-2 font-mono text-xs text-gray-400">
                                    ID: {order._id.slice(-8).toUpperCase()}
                                </p>
                                <p className="flex items-center gap-2 text-gray-300">
                                    <HiOutlineCalendar className="text-gray-400" size={16} />
                                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                                </p>
                                <p className="flex items-center gap-2 text-gray-300 capitalize">
                                    <HiOutlineCreditCard className="text-gray-400" size={16} />
                                    {order.paymentMethod.replace('-mock', '')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Danh sách Sản phẩm đã mua */}
                    <div>
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-700/50">
                            <FaGamepad className="text-cyan-400" size={20} />
                            <h3 className="text-xl font-extrabold gaming-section-title">Sản phẩm & Key</h3>
                        </div>
                        <div className="space-y-4">
                            {order.items.map(item => (
                                <div 
                                    key={item._id} 
                                    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-4 rounded-xl border-2 border-gray-700/50 hover:border-cyan-500/30 transition-all"
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        <img
                                            src={getImageUrl(item.product?.coverImage) || placeholderImage}
                                            alt={item.product?.name}
                                            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-700 flex-shrink-0 hover:border-cyan-500/50 transition-colors"
                                            onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage }}
                                        />
                                        <div className="flex-grow min-w-0">
                                            <p className="font-bold text-white mb-1">{item.product?.name || 'Sản phẩm đã bị xóa'}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-gray-700/50 rounded text-xs text-gray-400 border border-gray-600">
                                                    {item.platform?.name || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 text-right">
                                            <p className="text-xs text-gray-400 mb-1">Giá mua:</p>
                                            <p className="font-extrabold gaming-price">{formatPrice(item.priceAtPurchase)}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaKey className="text-yellow-400" size={16} />
                                            <p className="text-xs text-gray-400 font-medium">Key đã cấp:</p>
                                        </div>
                                        <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 border-2 border-yellow-500/30 rounded-lg p-3">
                                            <code className="text-yellow-400 font-mono text-sm break-all font-bold">
                                                {item.purchasedKey?.gameKey || 'KEY LỖI'}
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tổng cộng */}
                    <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-6 rounded-xl border-2 border-cyan-500/20">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-semibold text-gray-300">Tổng cộng:</span>
                            <span className="text-3xl font-extrabold gaming-price">{formatPrice(order.totalPrice)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;