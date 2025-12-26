import axios from 'axios';
// import { store } from '../app/store'; // Không cần import store ở đây nữa

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

// === INTERCEPTOR (ĐÃ SỬA LẠI) ===
api.interceptors.request.use(
    (config) => {
        // ĐỌC TOKEN TRỰC TIẾP TỪ LOCALSTORAGE
        // Vì localStorage được cập nhật ngay lập tức trong thunk
        const token = localStorage.getItem('token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// =============================

export default api;