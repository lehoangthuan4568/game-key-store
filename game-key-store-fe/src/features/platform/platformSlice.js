// src/features/platform/platformSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const fetchPlatforms = createAsyncThunk('platforms/fetchAll', async () => {
    const response = await api.get('/platforms');
    return response.data.data.platforms;
});

const initialState = {
    items: [],
    status: 'idle',
};

const platformSlice = createSlice({
    name: 'platforms',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlatforms.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchPlatforms.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchPlatforms.rejected, (state) => { state.status = 'failed'; });
    }
});

export default platformSlice.reducer;