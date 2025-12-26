import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CategoryManager from '../../components/admin/CategoryManager';
import { fetchPlatforms } from '../../features/platform/platformSlice';
import { fetchGenres } from '../../features/genre/genreSlice';
import {
    createPlatform, updatePlatform, deletePlatform,
    createGenre, updateGenre, deleteGenre
} from '../../features/admin/categorySlice';
import { FaTags, FaGamepad, FaLayerGroup } from 'react-icons/fa';

const AdminManageCategories = () => {
    const dispatch = useDispatch();
    const { platforms } = useSelector(state => state.adminCategories);
    const { genres } = useSelector(state => state.adminCategories);
    const platformStatus = useSelector(state => state.platforms.status);
    const genreStatus = useSelector(state => state.genres.status);

    // Fetch dữ liệu public khi trang tải
    useEffect(() => {
        if (platformStatus === 'idle') {
            dispatch(fetchPlatforms());
        }
        if (genreStatus === 'idle') {
            dispatch(fetchGenres());
        }
    }, [dispatch, platformStatus, genreStatus]);

    return (
        <div className="relative">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/30">
                        <FaTags className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold gaming-title">Quản lý Nền tảng & Thể loại</h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-2"></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <CategoryManager
                    title="Quản lý Nền tảng"
                    items={platforms}
                    createAction={createPlatform}
                    updateAction={updatePlatform}
                    deleteAction={deletePlatform}
                    icon={<FaGamepad className="text-cyan-400" size={24} />}
                />
                <CategoryManager
                    title="Quản lý Thể loại"
                    items={genres}
                    createAction={createGenre}
                    updateAction={updateGenre}
                    deleteAction={deleteGenre}
                    icon={<FaLayerGroup className="text-purple-400" size={24} />}
                />
            </div>
        </div>
    );
};

export default AdminManageCategories;