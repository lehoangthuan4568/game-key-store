// src/features/admin/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllOrders } from '../../api/adminApi';

export const fetchOrdersAdmin = createAsyncThunk('adminOrders/fetchAll', async (params, { rejectWithValue }) => {
    try {
        const data = await getAllOrders(params);
        return data; // API trả về { totalPages, data: { orders } }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

const initialState = {
    orders: [],
    status: 'idle',
    page: 1,
    totalPages: 1,
    error: null,
};

const orderSlice = createSlice({
    name: 'adminOrders',
    initialState,
    reducers: {
        setAdminOrdersPage: (state, action) => {
            state.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrdersAdmin.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrdersAdmin.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload.data.orders;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchOrdersAdmin.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { setAdminOrdersPage } = orderSlice.actions;
export default orderSlice.reducer;