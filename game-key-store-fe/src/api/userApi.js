// JavaScript source code
import api from './api';

export const getMyOrders = async (params) => {
    // params có thể chứa { page, limit }
    const response = await api.get('/orders/my-orders', { params });
    return response.data; // API trả về { totalPages, data: { orders } }
};
export const updateMyPassword = async (passwordData) => { // { currentPassword, newPassword }
    const response = await api.patch('/auth/update-my-password', passwordData);
    // API backend trả về user và token mới sau khi đổi mk thành công
    return response.data;
};
export const fetchWishlist = async () => {
    const response = await api.get('/users/wishlist');
    return response.data.data.wishlist; // Trả về mảng sản phẩm
};

export const addProductToWishlist = async (productId) => {
    const response = await api.post(`/users/wishlist/${productId}`);
    return response.data.data.wishlist; // Trả về mảng ID mới
};

export const removeProductFromWishlist = async (productId) => {
    const response = await api.delete(`/users/wishlist/${productId}`);
    return response.data.data.wishlist; // Trả về mảng ID mới
};
export const getMe = async (token = null) => {
    let config = {};

    // Nếu gọi hàm này kèm token (từ Google callback),
    // hãy dùng token đó để gọi API
    if (token) {
        config.headers = {
            Authorization: `Bearer ${token}`
        };
    }
    // Nếu gọi hàm không có token, nó sẽ tự động dùng interceptor (để load lại trang F5)

    const response = await api.get('/users/me', config);
    return response.data.data.user; // Trả về object user
};