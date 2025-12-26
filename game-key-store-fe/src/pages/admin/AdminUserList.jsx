import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchUsersAdmin,
    setAdminUsersPage,
    setAdminUsersSearch,
    deleteUser,
    updateUserRole
} from '../../features/admin/userManagementSlice';
import { selectUser } from '../../features/user/userSlice';
import Pagination from '../../components/common/Pagination';
import { HiCheckCircle, HiXCircle, HiTrash, HiShieldCheck, HiOutlineSearch, HiUsers } from 'react-icons/hi';
import { FaUsers, FaUserShield, FaTrash, FaSearch } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AdminUserList = () => {
    const dispatch = useDispatch();
    const { users, status, page, totalPages, searchQuery } = useSelector(state => state.adminUsers);

    // === SỬA LỖI Ở ĐÂY ===
    // useSelector(selectUser) trả về thẳng object user (hoặc null)
    const currentUser = useSelector(selectUser); // Lấy thông tin admin đang đăng nhập
    // ==================

    const [localSearch, setLocalSearch] = useState(searchQuery);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== searchQuery) {
                dispatch(setAdminUsersSearch(localSearch));
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [localSearch, searchQuery, dispatch]);

    useEffect(() => {
        dispatch(fetchUsersAdmin({ page, limit: 15, search: searchQuery }));
    }, [dispatch, page, searchQuery]);

    const handlePageChange = (newPage) => {
        dispatch(setAdminUsersPage(newPage));
    };

    const handleDelete = (userId, userName) => {
        // Kiểm tra an toàn, dù nút đã bị vô hiệu hóa
        if (userId === currentUser?._id) {
            toast.error("Bạn không thể xóa chính mình.");
            return;
        }
        if (window.confirm(`Bạn có chắc muốn xóa tài khoản "${userName}"?`)) {
            toast.promise(dispatch(deleteUser(userId)).unwrap(), {
                loading: 'Đang xóa...',
                success: 'Đã xóa tài khoản!',
                error: (err) => `Lỗi: ${err || 'Không thể xóa người dùng.'}`
            });
        }
    };

    const handleRoleChange = (userId, userName, newRole) => {
        if (userId === currentUser?._id) {
            toast.error("Bạn không thể thay đổi vai trò của chính mình.");
            return;
        }
        if (window.confirm(`Bạn có chắc muốn ${newRole === 'admin' ? 'cấp quyền Admin' : 'tước quyền Admin'} cho "${userName}"?`)) {
            toast.promise(dispatch(updateUserRole({ userId, role: newRole })).unwrap(), {
                loading: 'Đang cập nhật...',
                success: 'Đã cập nhật vai trò!',
                error: (err) => `Lỗi: ${err || 'Không thể cập nhật vai trò.'}`
            });
        }
    };

    return (
        <div className="relative text-white">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/30">
                        <FaUsers className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold gaming-title">Quản lý Người dùng</h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-2"></div>
                    </div>
                </div>

                {/* Thanh tìm kiếm */}
                <div className="relative">
                    <input
                        type="text"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        placeholder="Tìm theo tên hoặc email..."
                        className="w-full bg-gray-800/50 border-2 border-gray-700 p-3.5 pl-11 rounded-lg text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all placeholder-gray-400"
                    />
                    <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
            </div>

            {/* Bảng Users */}
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg border-2 border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th className="p-4 text-gray-300 font-semibold">Tên</th>
                                <th className="p-4 text-gray-300 font-semibold">Email</th>
                                <th className="p-4 text-gray-300 font-semibold">Vai trò</th>
                                <th className="p-4 text-gray-300 font-semibold">Đã xác thực</th>
                                <th className="p-4 text-gray-300 font-semibold">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {status === 'loading' && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-gray-400">Đang tải danh sách...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {status === 'succeeded' && users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center bg-gray-800/30">
                                        <HiUsers className="mx-auto text-gray-500 mb-3" size={48} />
                                        <p className="text-gray-400 text-lg">Không tìm thấy người dùng nào.</p>
                                    </td>
                                </tr>
                            )}
                            {status === 'failed' && (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center bg-red-900/20">
                                        <p className="text-red-400 text-lg">Lỗi khi tải dữ liệu.</p>
                                    </td>
                                </tr>
                            )}
                            {status === 'succeeded' && users.map(user => {
                                const isCurrentUser = user._id === currentUser?._id;
                                return (
                                    <tr key={user._id} className="border-b border-gray-700/50 hover:bg-gray-800/50 transition-all group">
                                        <td className="p-4 font-bold text-white group-hover:text-cyan-400 transition-colors">{user.name}</td>
                                        <td className="p-4 text-gray-400">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                                                user.role === 'admin' 
                                                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-400 shadow-lg' 
                                                    : 'bg-gray-700/50 border border-gray-600 text-gray-300'
                                            }`}>
                                                {user.role === 'admin' && <FaUserShield size={12} />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {user.isVerified ? (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg">
                                                    <HiCheckCircle className="text-green-400" size={18} title="Đã xác thực" />
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/50 rounded-lg">
                                                    <HiXCircle className="text-red-400" size={18} title="Chưa xác thực" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {user.role === 'user' ? (
                                                    <button
                                                        onClick={() => handleRoleChange(user._id, user.name, 'admin')}
                                                        className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 rounded-lg text-cyan-400 hover:text-cyan-300 transition-all"
                                                        title="Cấp quyền Admin"
                                                    >
                                                        <FaUserShield size={18} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleRoleChange(user._id, user.name, 'user')}
                                                        className="p-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 rounded-lg text-yellow-400 hover:text-yellow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Tước quyền Admin"
                                                        disabled={isCurrentUser}
                                                    >
                                                        <FaUserShield size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(user._id, user.name)}
                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Xóa người dùng"
                                                    disabled={isCurrentUser}
                                                >
                                                    <FaTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Phân trang */}
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

export default AdminUserList;