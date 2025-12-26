// src/pages/AuthCallbackPage.jsx
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchUserByToken } from '../features/user/userSlice';
import { getWishlist } from '../features/user/wishlistSlice'; // Import getWishlist
import { toast } from 'react-hot-toast';

// Component spinner loading (tùy chọn, bạn có thể thay bằng chữ)
const LoadingSpinner = () => (
    <div className="border-4 border-gray-600 border-t-cyan-500 rounded-full w-12 h-12 animate-spin"></div>
);

const AuthCallbackPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            // Nếu có lỗi từ URL (vd: Google auth thất bại)
            toast.error(`Đăng nhập thất bại: ${error}`);
            navigate('/login');
        } else if (token) {
            // Nếu có token
            toast.promise(
                dispatch(fetchUserByToken(token)).unwrap(), // Gọi thunk mới
                {
                    loading: 'Đang xác thực...',
                    success: (result) => {
                        // Sau khi fetchUserByToken thành công, gọi luôn getWishlist
                        dispatch(getWishlist());
                        return `Chào mừng, ${result.user.name}!`;
                    },
                    error: (err) => `Đăng nhập thất bại: ${err}`
                }
            ).then(() => {
                navigate('/'); // Chuyển về trang chủ
            }).catch(() => {
                navigate('/login'); // Chuyển về trang login nếu lỗi
            });
        } else {
            // Nếu vào trang này mà không có token hoặc error
            toast.error('Đường dẫn không hợp lệ.');
            navigate('/login');
        }
    }, [dispatch, navigate, searchParams]);

    // Hiển thị loading trong khi xử lý
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white gap-4">
            <LoadingSpinner />
            <p className="text-xl text-gray-400">Đang xử lý đăng nhập, vui lòng chờ...</p>
        </div>
    );
};

export default AuthCallbackPage;