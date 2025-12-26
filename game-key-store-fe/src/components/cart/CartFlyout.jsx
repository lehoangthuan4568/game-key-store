import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiX, HiOutlineTrash, HiShoppingCart } from 'react-icons/hi';
import { FaShoppingBag, FaGamepad } from 'react-icons/fa';
import { selectIsCartOpen, closeCart } from '../../features/ui/uiSlice';
import { selectCartItems, selectCartTotal, removeItem } from '../../features/cart/cartSlice';
import { getImageUrl } from '../../utils/imageUtils';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
const placeholderImage = "/placeholder-image.png";

const CartFlyout = () => {
    const isOpen = useSelector(selectIsCartOpen);
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const dispatch = useDispatch();

    return (
        <>
            {/* Lớp phủ Backdrop (Tăng z-index) */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} z-[55]`} // <-- Sửa từ z-50 thành z-[55]
                onClick={() => dispatch(closeCart())}
            />
            {/* Panel Giỏ hàng (Tăng z-index) */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-sm bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-[60] border-l-2 border-gray-700/50`}
            >
                <div className="flex flex-col h-full relative overflow-hidden">
                    {/* Decorative background */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-700/50 relative z-10 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg">
                                <HiShoppingCart className="text-white" size={20} />
                            </div>
                            <h2 className="text-2xl font-extrabold gaming-section-title">Giỏ hàng</h2>
                        </div>
                        <button 
                            onClick={() => dispatch(closeCart())} 
                            className="p-2 rounded-lg hover:bg-gray-700/50 border border-gray-700/50 hover:border-red-500/50 transition-all group"
                        >
                            <HiX size={24} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                        </button>
                    </div>

                    {/* Danh sách Items */}
                    {cartItems.length > 0 ? (
                        <div className="flex-grow p-4 overflow-y-auto custom-scrollbar relative z-10">
                            {cartItems.map(item => {
                                const hasSale = item.product.salePrice && item.product.salePrice < item.product.price;
                                return (
                                    <div 
                                        key={`${item.product._id}-${item.platform._id}`} 
                                        className="flex items-start gap-3 mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-cyan-500/30 transition-all group"
                                    >
                                        <Link 
                                            to={`/product/${item.product.slug}`}
                                            onClick={() => dispatch(closeCart())}
                                            className="flex-shrink-0"
                                        >
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-700 group-hover:border-cyan-500/50 transition-colors">
                                                <img
                                                    src={getImageUrl(item.product.coverImage) || placeholderImage}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage }}
                                                />
                                                {hasSale && (
                                                    <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                        SALE
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                        <div className="flex-grow min-w-0">
                                            <Link 
                                                to={`/product/${item.product.slug}`}
                                                onClick={() => dispatch(closeCart())}
                                            >
                                                <h3 className="font-bold text-sm line-clamp-2 hover:text-cyan-400 transition-colors">{item.product.name}</h3>
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
                                        <button 
                                            onClick={() => dispatch(removeItem({ productId: item.product._id, platformId: item.platform._id }))} 
                                            className="p-2 bg-gray-800/50 hover:bg-red-500/20 border border-gray-700/50 hover:border-red-500/50 rounded-lg text-gray-400 hover:text-red-400 flex-shrink-0 transition-all"
                                        >
                                            <HiOutlineTrash size={18} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center relative z-10 px-4">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full mb-4 border-2 border-gray-700/50">
                                <FaShoppingBag className="text-gray-500" size={32} />
                            </div>
                            <p className="text-gray-400 text-center mb-4">Giỏ hàng của bạn đang trống.</p>
                            <Link 
                                to="/products"
                                onClick={() => dispatch(closeCart())}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
                            >
                                <FaGamepad className="rotate-12" size={16} />
                                <span>Mua sắm ngay</span>
                            </Link>
                        </div>
                    )}

                    {/* Footer */}
                    {cartItems.length > 0 && (
                        <div className="p-6 border-t border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm relative z-10">
                            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-4 rounded-lg border border-cyan-500/20 mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-300">Tổng cộng:</span>
                                    <span className="text-2xl font-extrabold gaming-price">{formatPrice(cartTotal)}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Link 
                                    to="/cart" 
                                    onClick={() => dispatch(closeCart())} 
                                    className="w-full text-center bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50 hover:border-gray-600 font-bold py-3 px-4 rounded-lg transition-all"
                                >
                                    Xem giỏ hàng
                                </Link>
                                <Link 
                                    to="/checkout" 
                                    onClick={() => dispatch(closeCart())} 
                                    className="w-full text-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-cyan-500/50 gaming-button flex items-center justify-center gap-2"
                                >
                                    <HiShoppingCart size={20} />
                                    <span>Thanh toán</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartFlyout;