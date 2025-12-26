// src/pages/WishlistPage.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getWishlist, selectWishlistItems, selectWishlistStatus } from '../features/user/wishlistSlice';
import ProductCard from '../components/common/ProductCard';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
    const dispatch = useDispatch();
    const wishlistItems = useSelector(selectWishlistItems);
    const status = useSelector(selectWishlistStatus);

    useEffect(() => {
        // Luôn fetch dữ liệu mới nhất khi vào trang này
        dispatch(getWishlist());
    }, [dispatch]); // Chỉ phụ thuộc vào dispatch (chỉ chạy 1 lần khi mount)

    return (
        <div className="max-w-6xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-8">Danh sách Yêu thích</h1>

            {status === 'loading' && <p className="text-center py-10 text-gray-400">Đang tải...</p>}
            {status === 'failed' && <p className="text-center py-10 text-red-500">Lỗi khi tải danh sách yêu thích.</p>}

            {status === 'succeeded' && wishlistItems.length === 0 && (
                 <div className="text-center py-20">
                    <p className="text-xl text-gray-400 mb-4">Danh sách yêu thích của bạn đang trống.</p>
                    <Link to="/products" className="bg-cyan-500 hover:bg-cyan-600 font-bold py-3 px-6 rounded-md transition-colors">
                        Khám phá sản phẩm
                    </Link>
                </div>
            )}

            {status === 'succeeded' && wishlistItems.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Sử dụng ProductCard, nút tim sẽ tự động cập nhật trạng thái
                        dựa trên itemIds đã được cập nhật bởi action add/remove */}
                    {wishlistItems.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;