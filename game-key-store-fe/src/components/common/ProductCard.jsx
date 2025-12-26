import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectWishlistIds, addToWishlist, removeFromWishlist } from '../../features/user/wishlistSlice';
import { selectIsAuthenticated } from '../../features/user/userSlice';
import { HiHeart, HiOutlineHeart, HiShoppingCart } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';
import QuickViewModal from './QuickViewModal';

const formatPrice = (price) => {
    if (isNaN(price) || price === null) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};
const placeholderImage = "/placeholder-image.png";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const wishlistIds = useSelector(selectWishlistIds) || [];
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    if (!product) return null;

    const isWishlisted = wishlistIds.includes(product._id);
    const imageUrl = getImageUrl(product.coverImage) || placeholderImage;

    const price = product.price ?? 0;
    const salePrice = product.salePrice ?? null;
    const hasSale = salePrice !== null && salePrice < price;
    const discountPercentage = hasSale && price > 0 ? Math.round(((price - salePrice) / price) * 100) : 0;

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập!");
            navigate('/login');
            return;
        }
        const action = isWishlisted ? removeFromWishlist(product._id) : addToWishlist(product._id);
        dispatch(action)
            .unwrap()
            .then(() => toast.success(isWishlisted ? 'Đã xóa khỏi yêu thích!' : 'Đã thêm vào yêu thích!'))
            .catch(() => toast.error('Có lỗi xảy ra.'));
    };

    const handleQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsQuickViewOpen(true);
    };

    // Style chung cho các tag
    const tagBaseStyle = "text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded backdrop-blur-md shadow-lg tracking-wide uppercase";

    return (
        <>
            <div className="relative group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:-translate-y-2 h-full flex flex-col">

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>

                {/* Nút Yêu thích (Góc trên phải) */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-3 right-3 z-30 p-2.5 bg-slate-900/60 backdrop-blur-md rounded-xl text-slate-300 hover:bg-red-500 hover:text-white transition-all duration-300 border border-white/10 hover:border-red-500 shadow-lg group-hover:scale-110"
                    aria-label={isWishlisted ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                >
                    {isWishlisted ? <HiHeart size={18} className="text-red-500 hover:text-white" /> : <HiOutlineHeart size={18} />}
                </button>

                {/* === KHU VỰC TAG MỚI (Góc trên trái) === */}
                <div className="absolute top-3 left-3 z-30 flex flex-col items-start gap-2">
                    {/* Tag Giảm giá */}
                    {hasSale && (
                        <div className={`${tagBaseStyle} bg-red-600/90 shadow-red-600/20 border border-red-500/30`}>
                            -{discountPercentage}%
                        </div>
                    )}
                    {/* Tag Mới */}
                    {product.isNew && (
                        <div className={`${tagBaseStyle} bg-blue-600/90 shadow-blue-600/20 border border-blue-500/30`}>
                            NEW
                        </div>
                    )}
                    {/* Tag Hot */}
                    {product.isHot && (
                        <div className={`${tagBaseStyle} bg-orange-600/90 shadow-orange-600/20 border border-orange-500/30`}>
                            HOT
                        </div>
                    )}
                </div>

                {/* Phần Ảnh */}
                <Link to={`/product/${product.slug}`} className="block aspect-[4/3] overflow-hidden relative z-10">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage }}
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                </Link>

                {/* Phần thông tin */}
                <div className="p-5 flex flex-col flex-grow relative z-20">
                    <Link to={`/product/${product.slug}`} className="flex-grow mb-3">
                        <h3
                            className="text-base md:text-lg font-bold text-slate-100 leading-snug line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300"
                            title={product.name}
                        >
                            {product.name}
                        </h3>
                    </Link>

                    {/* Giá và Actions */}
                    <div className="mt-auto pt-4 border-t border-slate-800 group-hover:border-cyan-500/20 transition-colors duration-300 flex items-end justify-between">
                        <div className="flex flex-col">
                            {hasSale && (
                                <span className="text-slate-500 line-through text-xs font-medium mb-0.5">
                                    {formatPrice(price)}
                                </span>
                            )}
                            <span className="text-cyan-400 font-bold text-lg md:text-xl text-shadow-glow">
                                {formatPrice(hasSale ? salePrice : price)}
                            </span>
                        </div>

                        {/* Add to Cart Button (Mini) */}
                        <button
                            onClick={handleQuickView}
                            className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:translate-x-0 translate-x-2 opacity-0 group-hover:opacity-100"
                            title="Thêm vào giỏ hàng"
                        >
                            <HiShoppingCart size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick View Modal */}
            <QuickViewModal
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
                product={product}
            />
        </>
    );
};

export default ProductCard;