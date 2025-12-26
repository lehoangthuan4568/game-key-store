import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

// --- Hàm tiện ích để đọc/ghi localStorage ---
const loadCartFromLocalStorage = () => {
    try {
        const serializedCart = localStorage.getItem('cartItems');
        if (serializedCart === null) {
            return []; // Trả về mảng rỗng nếu không có gì
        }
        return JSON.parse(serializedCart);
    } catch (err) {
        console.error("Could not load cart from local storage", err);
        return []; // Trả về mảng rỗng nếu lỗi
    }
};

const saveCartToLocalStorage = (items) => {
    try {
        const serializedCart = JSON.stringify(items);
        localStorage.setItem('cartItems', serializedCart);
    } catch (err) {
        console.error("Could not save cart to local storage", err);
    }
};
// ------------------------------------------

// Đọc trạng thái ban đầu từ localStorage
const initialState = {
    items: loadCartFromLocalStorage(),
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const newItem = action.payload;
            const existingItemIndex = state.items.findIndex( // Dùng findIndex để dễ cập nhật
                (item) => item.product._id === newItem.product._id && item.platform._id === newItem.platform._id
            );

            if (existingItemIndex !== -1) {
                // Cập nhật số lượng item đã có
                const updatedItem = {
                    ...state.items[existingItemIndex],
                    quantity: state.items[existingItemIndex].quantity + newItem.quantity
                };
                // Kiểm tra lại tồn kho khi cộng dồn
                const stockForPlatform = newItem.product.stockByPlatform?.[newItem.platform._id] ?? 0;
                if (updatedItem.quantity > stockForPlatform) {
                    toast.error(`Chỉ còn ${stockForPlatform} key cho nền tảng ${newItem.platform.name}. Không thể thêm.`);
                    // Không thay đổi state nếu vượt quá
                } else {
                    state.items[existingItemIndex] = updatedItem;
                    toast.success(`Đã cập nhật số lượng trong giỏ hàng!`);
                    saveCartToLocalStorage(state.items); // Lưu lại
                }

            } else {
                // Thêm item mới
                const stockForPlatform = newItem.product.stockByPlatform?.[newItem.platform._id] ?? 0;
                if (newItem.quantity > stockForPlatform) {
                    toast.error(`Chỉ còn ${stockForPlatform} key cho nền tảng ${newItem.platform.name}. Không thể thêm.`);
                    // Không thêm vào giỏ nếu số lượng yêu cầu > tồn kho
                } else {
                    state.items.push(newItem);
                    toast.success(`${newItem.product.name} đã được thêm vào giỏ hàng!`);
                    saveCartToLocalStorage(state.items); // Lưu lại
                }
            }
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(
                (item) => !(item.product._id === action.payload.productId && item.platform._id === action.payload.platformId)
            );
            saveCartToLocalStorage(state.items); // Lưu lại
        },
        updateQuantity: (state, action) => {
            const itemIndex = state.items.findIndex(
                (item) => item.product._id === action.payload.productId && item.platform._id === action.payload.platformId
            );
            if (itemIndex !== -1) {
                // Kiểm tra tồn kho trước khi cập nhật (mặc dù đã check ở component)
                const stockForPlatform = state.items[itemIndex].product.stockByPlatform?.[action.payload.platformId] ?? 0;
                const newQuantity = Math.max(1, Math.min(action.payload.quantity, stockForPlatform)); // Đảm bảo >= 1 và <= tồn kho
                state.items[itemIndex].quantity = newQuantity;
                saveCartToLocalStorage(state.items); // Lưu lại
            }
        },
        clearCart: (state) => {
            state.items = [];
            saveCartToLocalStorage(state.items); // Lưu lại (giỏ hàng rỗng)
        },
    },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.items.reduce((total, item) => total + (item.product.salePrice || item.product.price) * item.quantity, 0);

export default cartSlice.reducer;