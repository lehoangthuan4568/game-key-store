import { configureStore } from '@reduxjs/toolkit';

// User Slices
import userReducer from '../features/user/userSlice';
import myOrdersReducer from '../features/user/orderSlice';
import wishlistReducer from '../features/user/wishlistSlice'; // Đảm bảo dòng này đúng

// Cart & Checkout Slices
import cartReducer from '../features/cart/cartSlice';
import checkoutReducer from '../features/checkout/checkoutSlice';
import adminCategoriesReducer from '../features/admin/categorySlice'; // <-- IMPORT MỚI
import genreReducer from '../features/genre/genreSlice'; // <-- IMPORT MỚI

// General Slices
import productReducer from '../features/product/productSlice';
import platformReducer from '../features/platform/platformSlice';
import uiReducer from '../features/ui/uiSlice';

// Admin Slices
import dashboardReducer from '../features/admin/dashboardSlice';
import adminOrdersReducer from '../features/admin/orderSlice';
import adminUsersReducer from '../features/admin/userManagementSlice';
import adminInventoryReducer from '../features/admin/inventorySlice';
import reportReducer from '../features/admin/reportSlice';

export const store = configureStore({
    reducer: {
        // User
        user: userReducer,
        myOrders: myOrdersReducer,
        wishlist: wishlistReducer, // VÀ ĐƯỢC THÊM VÀO ĐÂY

        // Cart & Checkout
        cart: cartReducer,
        checkout: checkoutReducer,

        // General
        products: productReducer,
        platforms: platformReducer,
        genres: genreReducer, // <-- THÊM MỚI
        ui: uiReducer,

        // Admin
        dashboard: dashboardReducer,
        adminOrders: adminOrdersReducer,
        adminUsers: adminUsersReducer,
        adminInventory: adminInventoryReducer,
        reports: reportReducer,
        adminCategories: adminCategoriesReducer, // <-- THÊM MỚI
    },
    devTools: process.env.NODE_ENV !== 'production',
});