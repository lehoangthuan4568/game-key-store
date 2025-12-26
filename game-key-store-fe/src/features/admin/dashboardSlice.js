// src/features/admin/dashboardSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../api/api';



export const fetchDashboardStats = createAsyncThunk('dashboard/fetchStats', async (_, { rejectWithValue }) => {

    try {

        const response = await api.get('/stats');

        return response.data.data;

    } catch (error) {

        return rejectWithValue(error.response?.data?.message);

    }

});



const initialState = {

    stats: {},

    recentOrders: [],

    status: 'idle', // idle | loading | succeeded | failed

    error: null,

};



const dashboardSlice = createSlice({

    name: 'dashboard',

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

            .addCase(fetchDashboardStats.pending, (state) => {

                state.status = 'loading';

            })

            .addCase(fetchDashboardStats.fulfilled, (state, action) => {

                state.status = 'succeeded';

                state.stats = {

                    totalUsers: action.payload.totalUsers,

                    totalProducts: action.payload.totalProducts,

                    totalOrders: action.payload.totalOrders,

                    totalRevenue: action.payload.totalRevenue,

                };

                state.recentOrders = action.payload.recentOrders;

            })

            .addCase(fetchDashboardStats.rejected, (state, action) => {

                state.status = 'failed';

                state.error = action.payload;

            });

    }

});



export default dashboardSlice.reducer;