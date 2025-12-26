// src/features/genre/genreSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// Thunk public để lấy tất cả genres
export const fetchGenres = createAsyncThunk('genres/fetchAll', async () => {
    const response = await api.get('/genres');
    return response.data.data.genres;
});

const initialState = {
    items: [],
    status: 'idle',
};

const genreSlice = createSlice({
    name: 'genres',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGenres.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchGenres.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchGenres.rejected, (state) => { state.status = 'failed'; });
    }
});

export default genreSlice.reducer;