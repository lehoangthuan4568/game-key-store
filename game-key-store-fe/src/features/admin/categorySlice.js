// src/features/admin/categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import { fetchPlatforms as fetchPlatformsPublic } from '../platform/platformSlice'; // Import action public
import { fetchGenres as fetchGenresPublic } from '../genre/genreSlice'; // Import action public (sẽ tạo ở bước 2)

// Thunks cho Platforms
export const createPlatform = createAsyncThunk('category/createPlatform', async (data) => {
    const response = await api.post('/platforms', data);
    return response.data.data.platform;
});
export const updatePlatform = createAsyncThunk('category/updatePlatform', async ({ id, data }) => {
    const response = await api.patch(`/platforms/${id}`, data);
    return response.data.data.platform;
});
export const deletePlatform = createAsyncThunk('category/deletePlatform', async (id) => {
    await api.delete(`/platforms/${id}`);
    return id;
});

// Thunks cho Genres
export const createGenre = createAsyncThunk('category/createGenre', async (data) => {
    const response = await api.post('/genres', data);
    return response.data.data.genre;
});
export const updateGenre = createAsyncThunk('category/updateGenre', async ({ id, data }) => {
    const response = await api.patch(`/genres/${id}`, data);
    return response.data.data.genre;
});
export const deleteGenre = createAsyncThunk('category/deleteGenre', async (id) => {
    await api.delete(`/genres/${id}`);
    return id;
});

const initialState = {
    platforms: [],
    genres: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const categorySlice = createSlice({
    name: 'adminCategories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Lắng nghe action fetch public để điền dữ liệu
        builder
            .addCase(fetchPlatformsPublic.fulfilled, (state, action) => {
                state.platforms = action.payload;
            })
            .addCase(fetchGenresPublic.fulfilled, (state, action) => {
                state.genres = action.payload;
            })
            // Create
            .addCase(createPlatform.fulfilled, (state, action) => {
                state.platforms.push(action.payload);
            })
            .addCase(createGenre.fulfilled, (state, action) => {
                state.genres.push(action.payload);
            })
            // Update
            .addCase(updatePlatform.fulfilled, (state, action) => {
                const index = state.platforms.findIndex(p => p._id === action.payload._id);
                if (index !== -1) state.platforms[index] = action.payload;
            })
            .addCase(updateGenre.fulfilled, (state, action) => {
                const index = state.genres.findIndex(g => g._id === action.payload._id);
                if (index !== -1) state.genres[index] = action.payload;
            })
            // Delete
            .addCase(deletePlatform.fulfilled, (state, action) => {
                state.platforms = state.platforms.filter(p => p._id !== action.payload);
            })
            .addCase(deleteGenre.fulfilled, (state, action) => {
                state.genres = state.genres.filter(g => g._id !== action.payload);
            });
    }
});

export default categorySlice.reducer;