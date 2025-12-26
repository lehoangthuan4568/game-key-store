import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const CategoryManager = ({ title, items, createAction, updateAction, deleteAction, icon }) => {
    const dispatch = useDispatch();
    const [newItemName, setNewItemName] = useState('');
    const [editingItem, setEditingItem] = useState(null); // { _id: '...', name: '...' }
    const [editingName, setEditingName] = useState('');

    const handleCreate = (e) => {
        e.preventDefault();
        if (!newItemName.trim()) return toast.error('Tên không được để trống.');

        toast.promise(dispatch(createAction({ name: newItemName })).unwrap(), {
            loading: 'Đang thêm...',
            // === SỬA LỖI CÚ PHÁP TẠI ĐÂY ===
            success: () => {
                // ============================
                setNewItemName('');
                return 'Thêm thành công!';
            },
            error: 'Thêm thất bại!'
        });
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Bạn có chắc muốn xóa "${name}"?`)) {
            toast.promise(dispatch(deleteAction(id)).unwrap(), {
                loading: 'Đang xóa...',
                success: 'Xóa thành công!',
                error: 'Xóa thất bại!'
            });
        }
    };

    const startEdit = (item) => {
        setEditingItem(item);
        setEditingName(item.name);
    };

    const cancelEdit = () => {
        setEditingItem(null);
        setEditingName('');
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!editingName.trim()) return toast.error('Tên không được để trống.');
        if (editingName === editingItem.name) return cancelEdit(); // Không có gì thay đổi

        toast.promise(
            dispatch(updateAction({ id: editingItem._id, data: { name: editingName } })).unwrap(),
            {
                loading: 'Đang cập nhật...',
                // === SỬA LỖI CÚ PHÁP TƯƠNG TỰ TẠI ĐÂY ===
                success: () => {
                    // ===================================
                    cancelEdit();
                    return 'Cập nhật thành công!';
                },
                error: 'Cập nhật thất bại!'
            }
        );
    };

    return (
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border-2 border-gray-700/50 relative overflow-hidden">
            {/* Decorative gradient border */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50">
                {icon}
                <h2 className="text-2xl font-extrabold gaming-section-title">{title}</h2>
            </div>

            {/* Form Thêm mới */}
            <form onSubmit={handleCreate} className="flex gap-3 mb-6">
                <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Tên mới..."
                    className="flex-grow bg-gray-800/50 border-2 border-gray-700 p-3 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all"
                />
                <button 
                    type="submit" 
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-cyan-500/50 gaming-button"
                >
                    <FaPlus size={16} />
                    <span>Thêm</span>
                </button>
            </form>

            {/* Danh sách */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {items && items.length > 0 ? items.map(item => (
                    <div 
                        key={item._id} 
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-cyan-500/30 transition-all group"
                    >
                        {editingItem?._id === item._id ? (
                            // Giao diện khi Sửa
                            <form onSubmit={handleUpdate} className="flex-grow flex gap-3 items-center">
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="flex-grow bg-gray-700/50 border-2 border-gray-600 p-2 rounded-lg text-white outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                                    autoFocus
                                />
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 hover:border-green-500/70 rounded-lg text-green-400 hover:text-green-300 font-medium transition-all"
                                >
                                    Lưu
                                </button>
                                <button 
                                    type="button" 
                                    onClick={cancelEdit} 
                                    className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg text-gray-400 hover:text-white transition-all"
                                >
                                    Hủy
                                </button>
                            </form>
                        ) : (
                            // Giao diện khi xem
                            <>
                                <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">{item.name}</span>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => startEdit(item)} 
                                        className="p-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 rounded-lg text-yellow-400 hover:text-yellow-300 transition-all" 
                                        title="Sửa"
                                    >
                                        <FaEdit size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item._id, item.name)} 
                                        className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-all" 
                                        title="Xóa"
                                    >
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )) : (
                    <div className="text-center py-8 bg-gray-800/30 rounded-lg">
                        <p className="text-gray-500">Chưa có dữ liệu.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryManager;