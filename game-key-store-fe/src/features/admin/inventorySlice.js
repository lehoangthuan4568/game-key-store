// src/features/admin/inventorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getInventoryForProduct, addSingleKey, addKeysBulk, deleteInventoryKey } from '../../api/adminApi';
import api from '../../api/api';

// Async thunk to fetch inventory for a specific product
export const fetchInventory = createAsyncThunk(
    'inventory/fetch',
    async ({ productId, params }, { rejectWithValue }) => { // params will include { page, limit }
        try {
            // Fetch inventory keys and full product details concurrently
            const [inventoryRes, productRes] = await Promise.all([
                getInventoryForProduct(productId, params), // Pass pagination params
                api.get(`/products/id/${productId}`) // Fetch product details (like name, platforms)
            ]);
            // Return a combined payload
            return { ...inventoryRes, product: productRes.data.data.product, currentPage: params.page || 1 };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory');
        }
    }
);

// Async thunk to add a single key
export const addKey = createAsyncThunk(
    'inventory/addKey',
    async (keyData, { dispatch, getState, rejectWithValue }) => {
        try {
            await addSingleKey(keyData);
            // Refetch the current page of inventory to show the new key
            const { productId, page } = getState().adminInventory;
            // Dispatch fetchInventory with current page and limit
            dispatch(fetchInventory({ productId, params: { page, limit: 20 } }));
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add key');
        }
    }
);

// Async thunk to add keys in bulk from a file
export const addBulk = createAsyncThunk(
    'inventory/addBulk',
    async (formData, { dispatch, getState, rejectWithValue }) => {
        try {
            const res = await addKeysBulk(formData);
            // Refetch the current page of inventory
            const { productId, page } = getState().adminInventory;
            dispatch(fetchInventory({ productId, params: { page, limit: 20 } }));
            return res.message; // Return success message from backend
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add bulk keys');
        }
    }
);

// Async thunk to delete a key
export const deleteKey = createAsyncThunk(
    'inventory/deleteKey',
    async (keyId, { dispatch, getState, rejectWithValue }) => {
        try {
            await deleteInventoryKey(keyId);
            // Refetch the current page of inventory
            const { productId, page } = getState().adminInventory;
            dispatch(fetchInventory({ productId, params: { page, limit: 20 } }));
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete key');
        }
    }
);

// Initial state for the slice
const initialState = {
    keys: [],
    product: null,
    productId: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    page: 1, // Current page for pagination
    totalPages: 1, // Total pages for pagination
    error: null,
};

// Create the slice
const inventorySlice = createSlice({
    name: 'adminInventory',
    initialState,
    reducers: {
        // Action to set the current page from the Pagination component
        setInventoryPage: (state, action) => {
            state.page = action.payload;
            // Don't reset status here, let the component's useEffect handle the fetch
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchInventory lifecycle
            .addCase(fetchInventory.pending, (state) => {
                state.status = 'loading';
                state.error = null; // Clear previous errors
            })
            .addCase(fetchInventory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.keys = action.payload.data.keys;
                state.totalPages = action.payload.totalPages || 1;
                state.product = action.payload.product;
                state.productId = action.payload.product._id;
                state.page = action.payload.currentPage || 1; // Update page from response
            })
            .addCase(fetchInventory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Handle pending/rejected for mutation thunks (for loading feedback)
            .addCase(addKey.pending, (state) => { state.status = 'loading'; })
            .addCase(addKey.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
            .addCase(addBulk.pending, (state) => { state.status = 'loading'; })
            .addCase(addBulk.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
            .addCase(deleteKey.pending, (state) => { state.status = 'loading'; })
            .addCase(deleteKey.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

            // Fulfilled cases for mutations are handled by the automatic refetch (fetchInventory)
            // so we just need to ensure status is reset from 'loading' if needed
            .addCase(addKey.fulfilled, (state) => { /* status will be set by fetchInventory.pending */ })
            .addCase(addBulk.fulfilled, (state) => { /* status will be set by fetchInventory.pending */ })
            .addCase(deleteKey.fulfilled, (state) => { /* status will be set by fetchInventory.pending */ });
    },
});

// Export the sync action
export const { setInventoryPage } = inventorySlice.actions;

// Export the reducer as default
export default inventorySlice.reducer;