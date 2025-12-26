import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    fetchAllProducts,
    deleteProduct,
    setFilters,
    setPage
} from '../../features/product/productSlice';
import Pagination from '../../components/common/Pagination';
import { HiPencil, HiTrash, HiKey, HiOutlineSearch, HiCube } from 'react-icons/hi';
import { FaBox, FaPlus, FaEdit, FaKey, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const AdminProductList = () => {
    const dispatch = useDispatch();

    // === ĐỌC DỮ LIỆU TRỰC TIẾP TỪ REDUX ===
    const { data: products, status, page, totalPages } = useSelector(state => state.products.allProducts);
    const { search: currentSearchQuery } = useSelector(state => state.products.filters);
    // ======================================

    // State cục bộ CHỈ DÀNH CHO input tìm kiếm (để debounce)
    const [localSearch, setLocalSearch] = useState(currentSearchQuery || '');

    // Debounce (trì hoãn) cho thanh tìm kiếm
    useEffect(() => {
        const timer = setTimeout(() => {
            // Khi người dùng ngừng gõ, cập nhật filter trong Redux
            if (localSearch !== currentSearchQuery) {
                dispatch(setFilters({ search: localSearch, page: 1 }));
            }
        }, 500); // Chờ 500ms
        return () => clearTimeout(timer);
    }, [localSearch, currentSearchQuery, dispatch]);

    // Effect chính để fetch dữ liệu khi trang hoặc filter tìm kiếm (trong Redux) thay đổi
    useEffect(() => {
        dispatch(fetchAllProducts({
            page,
            limit: 15, // 15 sản phẩm mỗi trang
            search: currentSearchQuery
        }));
    }, [dispatch, page, currentSearchQuery]); // Chạy lại khi page hoặc filter tìm kiếm thay đổi

    // Xử lý xóa
    const handleDelete = (id, name) => {
        if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"?`)) {
            toast.promise(dispatch(deleteProduct(id)).unwrap(), {
                loading: 'Đang xóa...',
                success: (result) => {
                    // Tải lại dữ liệu trang hiện tại sau khi xóa
                    // (Kiểm tra xem có cần quay về trang 1 nếu trang hiện tại bị rỗng)
                    dispatch(fetchAllProducts({ page, limit: 15, search: currentSearchQuery }));
                    return `Đã xóa sản phẩm "${name}"`;
                },
                error: (err) => `Lỗi khi xóa: ${err}`
            });
        }
    };

    // Xử lý chuyển trang
    const handlePageChange = (newPage) => {
        dispatch(setPage(newPage)); // Chỉ cần dispatch action, useEffect sẽ tự fetch
        window.scrollTo(0, 0);
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/30">
                            <FaBox className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold gaming-title">Quản lý Sản phẩm</h1>
                            <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-2"></div>
                        </div>
                    </div>
                    <Link 
                        to="/admin/products/new" 
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-cyan-500/50 gaming-button"
                    >
                        <FaPlus size={18} />
                        <span>Thêm sản phẩm</span>
                    </Link>
                </div>

                {/* Thanh tìm kiếm */}
                <div className="relative">
                    <input
                        type="text"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        placeholder="Tìm theo tên sản phẩm..."
                        className="w-full bg-gray-800/50 border-2 border-gray-700 p-3.5 pl-11 rounded-lg text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all placeholder-gray-400"
                    />
                    <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg border-2 border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th className="p-4 text-gray-300 font-semibold w-1/2">Tên sản phẩm</th>
                                <th className="p-4 text-gray-300 font-semibold">Giá gốc</th>
                                <th className="p-4 text-gray-300 font-semibold">Giá sale</th>
                                <th className="p-4 text-gray-300 font-semibold">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {status === 'loading' && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-gray-400">Đang tải...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {status === 'succeeded' && products.map(product => (
                                <tr key={product._id} className="border-b border-gray-700/50 hover:bg-gray-800/50 transition-all group">
                                    <td className="p-4 font-bold text-white group-hover:text-cyan-400 transition-colors">{product.name}</td>
                                    <td className="p-4 text-gray-400">{formatPrice(product.price)}</td>
                                    <td className="p-4">
                                        {product.salePrice ? (
                                            <span className="text-cyan-400 font-bold">{formatPrice(product.salePrice)}</span>
                                        ) : (
                                            <span className="text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Link 
                                                to={`/admin/products/edit/${product.slug}`} 
                                                title="Sửa" 
                                                className="p-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 rounded-lg text-yellow-400 hover:text-yellow-300 transition-all"
                                            >
                                                <FaEdit size={18} />
                                            </Link>
                                            <Link 
                                                to={`/admin/inventory/${product._id}`} 
                                                title="Quản lý kho" 
                                                className="p-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/50 rounded-lg text-green-400 hover:text-green-300 transition-all"
                                            >
                                                <FaKey size={18} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(product._id, product.name)} 
                                                title="Xóa" 
                                                className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-all"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {status === 'succeeded' && products.length === 0 && (
                    <div className="p-12 text-center bg-gray-800/30">
                        <HiCube className="mx-auto text-gray-500 mb-3" size={48} />
                        <p className="text-gray-400 text-lg">Không có sản phẩm nào.</p>
                    </div>
                )}
                {status === 'failed' && (
                    <div className="p-12 text-center bg-red-900/20">
                        <p className="text-red-400 text-lg">Lỗi khi tải dữ liệu.</p>
                    </div>
                )}
            </div>

            {/* PHÂN TRANG (đọc totalPages từ Redux) */}
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

export default AdminProductList;