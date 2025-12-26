import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import {
    fetchInventory,
    addKey,
    addBulk,
    deleteKey,
    setInventoryPage
} from '../../features/admin/inventorySlice';
import { fetchPlatforms } from '../../features/platform/platformSlice';
import Pagination from '../../components/common/Pagination';
import { HiTrash, HiArrowLeft, HiKey, HiUpload } from 'react-icons/hi';
import { FaKey, FaBox, FaPlus, FaUpload, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
// Import api instance (nếu bạn cần gọi API trực tiếp, mặc dù ở đây không cần)
// import api from '../../api/api';

const AdminInventoryList = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();

    // Lấy state từ Redux, bao gồm cả state phân trang
    const { keys, product, status, page, totalPages, error } = useSelector(state => state.adminInventory);
    const { items: platforms, status: platformStatus } = useSelector(state => state.platforms);

    // State cục bộ cho các form
    const [singleKey, setSingleKey] = useState('');
    const [singlePlatform, setSinglePlatform] = useState('');
    const [bulkFile, setBulkFile] = useState(null);
    const [bulkPlatform, setBulkPlatform] = useState('');

    // Ref để theo dõi lần tải đầu tiên (fix lỗi gọi API 2 lần)
    const isInitialMount = useRef(true);

    // Effect fetch platforms (chỉ 1 lần)
    useEffect(() => {
        if (platformStatus === 'idle') {
            dispatch(fetchPlatforms());
        }
    }, [platformStatus, dispatch]);

    // Effect fetch inventory (chạy khi productId thay đổi)
    // Sẽ reset về trang 1 và fetch
    useEffect(() => {
        if (productId) {
            // dispatch(setInventoryPage(1)); // Không cần setPage ở đây, thunk sẽ trả về page
            dispatch(fetchInventory({ productId, params: { page: 1, limit: 10 } }));
            isInitialMount.current = true; // Đánh dấu là đang tải lần đầu cho productId này
        }
    }, [productId, dispatch]); // Chỉ chạy khi productId thay đổi

    // Effect fetch lại khi 'page' thay đổi (do người dùng bấm)
    useEffect(() => {
        // Bỏ qua lần chạy đầu tiên (vì đã fetch ở effect trên)
        if (isInitialMount.current) {
            isInitialMount.current = false; // Bỏ đánh dấu
            return;
        }

        // Chỉ fetch nếu page > 0 (và không phải lần đầu)
        if (productId && page > 0) {
            dispatch(fetchInventory({ productId, params: { page, limit: 10 } }));
        }
    }, [page, dispatch, productId]); // Chạy khi 'page' thay đổi

    // Effect set platform mặc định cho form
    useEffect(() => {
        if (platforms.length > 0) {
            if (!singlePlatform) setSinglePlatform(platforms[0]._id);
            if (!bulkPlatform) setBulkPlatform(platforms[0]._id);
        }
    }, [platforms, singlePlatform, bulkPlatform]);

    // Handler thêm 1 key
    const handleAddSingleKey = (e) => {
        e.preventDefault();
        if (!singleKey.trim()) return toast.error("Giá trị key không được để trống.");
        toast.promise(dispatch(addKey({ product: productId, platform: singlePlatform, gameKey: singleKey })).unwrap(), {
            loading: 'Đang thêm...',
            success: () => {
                setSingleKey(''); // Xóa input sau khi thành công
                return 'Thêm key thành công!';
            },
            error: (err) => `Lỗi: ${err || 'Vui lòng thử lại'}`
        });
    };

    // Handler thêm key hàng loạt
    const handleBulkSubmit = (e) => {
        e.preventDefault();
        if (!bulkFile) return toast.error("Vui lòng chọn một file .txt");

        const formData = new FormData();
        formData.append('keysFile', bulkFile);
        formData.append('product', productId);
        formData.append('platform', bulkPlatform);

        toast.promise(dispatch(addBulk(formData)).unwrap(), {
            loading: 'Đang tải lên...',
            success: (res) => res || 'Thêm key hàng loạt thành công!',
            error: (err) => `Lỗi: ${err || 'Vui lòng thử lại'}`
        });
        // Reset file input (hơi phức tạp, cách đơn giản là reset form)
        e.target.reset();
        setBulkFile(null);
    };

    // Handler xóa key
    const handleDelete = (keyId) => {
        if (window.confirm('Bạn có chắc muốn xóa key này?')) {
            toast.promise(dispatch(deleteKey(keyId)).unwrap(), {
                loading: 'Đang xóa...',
                success: 'Đã xóa key!',
                error: (err) => `Lỗi: ${err || 'Xóa thất bại!'}`,
            });
        }
    };

    // Handler chuyển trang
    const handlePageChange = (newPage) => {
        dispatch(setInventoryPage(newPage)); // Chỉ dispatch action set page
        window.scrollTo(0, 0); // Cuộn lên đầu
    };

    // Hiển thị loading ban đầu
    if (status === 'loading' && page === 1 && !product) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xl text-gray-400 font-medium">Đang tải dữ liệu kho...</p>
            </div>
        );
    }

    // Hiển thị lỗi fetch ban đầu
    if (status === 'failed' && page === 1 && !product) {
        return (
            <div className="text-center py-20 bg-gradient-to-br from-red-900/20 to-red-800/20 backdrop-blur-sm rounded-xl border-2 border-red-500/30">
                <p className="text-red-400 text-lg">Lỗi: {error || 'Không thể tải dữ liệu.'}</p>
            </div>
        );
    }

    return (
        <div className="relative text-white">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Header */}
            <div className="mb-8">
                <Link 
                    to="/admin/products" 
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4 transition-colors group"
                >
                    <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
                    <span className="font-medium">Quay lại danh sách sản phẩm</span>
                </Link>
                <div className="flex items-center gap-4 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/30">
                        <FaKey className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold gaming-title">
                            Quản lý Kho Key
                        </h1>
                        <p className="text-xl text-cyan-400 font-semibold mt-2">{product?.name}</p>
                        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-2"></div>
                    </div>
                </div>
            </div>

            {/* Form Add Single Key */}
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm p-6 rounded-xl mb-8 border-2 border-gray-700/50 shadow-lg">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700/50">
                    <FaPlus className="text-cyan-400" size={20} />
                    <h2 className="text-xl font-extrabold gaming-section-title">Thêm Key đơn lẻ</h2>
                </div>
                <form onSubmit={handleAddSingleKey} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-2 text-gray-300">Nền tảng</label>
                        <select 
                            value={singlePlatform} 
                            onChange={e => setSinglePlatform(e.target.value)} 
                            className="w-full bg-gray-800/50 border-2 border-gray-700 p-2.5 rounded-lg text-white outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                        >
                            {platformStatus === 'loading' ? <option>Đang tải...</option> : platforms.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2 text-gray-300">Giá trị Key</label>
                        <input 
                            type="text" 
                            value={singleKey} 
                            onChange={e => setSingleKey(e.target.value)} 
                            placeholder="ABCD-EFGH-IJKL-MNOP" 
                            className="w-full bg-gray-800/50 border-2 border-gray-700 p-2.5 rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all" 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={status === 'loading'} 
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-2.5 px-4 rounded-lg transition-all shadow-lg hover:shadow-cyan-500/50 gaming-button disabled:opacity-50 disabled:cursor-not-allowed h-[42px]"
                    >
                        <FaPlus size={16} />
                        <span>Thêm Key</span>
                    </button>
                </form>
            </div>

            {/* Form Bulk Upload */}
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm p-6 rounded-xl mb-8 border-2 border-gray-700/50 shadow-lg">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700/50">
                    <FaUpload className="text-green-400" size={20} />
                    <h2 className="text-xl font-extrabold gaming-section-title">Tải lên Key hàng loạt</h2>
                </div>
                <form onSubmit={handleBulkSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-2 text-gray-300">Nền tảng</label>
                        <select 
                            value={bulkPlatform} 
                            onChange={e => setBulkPlatform(e.target.value)} 
                            className="w-full bg-gray-800/50 border-2 border-gray-700 p-2.5 rounded-lg text-white outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                        >
                            {platformStatus === 'loading' ? <option>Đang tải...</option> : platforms.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2 text-gray-300">Chọn file (.txt, mỗi key một dòng)</label>
                        <input
                            type="file"
                            onChange={e => setBulkFile(e.target.files[0])}
                            key={bulkFile ? bulkFile.name : 'file-input'}
                            accept=".txt"
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-2 file:border-gray-700 file:font-semibold file:bg-gray-800/50 file:text-cyan-300 hover:file:bg-gray-700/50 hover:file:border-cyan-500/50 cursor-pointer transition-all"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={status === 'loading'} 
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-2.5 px-4 rounded-lg transition-all shadow-lg hover:shadow-green-500/50 gaming-button disabled:opacity-50 disabled:cursor-not-allowed h-[42px]"
                    >
                        <FaUpload size={16} />
                        <span>Tải lên</span>
                    </button>
                </form>
            </div>

            {/* Keys Table */}
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg border-2 border-gray-700/50 overflow-hidden">
                <div className="p-6 border-b border-gray-700/50">
                    <div className="flex items-center gap-3">
                        <FaKey className="text-cyan-400" size={24} />
                        <h2 className="text-2xl font-extrabold gaming-section-title">Danh sách Keys</h2>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th className="p-4 text-gray-300 font-semibold w-2/4">Giá trị Key</th>
                                <th className="p-4 text-gray-300 font-semibold">Nền tảng</th>
                                <th className="p-4 text-gray-300 font-semibold">Trạng thái</th>
                                <th className="p-4 text-gray-300 font-semibold">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {status === 'loading' && (
                                <tr>
                                    <td colSpan="4" className="text-center p-8">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-gray-400">Đang làm mới...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {status === 'succeeded' && keys.map(key => (
                                <tr key={key._id} className="border-b border-gray-700/50 hover:bg-gray-800/50 transition-all group">
                                    <td className="p-4">
                                        <code className="font-mono text-yellow-400 font-bold group-hover:text-yellow-300 transition-colors">{key.gameKey}</code>
                                    </td>
                                    <td className="p-4 text-gray-300">
                                        <span className="px-2 py-1 bg-gray-700/50 rounded text-xs border border-gray-600">{key.platform?.name}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                                            key.isSold 
                                                ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/50 text-red-400' 
                                                : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 text-green-400'
                                        }`}>
                                            {key.isSold ? 'Đã bán' : 'Còn hàng'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {!key.isSold && (
                                            <button
                                                onClick={() => handleDelete(key._id)}
                                                className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-all"
                                                disabled={status === 'loading'}
                                                title="Xóa key"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {status === 'succeeded' && keys.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center p-12 bg-gray-800/30">
                                        <FaKey className="mx-auto text-gray-500 mb-3" size={48} />
                                        <p className="text-gray-400 text-lg">Chưa có key nào cho sản phẩm này.</p>
                                    </td>
                                </tr>
                            )}
                            {status === 'failed' && page === 1 && (
                                <tr>
                                    <td colSpan="4" className="text-center p-12 bg-red-900/20">
                                        <p className="text-red-400 text-lg">Lỗi: {error || 'Không thể tải key.'}</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
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

export default AdminInventoryList;