import api from './api';

export const loginUser = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};
export const resendPinRequest = async (emailData) => { // { email }
    const response = await api.post('/auth/resend-pin', emailData);
    return response.data;
};
export const verifyEmail = async (verificationData) => { // { email, pin }
    const response = await api.post('/auth/verify-email', verificationData);
    return response.data;
};

export const forgotPasswordRequest = async (emailData) => { // { email }
    const response = await api.post('/auth/forgot-password', emailData);
    return response.data;
};

export const verifyPinRequest = async (pinData) => { // { email, pin }
    const response = await api.post('/auth/verify-pin', pinData);
    return response.data;
};

export const resetPasswordRequest = async (resetData) => { // { email, pin, password }
    const response = await api.patch('/auth/reset-password', resetData);
    return response.data;
};

export const updateMyPassword = async (passwordData) => { // { currentPassword, newPassword }
    // API backend cần token xác thực trong header, axios instance đã tự động xử lý
    const response = await api.patch('/auth/update-my-password', passwordData);
    return response.data;
};


export const logoutUser = async () => {
    // Nếu backend có endpoint logout để xóa token phía server, hãy gọi nó ở đây
    // const response = await api.post('/auth/logout');
    // return response.data;
    
    // Hiện tại logout chỉ là client-side
    return Promise.resolve();
};