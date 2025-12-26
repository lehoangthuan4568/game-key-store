import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductBySlug, clearCurrentProduct, fetchRelatedProducts } from '../features/product/productSlice';
import { addItem, selectCartItems } from '../features/cart/cartSlice';
import ProductSection from '../components/home/ProductSection';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineHeart, HiHeart, HiShoppingCart, HiMinusSm, HiPlusSm } from 'react-icons/hi';
import { FaGamepad, FaFire, FaStar, FaTag } from 'react-icons/fa';
import ProductReviews from '../components/product/ProductReviews';
// === SỬA ĐƯỜNG DẪN IMPORT Ở ĐÂY ===
import { selectWishlistIds, addToWishlist, removeFromWishlist } from '../features/user/wishlistSlice';
// ===================================
import { selectIsAuthenticated } from '../features/user/userSlice';
import { toast } from 'react-hot-toast';
import { getImageUrl, getImageUrls } from '../utils/imageUtils';

// Helper to format currency
const formatPrice = (price) => {
    if (isNaN(price) || price === null) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};
// Default placeholder image
const placeholderImage = "/placeholder-image.png";

const ProductDetailPage = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Hook for navigation

    // Selectors
    const { data: product, status } = useSelector((state) => state.products.currentProduct);
    const { data: relatedProducts, status: relatedStatus } = useSelector((state) => state.products.relatedProducts);
    const cartItems = useSelector(selectCartItems);
    const wishlistIds = useSelector(selectWishlistIds);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Component State
    const [quantity, setQuantity] = useState(1);
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [activeImage, setActiveImage] = useState(0);

    // Derived state: Check if the current product is in the wishlist
    const isWishlisted = product ? wishlistIds.includes(product._id) : false;

    // Fetch product data when slug changes
    useEffect(() => {
        if (slug) {
            dispatch(fetchProductBySlug(slug));
            window.scrollTo(0, 0); // Scroll to top
        }
        // Cleanup: Clear product data when leaving the page
        return () => { dispatch(clearCurrentProduct()); };
    }, [slug, dispatch]);

    // Set defaults and fetch related products after product data loads
    useEffect(() => {
        if (product) {
            // Auto-select the first available platform
            const firstAvailablePlatform = product.platforms?.find(p => (product.stockByPlatform?.[p._id] ?? 0) > 0) || product.platforms?.[0];
            if (firstAvailablePlatform && !selectedPlatform) {
                setSelectedPlatform(firstAvailablePlatform);
            } else if (!selectedPlatform && product.platforms?.length > 0) {
                setSelectedPlatform(product.platforms[0]);
            }

            // Fetch related products
            if (product._id) dispatch(fetchRelatedProducts(product._id));

            // Set initial quantity based on stock
            setQuantity(product.inventoryCount > 0 ? 1 : 0);
            // Reset active image index for gallery
            setActiveImage(0);
        }
    }, [product, dispatch, selectedPlatform]);

    // Calculate available stock for the selected platform
    const stockForSelectedPlatform = product?.stockByPlatform?.[selectedPlatform?._id] ?? 0;
    const itemInCart = cartItems.find(item => item.product._id === product?._id && item.platform?._id === selectedPlatform?._id);
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;
    const availableStock = stockForSelectedPlatform - quantityInCart;

    // Gallery images - always include coverImage first, then other images
    const coverImageUrl = product?.coverImage ? getImageUrl(product.coverImage) : null;
    const otherImages = product?.images?.length > 0 ? getImageUrls(product.images) : [];

    // Combine: coverImage first, then other images (remove coverImage from otherImages if it's duplicated)
    const allImages = [];
    if (coverImageUrl) {
        allImages.push(coverImageUrl);
    }
    // Add other images, but skip if it's the same as coverImage
    otherImages.forEach(img => {
        if (img !== coverImageUrl) {
            allImages.push(img);
        }
    });

    const displayImages = allImages.length > 0 ? allImages : (coverImageUrl ? [coverImageUrl] : []);

    // --- Event Handlers ---

    const nextImage = () => {
        if (displayImages.length > 1) {
            setActiveImage((prev) => (prev + 1) % displayImages.length);
        }
    };

    const prevImage = () => {
        if (displayImages.length > 1) {
            setActiveImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
        }
    };

    const handleAddToCart = () => {
        if (!selectedPlatform) return toast.error("Vui lòng chọn nền tảng.");
        if (stockForSelectedPlatform <= 0) return toast.error(`Nền tảng "${selectedPlatform.name}" đã hết hàng!`);
        if (availableStock < quantity) return toast.error("Số lượng trong kho không đủ cho nền tảng này!");
        if (quantity < 1) return toast.error("Vui lòng chọn số lượng.");
        dispatch(addItem({ product, quantity: Number(quantity), platform: selectedPlatform }));
        toast.success(`${product.name} (${selectedPlatform.name}) đã được thêm vào giỏ!`);
    };

    const handleWishlistToggle = () => {
        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập để yêu thích sản phẩm!");
            navigate('/login');
            return;
        }
        if (!product) return;

        const action = isWishlisted ? removeFromWishlist(product._id) : addToWishlist(product._id);
        dispatch(action)
            .unwrap()
            .then(() => toast.success(isWishlisted ? 'Đã xóa khỏi yêu thích!' : 'Đã thêm vào yêu thích!'))
            .catch(() => toast.error('Có lỗi xảy ra khi cập nhật danh sách yêu thích.'));
    };

    // --- Render Logic ---

    if (status === 'loading') {
        return (
            <div className="text-white text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                <p className="mt-4 text-gray-400">Đang tải sản phẩm...</p>
            </div>
        );
    }
    if (status === 'failed' || !product) {
        return (
            <div className="text-white text-center py-20">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-2xl font-bold mb-2">Không tìm thấy sản phẩm</h2>
                <p className="text-gray-400 mb-6">Sản phẩm bạn đang tìm có thể không tồn tại hoặc đã bị xóa.</p>
                <Link to="/products" className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                    Xem tất cả sản phẩm
                </Link>
            </div>
        );
    }

    // Calculate discount percentage
    const discountPercent = product.salePrice && product.price > 0
        ? Math.round(((product.price - product.salePrice) / product.price) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-cyan-500/10 rounded-full blur-[120px] animate-float"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[100px] animate-pulse-glow"></div>
            </div>

            <div className="container-custom py-12">
                {/* Breadcrumb / Back Button */}
                <div className="mb-8">
                    <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors group">
                        <div className="p-2 rounded-full bg-slate-800/50 border border-slate-700 group-hover:border-cyan-500/50 transition-all">
                            <HiOutlineChevronLeft size={20} />
                        </div>
                        <span className="font-medium">Quay lại cửa hàng</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
                    {/* Left Column: Gallery (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Main Image */}
                        <div className="relative group w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-[0_0_50px_rgba(6,182,212,0.15)] animate-float hover:shadow-[0_0_70px_rgba(6,182,212,0.3)] transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10 pointer-events-none"></div>
                            <img
                                src={displayImages[activeImage] || getImageUrl(product.coverImage) || placeholderImage}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage }}
                            />

                            {/* Badges */}
                            <div className="absolute top-6 left-6 flex flex-col gap-3 z-20">
                                {product.isHot && (
                                    <span className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-orange-500/20 backdrop-blur-md border border-white/10 animate-pulse-glow">
                                        <FaFire className="text-yellow-200" /> HOT
                                    </span>
                                )}
                                {product.isNew && (
                                    <span className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20 backdrop-blur-md border border-white/10">
                                        <FaStar className="text-cyan-100" /> NEW
                                    </span>
                                )}
                                {discountPercent > 0 && (
                                    <span className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-pink-500/20 backdrop-blur-md border border-white/10">
                                        <FaTag /> -{discountPercent}%
                                    </span>
                                )}
                            </div>

                            {/* Navigation */}
                            {displayImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/10 text-white hover:bg-cyan-500 hover:border-cyan-400 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                                    >
                                        <HiOutlineChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/10 text-white hover:bg-cyan-500 hover:border-cyan-400 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                                    >
                                        <HiOutlineChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {displayImages.length > 1 && (
                            <div className="grid grid-cols-5 gap-4">
                                {displayImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImage(index)}
                                        className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 group ${activeImage === index
                                            ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105 z-10'
                                            : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className={`absolute inset-0 bg-cyan-500/20 transition-opacity duration-300 ${activeImage === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}></div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Info (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col h-full">
                        <div className="sticky top-24 space-y-8">
                            {/* Header */}
                            <div>
                                <div className="flex justify-between items-start gap-4 mb-4">
                                    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-200 leading-tight tracking-tight drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                                        {product.name}
                                    </h1>
                                    <button
                                        onClick={handleWishlistToggle}
                                        className={`p-4 rounded-2xl border transition-all duration-300 flex-shrink-0 ${isWishlisted
                                            ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400'
                                            }`}
                                    >
                                        {isWishlisted ? <HiHeart size={28} /> : <HiOutlineHeart size={28} />}
                                    </button>
                                </div>
                                <p className="text-slate-400 text-lg leading-relaxed font-medium border-l-4 border-cyan-500/50 pl-4">
                                    {product.shortDescription}
                                </p>
                            </div>

                            {/* Price Card */}
                            <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="flex items-baseline gap-4 mb-2 relative z-10">
                                    {product.salePrice ? (
                                        <>
                                            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                                                {formatPrice(product.salePrice)}
                                            </span>
                                            <span className="text-xl text-slate-500 line-through font-semibold">
                                                {formatPrice(product.price)}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                            {formatPrice(product.price)}
                                        </span>
                                    )}
                                </div>
                                {product.salePrice && (
                                    <p className="text-sm text-cyan-300 font-medium relative z-10 flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                                        Tiết kiệm {formatPrice(product.price - product.salePrice)}
                                    </p>
                                )}
                            </div>

                            {/* Platform Selection */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-300 font-bold text-lg">
                                    <FaGamepad className="text-cyan-400 text-xl" />
                                    <h3>Chọn Nền Tảng</h3>
                                </div>

                                {product.platforms && product.platforms.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {product.platforms.map((p) => {
                                            const platformStockCount = product.stockByPlatform?.[p._id] ?? 0;
                                            const isDisabled = platformStockCount <= 0;
                                            const isSelected = selectedPlatform?._id === p._id;
                                            return (
                                                <button
                                                    key={p._id}
                                                    onClick={() => !isDisabled && setSelectedPlatform(p)}
                                                    disabled={isDisabled}
                                                    className={`relative px-4 py-4 rounded-xl border transition-all duration-300 flex items-center justify-between group/btn overflow-hidden ${isSelected
                                                        ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                                                        : 'bg-slate-800/40 border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/60'
                                                        } ${isDisabled ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}`}
                                                >
                                                    <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000`}></div>
                                                    <span className={`font-bold relative z-10 ${isSelected ? 'text-cyan-400' : 'text-slate-300 group-hover/btn:text-cyan-200'}`}>
                                                        {p.name}
                                                    </span>
                                                    {isDisabled ? (
                                                        <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-1 rounded relative z-10">HẾT</span>
                                                    ) : isSelected && (
                                                        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] relative z-10"></div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 text-sm">
                                        Chưa có thông tin nền tảng.
                                    </div>
                                )}
                            </div>

                            {/* Stock & Actions */}
                            <div className="space-y-6 pt-6 border-t border-slate-800">
                                {selectedPlatform && (
                                    <div className={`flex items-center gap-3 text-sm font-medium ${stockForSelectedPlatform > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        <div className={`w-2 h-2 rounded-full ${stockForSelectedPlatform > 0 ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-red-400'}`}></div>
                                        {stockForSelectedPlatform > 0
                                            ? `Còn lại ${availableStock} sản phẩm`
                                            : 'Tạm hết hàng'}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    {/* Quantity */}
                                    <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            disabled={!stockForSelectedPlatform}
                                            className="p-3 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                                        >
                                            <HiMinusSm />
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            readOnly
                                            className="w-12 bg-transparent text-center font-bold text-white focus:outline-none"
                                        />
                                        <button
                                            onClick={() => setQuantity(q => Math.min(availableStock, q + 1))}
                                            disabled={availableStock <= quantity || !stockForSelectedPlatform}
                                            className="p-3 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                                        >
                                            <HiPlusSm />
                                        </button>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={availableStock <= 0 || !selectedPlatform}
                                        className="flex-1 relative overflow-hidden group bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98]"
                                    >
                                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat transition-[background-position] duration-0 group-hover:bg-[position:200%_0,0_0] group-hover:duration-[1500ms]"></div>
                                        <div className="relative flex items-center justify-center gap-3 py-4">
                                            <HiShoppingCart size={24} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300" />
                                            <span className="text-lg tracking-wide">
                                                {availableStock > 0 ? 'THÊM VÀO GIỎ' : 'HẾT HÀNG'}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
                    <div className="lg:col-span-2">
                        <div className="bg-slate-900/60 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/5 shadow-xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                                    <FaGamepad className="text-2xl text-cyan-400" />
                                </div>
                                <h2 className="text-3xl font-black text-white">Giới Thiệu Game</h2>
                            </div>
                            <div
                                className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }}
                            />
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Specs/Info Card */}
                        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <FaStar className="text-purple-400" /> Thông Tin Chi Tiết
                            </h3>

                            <div className="space-y-4">
                                {product.genres?.length > 0 && (
                                    <div>
                                        <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Thể Loại</span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {product.genres.map((g) => (
                                                <span key={g._id} className="px-3 py-1 bg-slate-800 rounded-lg text-sm text-cyan-300 border border-slate-700">
                                                    {g.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-slate-800">
                                    <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Nhà Phát Hành</span>
                                    <p className="text-white mt-1 font-medium">{product.publisher || 'Đang cập nhật'}</p>
                                </div>

                                <div className="pt-4 border-t border-slate-800">
                                    <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Ngày Phát Hành</span>
                                    <p className="text-white mt-1 font-medium">
                                        {product.releaseDate ? new Date(product.releaseDate).toLocaleDateString('vi-VN') : 'Đang cập nhật'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Reviews */}
                <ProductReviews />

                {/* Related Products */}
                <div className="border-t border-slate-800 pt-16">
                    <ProductSection
                        title="Có Thể Bạn Sẽ Thích"
                        products={relatedProducts}
                        status={relatedStatus}
                        icon={<FaFire className="text-orange-500" />}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;