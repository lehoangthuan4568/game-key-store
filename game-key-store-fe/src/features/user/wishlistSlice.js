// src/features/user/wishlistSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWishlist, addProductToWishlist, removeProductFromWishlist } from '../../api/userApi';

// Thunks
export const getWishlist = createAsyncThunk('wishlist/get', async () => {
    return await fetchWishlist(); // Trả về mảng product objects
});

export const addToWishlist = createAsyncThunk('wishlist/add', async (productId) => {
    return await addProductToWishlist(productId); // Trả về mảng product IDs
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (productId) => {
    return await removeProductFromWishlist(productId); // Trả về mảng product IDs
});

const initialState = {
    items: [], // Mảng chứa product objects đầy đủ
    itemIds: [], // Mảng chỉ chứa ID để kiểm tra nhanh
    status: 'idle',
    error: null,
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlistOnLogout: (state) => {
            state.items = [];
            state.itemIds = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Wishlist
            .addCase(getWishlist.pending, (state) => { state.status = 'loading'; })
            .addCase(getWishlist.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload; // Lưu mảng product objects
                state.itemIds = action.payload.map(item => item._id); // Lưu mảng IDs
            })
            .addCase(getWishlist.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

            // Add/Remove (chỉ cập nhật mảng IDs, getWishlist sẽ fetch lại data đầy đủ nếu cần)
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.itemIds = action.payload; // Cập nhật mảng IDs
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.itemIds = action.payload; // Cập nhật mảng IDs
            });
            // Không cần xử lý pending/rejected cho add/remove nếu không muốn hiển thị loading
    }
});

export const { clearWishlistOnLogout } = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistIds = (state) => state.wishlist.itemIds;
export const selectWishlistStatus = (state) => state.wishlist.status;

export default wishlistSlice.reducer;