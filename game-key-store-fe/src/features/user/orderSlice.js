import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyOrders } from '../../api/userApi'; // Đảm bảo đường dẫn đúng

export const fetchMyOrders = createAsyncThunk('myOrders/fetch', async (params, { rejectWithValue }) => {
    try {
        const data = await getMyOrders(params);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

const initialState = {
    orders: [],
    status: 'idle', // idle | loading | succeeded | failed
    page: 1,
    totalPages: 1,
    error: null,
};

const myOrderSlice = createSlice({
    name: 'myOrders',
    initialState,
    reducers: {
        setMyOrdersPage: (state, action) => {
            state.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyOrders.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload.data.orders;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { setMyOrdersPage } = myOrderSlice.actions;
export default myOrderSlice.reducer;