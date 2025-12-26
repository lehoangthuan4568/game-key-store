import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../features/cart/cartSlice';
import { fetchProductBySlug, clearCurrentProduct } from '../../features/product/productSlice';
import { toast } from 'react-hot-toast';
import { HiX, HiShoppingCart, HiMinusSm, HiPlusSm, HiCheck } from 'react-icons/hi';
import { FaGamepad, FaDesktop, FaPlaystation, FaXbox } from 'react-icons/fa';
import { getImageUrl } from '../../utils/imageUtils';

const formatPrice = (price) => {
    if (isNaN(price) || price === null) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const QuickViewModal = ({ isOpen, onClose, product: initialProduct }) => {
    const dispatch = useDispatch();
    const { data: fullProduct, status: productStatus } = useSelector((state) => state.products.currentProduct);

    const [quantity, setQuantity] = useState(1);
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [isClosing, setIsClosing] = useState(false);

    // Use fullProduct if available and matches the requested product, otherwise fallback to initialProduct
    const product = (fullProduct && fullProduct._id === initialProduct?._id) ? fullProduct : initialProduct;
    const isLoading = productStatus === 'loading';

    // Fetch full details when modal opens
    useEffect(() => {
        if (isOpen && initialProduct?.slug) {
            dispatch(fetchProductBySlug(initialProduct.slug));
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            // Optional: clear current product on unmount/close to avoid stale data
            // dispatch(clearCurrentProduct()); 
        };
    }, [isOpen, initialProduct, dispatch]);

    // Handle platform selection and quantity reset when product data is ready
    useEffect(() => {
        if (isOpen && product) {
            // Only reset if we haven't selected a platform yet or if the product data just updated
            if (!selectedPlatform || (fullProduct && fullProduct._id === initialProduct._id && !selectedPlatform)) {
                setQuantity(1);
                const firstAvailable = product.platforms?.find(p => (product.stockByPlatform?.[p._id] ?? 0) > 0);
                setSelectedPlatform(firstAvailable || product.platforms?.[0] || null);
            }
            setIsClosing(false);
        }
    }, [isOpen, product, fullProduct, initialProduct, selectedPlatform]);

    if (!isOpen || !initialProduct) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
            dispatch(clearCurrentProduct());
        }, 300);
    };

    const stockForSelectedPlatform = product.stockByPlatform?.[selectedPlatform?._id] ?? 0;
    const imageUrl = getImageUrl(product.coverImage) || "/placeholder-image.png";

    const handleAddToCart = () => {
        if (!selectedPlatform) {
            toast.error("Vui lòng chọn nền tảng!");
            return;
        }
        if (stockForSelectedPlatform <= 0) {
            toast.error("Sản phẩm này đang tạm hết hàng!");
            return;
        }

        dispatch(addItem({
            product,
            quantity,
            platform: selectedPlatform
        }));

        toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
        handleClose();
    };

    const getPlatformIcon = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('pc') || lowerName.includes('steam') || lowerName.includes('epic')) return <FaDesktop />;
        if (lowerName.includes('ps') || lowerName.includes('playstation')) return <FaPlaystation />;
        if (lowerName.includes('xbox')) return <FaXbox />;
        return <FaGamepad />;
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
                onClick={handleClose}
            ></div>

            {/* Modal Content */}
            <div className={`relative w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-300 transform max-h-[90vh] ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100 animate-zoomIn'}`}>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors backdrop-blur-md"
                >
                    <HiX size={24} />
                </button>

                {/* Left Side: Image */}
                <div className="w-full md:w-2/5 relative h-64 md:h-auto bg-slate-800 shrink-0">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>

                    {/* Price Tag Overlay */}
                    <div className="absolute bottom-6 left-6">
                        {product.salePrice ? (
                            <div className="flex flex-col">
                                <span className="text-slate-400 line-through text-sm font-medium">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg">
                                    {formatPrice(product.salePrice)}
                                </span>
                            </div>
                        ) : (
                            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right Side: Details & Actions */}
                <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col bg-slate-900/95 backdrop-blur-xl overflow-y-auto custom-scrollbar">
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
                        {product.name}
                    </h2>

                    {/* Platform Selection */}
                    <div className="mt-6 mb-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <FaGamepad className="text-cyan-500" /> Chọn Nền Tảng
                            {isLoading && <span className="text-xs text-cyan-400 animate-pulse ml-2">(Đang cập nhật...)</span>}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {product.platforms?.map(p => {
                                // If loading, assume available or use initial data (which might be 0, but we show loading state)
                                // Better: if loading, disable interaction or show skeleton?
                                // For now, we use the best available data.
                                const stock = product.stockByPlatform?.[p._id] ?? 0;
                                const isSelected = selectedPlatform?._id === p._id;
                                const isDisabled = !isLoading && stock <= 0;

                                return (
                                    <button
                                        key={p._id}
                                        onClick={() => !isDisabled && setSelectedPlatform(p)}
                                        disabled={isDisabled}
                                        className={`relative p-3 rounded-xl border text-left transition-all duration-200 group ${isSelected
                                            ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                            : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                                            } ${isDisabled ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-lg ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}>
                                                {getPlatformIcon(p.name)}
                                            </span>
                                            {isSelected && <HiCheck className="text-cyan-400" />}
                                        </div>
                                        <div className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                            {p.name}
                                        </div>
                                        {isDisabled && (
                                            <span className="absolute top-2 right-2 text-[10px] font-bold bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
                                                HẾT
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quantity & Add to Cart */}
                    <div className="mt-auto space-y-4">
                        {selectedPlatform && (
                            <div className={`text-sm font-medium flex items-center gap-2 ${stockForSelectedPlatform > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                <div className={`w-2 h-2 rounded-full ${stockForSelectedPlatform > 0 ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-red-400'}`}></div>
                                {stockForSelectedPlatform > 0 ? `Còn lại ${stockForSelectedPlatform} sản phẩm` : 'Tạm hết hàng'}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={!selectedPlatform || stockForSelectedPlatform <= 0 || isLoading}
                                    className="p-3 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                                >
                                    <HiMinusSm />
                                </button>
                                <span className="w-10 text-center font-bold text-white">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(stockForSelectedPlatform, quantity + 1))}
                                    disabled={!selectedPlatform || stockForSelectedPlatform <= 0 || quantity >= stockForSelectedPlatform || isLoading}
                                    className="p-3 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                                >
                                    <HiPlusSm />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedPlatform || stockForSelectedPlatform <= 0 || isLoading}
                                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <HiShoppingCart size={20} />
                                        <span>THÊM VÀO GIỎ</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default QuickViewModal;
