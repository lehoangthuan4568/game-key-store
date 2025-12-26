import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineTrash, HiPlusSm, HiMinusSm, HiShoppingCart, HiOutlineShoppingBag } from 'react-icons/hi';
import { FaGamepad, FaShoppingBag } from 'react-icons/fa';
import { selectCartItems, selectCartTotal, removeItem, updateQuantity } from '../features/cart/cartSlice';
import { toast } from 'react-hot-toast';
import { getImageUrl } from '../utils/imageUtils';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

// Default placeholder image (ensure this exists in your public folder)
const placeholderImage = "/placeholder-image.png";

const CartPage = () => {
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const dispatch = useDispatch();

    // Handler for increasing/decreasing quantity using buttons
    const handleQuantityChange = (item, amount) => { // amount is +1 or -1
        const newQuantity = item.quantity + amount;
        const stockForPlatform = item.product.stockByPlatform?.[item.platform._id] ?? 0;

        // Prevent going below 1
        if (newQuantity < 1) {
            return;
        }

        // Prevent exceeding stock for the specific platform
        if (newQuantity > stockForPlatform) {
            toast.error(`Chỉ còn ${stockForPlatform} key cho nền tảng ${item.platform.name}.`);
            return;
        }

        // Dispatch update if valid
        dispatch(updateQuantity({
            productId: item.product._id,
            platformId: item.platform._id,
            quantity: newQuantity
        }));
    };

    // Handler for removing item from cart
    const handleRemoveItem = (item) => {
        dispatch(removeItem({ productId: item.product._id, platformId: item.platform._id }));
        toast.success(`${item.product.name} (${item.platform.name}) đã được xóa khỏi giỏ.`);
    };

    // Render empty cart message if no items
    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center relative overflow-hidden">
                {/* Animated Background */}
                <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="text-center max-w-md mx-auto px-4">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full mb-6 border-2 border-gray-700/50">
                        <HiOutlineShoppingBag className="text-gray-500" size={48} />
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4 gaming-title">Giỏ hàng trống</h1>
                    <p className="text-gray-400 mb-8 text-lg">Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm!</p>
                    <Link 
                        to="/products" 
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 gaming-button"
                    >
                        <FaGamepad className="rotate-12" size={20} />
                        <span>Khám phá sản phẩm</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="text-white max-w-7xl mx-auto relative">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/30">
                        <HiShoppingCart className="text-white" size={24} />
                    </div>
                    <h1 className="text-4xl font-extrabold gaming-title">Giỏ hàng</h1>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map(item => {
                        const stockForPlatform = item.product.stockByPlatform?.[item.platform._id] ?? 0;
                        const itemSubtotal = (item.product.salePrice || item.product.price) * item.quantity;
                        const hasSale = item.product.salePrice && item.product.salePrice < item.product.price;

                        return (
                            <div 
                                key={`${item.product._id}-${item.platform._id}`} 
                                className="group bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border-2 border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Decorative gradient on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
                                
                                <div className="flex items-center gap-4 relative z-10">
                                    {/* Product Image */}
                                    <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
                                        <div className="relative w-28 h-28 rounded-lg overflow-hidden border-2 border-gray-700 group-hover:border-cyan-500/50 transition-colors">
                                            <img
                                                src={getImageUrl(item.product.coverImage) || placeholderImage}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage }}
                                            />
                                            {hasSale && (
                                                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                                    SALE
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Product Info */}
                                    <div className="flex-grow min-w-0">
                                        <Link to={`/product/${item.product.slug}`}>
                                            <h2 className="text-lg font-bold text-white mb-1 line-clamp-2 hover:text-cyan-400 transition-colors">
                                                {item.product.name}
                                            </h2>
                                        </Link>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-3 py-1 bg-gray-700/50 rounded-lg text-xs font-medium border border-gray-600">
                                                {item.platform.name}
                                            </span>
                                            {stockForPlatform <= 0 && (
                                                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-lg border border-red-500/30">
                                                    Hết hàng
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {hasSale ? (
                                                <>
                                                    <span className="text-cyan-400 font-bold">{formatPrice(item.product.salePrice)}</span>
                                                    <span className="text-gray-500 line-through text-sm">{formatPrice(item.product.price)}</span>
                                                </>
                                            ) : (
                                                <span className="text-cyan-400 font-bold">{formatPrice(item.product.price)}</span>
                                            )}
                                            <span className="text-gray-500 text-sm">/ key</span>
                                        </div>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center bg-gray-800/50 border-2 border-gray-700 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => handleQuantityChange(item, -1)}
                                                disabled={item.quantity <= 1}
                                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                aria-label="Giảm số lượng"
                                            >
                                                <HiMinusSm size={20} />
                                            </button>
                                            <span className="w-12 text-center font-bold text-lg py-2 bg-gray-800/50">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item, 1)}
                                                disabled={item.quantity >= stockForPlatform}
                                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                aria-label="Tăng số lượng"
                                            >
                                                <HiPlusSm size={20} />
                                            </button>
                                        </div>

                                        {/* Subtotal */}
                                        <div className="text-right min-w-[120px]">
                                            <p className="text-2xl font-extrabold gaming-price">
                                                {formatPrice(itemSubtotal)}
                                            </p>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemoveItem(item)}
                                            className="p-2 bg-gray-800/50 hover:bg-red-500/20 border border-gray-700 hover:border-red-500/50 rounded-lg text-gray-400 hover:text-red-400 transition-all"
                                            title="Xóa khỏi giỏ"
                                        >
                                            <HiOutlineTrash size={22} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Cart Summary */}
                <div className="lg:sticky lg:top-24">
                    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-6 rounded-xl shadow-2xl border-2 border-gray-700/50 relative overflow-hidden">
                        {/* Decorative gradient border */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                        
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50">
                            <FaShoppingBag className="text-cyan-400" size={24} />
                            <h2 className="text-2xl font-extrabold gaming-section-title">Tóm tắt đơn hàng</h2>
                        </div>

                        {/* Order Details */}
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Số lượng sản phẩm:</span>
                                <span className="font-semibold text-white">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Số loại sản phẩm:</span>
                                <span className="font-semibold text-white">{cartItems.length}</span>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-4 rounded-lg border border-cyan-500/20 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-300">Tổng tiền</span>
                                <span className="text-3xl font-extrabold gaming-price">{formatPrice(cartTotal)}</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <Link 
                            to="/checkout" 
                            className="w-full block text-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 gaming-button flex items-center justify-center gap-2 group"
                        >
                            <HiShoppingCart className="group-hover:rotate-12 transition-transform" size={22} />
                            <span>Tiến hành Thanh toán</span>
                        </Link>

                        {/* Continue Shopping Link */}
                        <Link 
                            to="/products" 
                            className="w-full block text-center mt-4 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                        >
                            ← Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;