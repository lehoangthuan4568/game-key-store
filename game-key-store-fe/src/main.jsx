import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { router } from './routes/AppRoutes';
import { rehydrateAuth } from './features/user/userSlice'; // Import action mới
import { getWishlist } from './features/user/wishlistSlice'; // Import
import './index.css';

// === LOGIC KHÔI PHỤC ĐĂNG NHẬP ===
// Chạy trước khi render ứng dụng
try {
  const userString = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  if (userString && token) {
    const user = JSON.parse(userString);
    store.dispatch(rehydrateAuth({ user, token }));
    // === FETCH WISHLIST NẾU ĐÃ ĐĂNG NHẬP ===
    store.dispatch(getWishlist());
    // ===================================
  }
} catch (error) {
    console.error("Failed to rehydrate auth state:", error);
    // Có thể xóa localStorage nếu dữ liệu bị hỏng
    localStorage.removeItem('user');
    localStorage.removeItem('token');
}
// ================================


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>,
);