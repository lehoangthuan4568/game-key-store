// src/features/checkout/checkoutSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createVnpayUrl } from '../../api/paymentApi'; // Sửa đường dẫn này
import { clearCart } from '../cart/cartSlice';

// Đổi tên thunk cho rõ ràng
export const processVnpayCheckout = createAsyncThunk(
    'checkout/processVnpay',
    async (orderData, { dispatch, rejectWithValue }) => {
        try {
            // Chỉ còn logic gọi VNPay
            const data = await createVnpayUrl(orderData);
            return data.data.vnpayUrl; // Trả về URL để chuyển hướng
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Xử lý thất bại');
        }
    }
);

const initialState = {
    paymentUrl: null, // Chỉ cần lưu URL
    status: 'idle',
    error: null,
};

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        resetCheckout: (state) => {
            state.paymentUrl = null;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(processVnpayCheckout.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(processVnpayCheckout.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.paymentUrl = action.payload; // Lưu URL
            })
            .addCase(processVnpayCheckout.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { resetCheckout } = checkoutSlice.actions;
export const selectCheckoutStatus = (state) => state.checkout.status;
export const selectCheckoutError = (state) => state.checkout.error;
export const selectPaymentUrl = (state) => state.checkout.paymentUrl;

export default checkoutSlice.reducer;