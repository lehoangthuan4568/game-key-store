// src/api/orderApi.js
import api from './api';

// Hàm này để tạo đơn hàng (cho thanh toán giả lập - có thể giữ lại hoặc xóa đi)
export const placeOrder = async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
};

// === HÀM MỚI CHO VNPAY ===
export const createVnpayUrl = async (orderData) => {
    // orderData = { cartItems: [...], paymentMethod: 'vnpay' }
    const response = await api.post('/payment/create_vnpay_url', orderData);
    return response.data; // Trả về { status: 'success', data: { vnpayUrl } }
};
// ==========================