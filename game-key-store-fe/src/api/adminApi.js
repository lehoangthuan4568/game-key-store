// src/api/adminApi.js
import api from './api';

export const getAllOrders = async (params) => {
    // params có thể chứa { page, limit }
    const response = await api.get('/orders', { params });
    return response.data;
};
export const getAllUsers = async (params) => { // params = { page, search }
    const response = await api.get('/admin/users', { params });
    return response.data;
};
export const getInventoryForProduct = async (productId, params) => {
    const response = await api.get(`/inventory/${productId}`, { params });
    return response.data;
};
export const deleteUserById = async (userId) => {
    await api.delete(`/admin/users/${userId}`);
    return userId; // Trả về ID để xóa khỏi state
};
export const updateUserRoleById = async (userId, role) => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data.data.user; // Trả về user đã cập nhật
};

export const addSingleKey = async (keyData) => {
    const response = await api.post('/inventory', keyData);
    return response.data;
};

export const addKeysBulk = async (formData) => {
    const response = await api.post('/inventory/bulk', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteInventoryKey = async (keyId) => {
    const response = await api.delete(`/inventory/${keyId}`);
    return response.data;
};

// Upload single image
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload/single', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Upload multiple images
export const uploadImages = async (files) => {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('images', file);
    });
    const response = await api.post('/upload/multiple', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};