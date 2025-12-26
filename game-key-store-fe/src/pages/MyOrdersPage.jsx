import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyOrders, setMyOrdersPage } from '../features/user/orderSlice';
import Pagination from '../components/common/Pagination';
import { HiOutlineClipboardCopy, HiOutlineChevronDown, HiOutlineChevronUp, HiCheckCircle, HiXCircle, HiOutlineClock, HiShoppingBag } from 'react-icons/hi';
import { FaReceipt, FaKey, FaGamepad, FaBoxOpen } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { getImageUrl } from '../utils/imageUtils';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
const placeholderImage = "/placeholder-image.png";

// Component con để hiển thị Status Badge với gaming style
const StatusBadge = ({ status }) => {
    switch (status) {
        case 'completed':
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg text-xs font-bold text-green-400 shadow-lg shadow-green-500/20">
                    <HiCheckCircle size={16} />
                    <span>Đã hoàn thành</span>
                </span>
            );
        case 'pending':
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-lg text-xs font-bold text-yellow-400 shadow-lg shadow-yellow-500/20 animate-pulse">
                    <HiOutlineClock size={16} />
                    <span>Đang chờ</span>
                </span>
            );
        case 'cancelled':
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/50 rounded-lg text-xs font-bold text-red-400 shadow-lg shadow-red-500/20">
                    <HiXCircle size={16} />
                    <span>Đã hủy</span>
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs font-medium text-gray-400">
                    {status}
                </span>
            );
    }
};

// Component con để hiển thị Key (hoặc lý do)
const OrderItemKey = ({ item, status }) => {
    const [copiedKey, setCopiedKey] = useState(null);

    const copyToClipboard = (key) => {
        if (!key) return;
        navigator.clipboard.writeText(key)
            .then(() => {
                setCopiedKey(key);
                toast.success('Đã sao chép key!');
                setTimeout(() => setCopiedKey(null), 2000);
            })
            .catch(err => toast.error('Không thể sao chép.'));
    };

    // 1. Nếu đơn hàng hoàn thành VÀ có key
    if (status === 'completed' && item.purchasedKey) {
        return (
            <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-gray-800/90 to-gray-900/90 border-2 border-yellow-500/30 rounded-lg p-3 w-full sm:w-auto group hover:border-yellow-500/50 transition-all">
                <div className="flex items-center gap-2 flex-grow min-w-0">
                    <FaKey className="text-yellow-400 flex-shrink-0" size={18} />
                    <code className="text-sm text-yellow-400 font-mono break-all flex-grow font-bold">{item.purchasedKey.gameKey}</code>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(item.purchasedKey.gameKey); }}
                    className={`p-2 rounded-lg flex-shrink-0 transition-all ${
                        copiedKey === item.purchasedKey.gameKey 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                            : 'bg-gray-700/50 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 border border-gray-600 hover:border-yellow-500/30'
                    }`}
                    title="Sao chép key"
                >
                    <HiOutlineClipboardCopy size={18} />
                </button>
            </div>
        );
    }

    // 2. Nếu đơn hàng đã hủy
    if (status === 'cancelled') {
        return (
            <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/30 rounded-lg p-3 w-full sm:w-auto">
                <code className="text-sm text-red-400 font-mono italic font-medium">(Thanh toán thất bại)</code>
            </div>
        );
    }

    // 3. Các trường hợp khác (Pending, hoặc Completed nhưng lỗi gán key)
    return (
        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-lg p-3 w-full sm:w-auto">
            <HiOutlineClock className="text-gray-500" size={18} />
            <code className="text-sm text-gray-500 font-mono italic">(Đang chờ xử lý...)</code>
        </div>
    );
};


const MyOrdersPage = () => {
    const dispatch = useDispatch();
    const { orders, status, page, totalPages, error } = useSelector(state => state.myOrders);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useEffect(() => {
        dispatch(fetchMyOrders({ page, limit: 5 }));
    }, [dispatch, page]);

    const handlePageChange = (newPage) => {
        dispatch(setMyOrdersPage(newPage));
        setExpandedOrderId(null);
        window.scrollTo(0, 0);
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    return (
        <div className="max-w-6xl mx-auto text-white relative">
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
                    <h1 className="text-4xl font-extrabold gaming-title">Đơn hàng của tôi</h1>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
            </div>

            {/* Loading State */}
            {status === 'loading' && (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-xl text-gray-400 font-medium">Đang tải đơn hàng...</p>
                </div>
            )}

            {/* Error State */}
            {status === 'failed' && (
                <div className="text-center py-20 bg-gradient-to-br from-red-900/20 to-red-800/20 backdrop-blur-sm rounded-xl border-2 border-red-500/30">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-900 to-red-800 rounded-full mb-6 border-2 border-red-500/50">
                        <HiXCircle className="text-red-400" size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-red-400 mb-2">Đã xảy ra lỗi</h2>
                    <p className="text-red-300">{error || 'Không thể tải đơn hàng. Vui lòng thử lại sau.'}</p>
                </div>
            )}

            {/* Empty State */}
            {status === 'succeeded' && orders.length === 0 && (
                <div className="text-center py-20 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border-2 border-gray-700/50">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full mb-6 border-2 border-gray-700/50">
                        <FaBoxOpen className="text-gray-500" size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-300 mb-2">Chưa có đơn hàng</h2>
                    <p className="text-gray-400 mb-6">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!</p>
                </div>
            )}

            {status === 'succeeded' && orders.length > 0 && (
                <div className="space-y-6">
                    {orders.map(order => {
                        const isExpanded = expandedOrderId === order._id;
                        const isCompleted = order.status === 'completed';
                        const isPending = order.status === 'pending';
                        const isCancelled = order.status === 'cancelled';

                        return (
                            <div 
                                key={order._id} 
                                className={`group bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg border-2 overflow-hidden transition-all duration-300 ${
                                    isCompleted 
                                        ? 'border-green-500/30 hover:border-green-500/50' 
                                        : isCancelled
                                        ? 'border-red-500/30 hover:border-red-500/50 opacity-70'
                                        : 'border-yellow-500/30 hover:border-yellow-500/50 opacity-90'
                                }`}
                            >
                                {/* Decorative gradient on hover */}
                                <div className={`absolute inset-0 transition-all duration-300 ${
                                    isCompleted
                                        ? 'bg-gradient-to-r from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5'
                                        : isCancelled
                                        ? 'bg-gradient-to-r from-red-500/0 to-pink-500/0 group-hover:from-red-500/5 group-hover:to-pink-500/5'
                                        : 'bg-gradient-to-r from-yellow-500/0 to-orange-500/0 group-hover:from-yellow-500/5 group-hover:to-orange-500/5'
                                }`}></div>

                                {/* Header Đơn hàng */}
                                <div
                                    className="relative z-10 flex flex-col sm:flex-row justify-between sm:items-center p-6 cursor-pointer transition-all"
                                    onClick={() => toggleOrderDetails(order._id)}
                                >
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${
                                                isCompleted
                                                    ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30'
                                                    : isCancelled
                                                    ? 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30'
                                                    : 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                                            }`}>
                                                <FaReceipt className={
                                                    isCompleted ? 'text-green-400' : isCancelled ? 'text-red-400' : 'text-yellow-400'
                                                } size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">
                                                    Mã đơn hàng: <span className="font-mono text-gray-300 font-semibold">{order._id.slice(-8).toUpperCase()}</span>
                                                </p>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    <span className="inline-flex items-center gap-1">
                                                        <HiOutlineClock size={14} />
                                                        {new Date(order.createdAt).toLocaleDateString('vi-VN', { 
                                                            day: '2-digit', 
                                                            month: '2-digit', 
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-3 sm:hidden">
                                            <StatusBadge status={order.status} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                        <div className="hidden sm:block">
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 mb-1">Tổng tiền</p>
                                            <p className="text-2xl font-extrabold gaming-price">{formatPrice(order.totalPrice)}</p>
                                        </div>
                                        <div className={`p-2 rounded-lg transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                            {isExpanded ? (
                                                <HiOutlineChevronUp size={24} className="text-cyan-400" />
                                            ) : (
                                                <HiOutlineChevronDown size={24} className="text-gray-400 group-hover:text-cyan-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Chi tiết Đơn hàng (Collapsible) */}
                                {isExpanded && (
                                    <div className="px-6 pb-6 pt-4 border-t border-gray-700/50 space-y-4 animate-fadeIn">
                                        <div className="flex items-center gap-2 mb-4">
                                            <FaGamepad className="text-cyan-400" size={18} />
                                            <h3 className="text-lg font-bold text-gray-300">Chi tiết sản phẩm</h3>
                                        </div>
                                        {order.items.map((item, index) => (
                                            <div 
                                                key={item._id || index} 
                                                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-cyan-500/30 transition-all"
                                            >
                                                <Link 
                                                    to={`/product/${item.product?.slug}`}
                                                    className="flex-shrink-0"
                                                >
                                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-700 hover:border-cyan-500/50 transition-colors">
                                                        <img
                                                            src={getImageUrl(item.product?.coverImage) || placeholderImage}
                                                            alt={item.product?.name || 'Sản phẩm'}
                                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                            onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage }}
                                                        />
                                                    </div>
                                                </Link>
                                                <div className="flex-grow min-w-0">
                                                    <Link to={`/product/${item.product?.slug}`}>
                                                        <p className="font-bold text-white hover:text-cyan-400 transition-colors mb-1">
                                                            {item.product?.name || 'Sản phẩm không xác định'}
                                                        </p>
                                                    </Link>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 bg-gray-700/50 rounded text-xs text-gray-400 border border-gray-600">
                                                            {item.platform?.name || 'Nền tảng không xác định'}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            x{item.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* Component Key (có logic) */}
                                                <div className="w-full sm:w-auto">
                                                    <OrderItemKey item={item} status={order.status} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {status === 'succeeded' && totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default MyOrdersPage;