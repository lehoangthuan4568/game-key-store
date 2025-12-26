import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartTotal } from '../features/cart/cartSlice';
import {
    processVnpayCheckout, // Thunk for VNPay
    selectCheckoutStatus,
    selectCheckoutError,
    selectPaymentUrl,
    resetCheckout
} from '../features/checkout/checkoutSlice';
import { toast } from 'react-hot-toast';
import { HiCheckCircle, HiOutlineExternalLink, HiLockClosed, HiCreditCard, HiArrowLeft, HiShoppingCart } from 'react-icons/hi';
import { FaShieldAlt, FaCreditCard, FaLock, FaShoppingBag } from 'react-icons/fa';
import { getImageUrl } from '../utils/imageUtils';

// Helper to format currency
const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
// Placeholder image
const placeholderImage = "/placeholder-image.png";

// --- Order Success Display Component ---
// This component is shown *instead* of the checkout form after a successful "Mock" payment.
// For VNPay, the user is redirected to PaymentReturnPage instead.
// NOTE: Based on our previous steps, this component is no longer used
// because we switched to VNPay-only logic, which uses a separate /payment/vnpay_return page.
// I am REMOVING it to simplify the file, as it is no longer reachable.

// --- Checkout Page Component ---
const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const checkoutStatus = useSelector(selectCheckoutStatus);
    const checkoutError = useSelector(selectCheckoutError);
    const paymentUrl = useSelector(selectPaymentUrl); // Get the VNPay URL

    // Effect to reset checkout state on mount and redirect if cart is empty
    useEffect(() => {
        // Always reset the checkout status when entering the page
        dispatch(resetCheckout());

        // Redirect if cart is empty
        if (cartItems.length === 0 && checkoutStatus !== 'loading') {
            toast.error("Giỏ hàng trống!");
            navigate('/');
        }
        // We only want this effect to run ONCE when the component mounts.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, cartItems.length, navigate]);

    // Effect to handle the redirect to VNPay
    useEffect(() => {
        if (checkoutStatus === 'succeeded' && paymentUrl) {
            // Received VNPay URL, redirect the user's browser
            window.location.href = paymentUrl;
        }
    }, [checkoutStatus, paymentUrl]);

    // Handler to place the order (initiate VNPay payment)
    const handlePlaceOrder = () => {
        if (checkoutStatus === 'loading' || cartItems.length === 0) return;

        const orderData = {
            paymentMethod: 'vnpay', // Hardcoded to vnpay
            cartItems: cartItems.map(item => ({
                productId: item.product._id,
                platformId: item.platform._id,
                quantity: item.quantity
            })),
        };

        dispatch(processVnpayCheckout(orderData))
            .unwrap()
            .catch((error) => {
                // This error happens *before* redirecting (e.g., out of stock)
                toast.error(`Đặt hàng thất bại: ${error || 'Vui lòng thử lại.'}`);
            });
    };

    // --- Render Logic ---
    // The page will only show the checkout form.
    // Success is handled by redirecting to VNPay and then to PaymentReturnPage.
    return (
        <div className="max-w-6xl mx-auto text-white relative">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Header */}
            <div className="mb-8">
                <Link
                    to="/cart"
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4 transition-colors group"
                >
                    <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
                    <span className="font-medium">Quay lại giỏ hàng</span>
                </Link>
                <div className="flex items-center gap-4 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/30">
                        <HiLockClosed className="text-white" size={24} />
                    </div>
                    <h1 className="text-4xl font-extrabold gaming-title">Thanh toán</h1>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
            </div>

            {cartItems.length === 0 && checkoutStatus !== 'loading' ? (
                <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full mb-6 border-2 border-gray-700/50">
                        <HiShoppingCart className="text-gray-500" size={48} />
                    </div>
                    <p className="text-xl text-gray-400 mb-8">Giỏ hàng của bạn đang trống.</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 gaming-button"
                    >
                        <span>Tiếp tục mua sắm</span>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Order Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items Card */}
                        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-6 rounded-xl shadow-2xl border-2 border-gray-700/50 relative overflow-hidden">
                            {/* Decorative gradient border */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50">
                                <FaShoppingBag className="text-cyan-400" size={24} />
                                <h2 className="text-2xl font-extrabold gaming-section-title">Đơn hàng của bạn</h2>
                            </div>

                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map(item => {
                                    const itemTotal = (item.product.salePrice || item.product.price) * item.quantity;
                                    const hasSale = item.product.salePrice && item.product.salePrice < item.product.price;

                                    return (
                                        <div
                                            key={`${item.product._id}-${item.platform._id}`}
                                            className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-cyan-500/30 transition-colors"
                                        >
                                            <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
                                                <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-700">
                                                    <img
                                                        src={getImageUrl(item.product.coverImage) || placeholderImage}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage }}
                                                    />
                                                </div>
                                            </Link>
                                            <div className="flex-grow min-w-0">
                                                <Link to={`/product/${item.product.slug}`}>
                                                    <p className="text-gray-200 font-semibold line-clamp-1 hover:text-cyan-400 transition-colors">
                                                        {item.product.name}
                                                    </p>
                                                </Link>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    <span className="px-2 py-0.5 bg-gray-700/50 rounded text-xs">{item.platform.name}</span>
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {hasSale ? (
                                                        <>
                                                            <span className="text-cyan-400 font-bold text-sm">{formatPrice(item.product.salePrice)}</span>
                                                            <span className="text-gray-500 line-through text-xs">{formatPrice(item.product.price)}</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-cyan-400 font-bold text-sm">{formatPrice(item.product.price)}</span>
                                                    )}
                                                    <span className="text-gray-500 text-xs">x {item.quantity}</span>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-lg font-extrabold gaming-price">{formatPrice(itemTotal)}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Total */}
                            <div className="mt-6 pt-6 border-t border-gray-700/50">
                                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-4 rounded-lg border border-cyan-500/20">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-semibold text-gray-300">Tổng cộng</span>
                                        <span className="text-3xl font-extrabold gaming-price">{formatPrice(cartTotal)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Card */}
                        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-6 rounded-xl shadow-2xl border-2 border-gray-700/50 relative overflow-hidden">
                            {/* Decorative gradient border */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50">
                                <FaCreditCard className="text-cyan-400" size={24} />
                                <h2 className="text-2xl font-extrabold gaming-section-title">Phương thức thanh toán</h2>
                            </div>

                            <div className="space-y-4">
                                {/* VNPay Option */}
                                <div className="relative">
                                    <label className="flex items-center p-4 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-lg cursor-default border-2 border-cyan-500/50 hover:border-cyan-500 transition-all group">
                                        <div className="flex items-center gap-3 flex-grow">
                                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                                                <FaShieldAlt className="text-white" size={20} />
                                            </div>
                                            <div>
                                                <span className="text-gray-200 font-bold text-lg group-hover:text-cyan-400 transition-colors">Thanh toán qua VNPay</span>
                                                <p className="text-xs text-gray-400 mt-1">Bảo mật & An toàn</p>
                                            </div>
                                        </div>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="vnpay"
                                            checked={true}
                                            readOnly
                                            className="w-5 h-5 text-cyan-500 bg-gray-600 border-gray-500 focus:ring-cyan-500 focus:ring-offset-gray-800 cursor-default"
                                        />
                                    </label>
                                </div>

                                {/* Security Info */}
                                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 rounded-lg border border-cyan-500/20">
                                    <div className="flex items-start gap-3">
                                        <FaLock className="text-cyan-400 flex-shrink-0 mt-0.5" size={18} />
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            Bạn sẽ được chuyển hướng đến cổng thanh toán VNPay để hoàn tất giao dịch một cách an toàn.
                                            Thông tin thanh toán của bạn được mã hóa và bảo vệ.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={checkoutStatus === 'loading' || cartItems.length === 0}
                                className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 gaming-button flex items-center justify-center gap-2 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:hover:shadow-none group"
                            >
                                {checkoutStatus === 'loading' ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Đang xử lý...</span>
                                    </>
                                ) : (
                                    <>
                                        <HiLockClosed className="group-hover:scale-110 transition-transform" size={22} />
                                        <span>Thanh toán qua VNPay</span>
                                    </>
                                )}
                            </button>

                            {/* Error Message Display */}
                            {checkoutStatus === 'failed' && (
                                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-red-400 text-center text-sm font-medium">{checkoutError}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:sticky lg:top-24">
                        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-6 rounded-xl shadow-2xl border-2 border-gray-700/50 relative overflow-hidden">
                            {/* Decorative gradient border */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50">
                                <HiCheckCircle className="text-cyan-400" size={24} />
                                <h2 className="text-xl font-extrabold gaming-section-title">Tóm tắt</h2>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-gray-300">
                                    <span>Số lượng:</span>
                                    <span className="font-semibold text-white">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-300">
                                    <span>Sản phẩm:</span>
                                    <span className="font-semibold text-white">{cartItems.length}</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-4 rounded-lg border border-cyan-500/20 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-300">Tổng tiền</span>
                                    <span className="text-2xl font-extrabold gaming-price">{formatPrice(cartTotal)}</span>
                                </div>
                            </div>

                            <div className="text-xs text-gray-400 text-center space-y-1">
                                <p>Bằng cách thanh toán, bạn đồng ý với</p>
                                <p className="text-cyan-400 hover:text-cyan-300 cursor-pointer">Điều khoản & Chính sách</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;