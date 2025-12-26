import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// --- Async Thunks ---
export const fetchFeaturedProducts = createAsyncThunk('products/fetchFeatured', async () => {
  const response = await api.get('/products?isFeatured=true&limit=5');
  return response.data.data.products;
});

export const fetchNewProducts = createAsyncThunk('products/fetchNew', async () => {
    const response = await api.get('/products?isNew=true&limit=8');
    return response.data.data.products;
});

export const fetchHotProducts = createAsyncThunk('products/fetchHot', async () => {
    const response = await api.get('/products?isHot=true&limit=8');
    return response.data.data.products;
});

export const fetchSaleProducts = createAsyncThunk('products/fetchSale', async () => {
    const response = await api.get('/products?sale=true&limit=8');
    return response.data.data.products;
});

export const fetchProductBySlug = createAsyncThunk('products/fetchBySlug', async (slug, { rejectWithValue }) => {
    try {
        const response = await api.get(`/products/${slug}`);
        return response.data.data.product;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const fetchRelatedProducts = createAsyncThunk('products/fetchRelated', async (productId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/products/${productId}/related`);
        return response.data.data.products;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const fetchAllProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
    try {
        const response = await api.get('/products', { params });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

// Admin Thunks
export const createProduct = createAsyncThunk('products/create', async (productData, { rejectWithValue }) => {
    try {
        const response = await api.post('/products', productData);
        return response.data.data.product;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, productData }, { rejectWithValue }) => {
    try {
        const response = await api.patch(`/products/${id}`, productData);
        return response.data.data.product;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/products/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

// --- Slice Definition ---
const initialState = {
  featured: { data: [], status: 'idle' },
  newProducts: { data: [], status: 'idle' },
  hotProducts: { data: [], status: 'idle' },
  saleProducts: { data: [], status: 'idle' },
  currentProduct: { data: null, status: 'idle' },
  relatedProducts: { data: [], status: 'idle' },

  allProducts: {
      data: [],
      status: 'idle',
      page: 1,
      totalPages: 1,
  },
  filters: { // All possible filters managed by this slice
      sort: '-createdAt',
      'price[gte]': '',
      'price[lte]': '',
      platforms: [], // <-- Sửa 'platform' thành 'platforms' nếu bạn đặt tên cũ
      genres: [], // <-- THÊM MỚI
      sale: '',
      isNew: '',
      isHot: '',
      search: '', // Search filter added here
  },
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Action to update filters and reset page
    setFilters: (state, action) => {
        // Merge new filters with existing ones
        state.filters = { ...state.filters, ...action.payload };
        // Reset to page 1 whenever filters change
        state.allProducts.page = 1;
    },
    // Action to set the current page for allProducts
    setPage: (state, action) => {
        state.allProducts.page = action.payload;
    },
    // Action to clear the current product detail when leaving the page
    clearCurrentProduct: (state) => {
        state.currentProduct = { data: null, status: 'idle' };
        state.relatedProducts = { data: [], status: 'idle' };
    }
  },
  extraReducers: (builder) => {
    // Helper for homepage sections and product detail
    const addCasesForSections = (thunk, stateKey) => {
        builder
            .addCase(thunk.pending, (state) => { state[stateKey].status = 'loading'; })
            .addCase(thunk.fulfilled, (state, action) => {
                state[stateKey].status = 'succeeded';
                state[stateKey].data = action.payload; // Assumes payload is the data array/object
            })
            .addCase(thunk.rejected, (state, action) => {
                state[stateKey].status = 'failed';
                // Use action.error.message for createAsyncThunk errors if rejectWithValue isn't used
                // If rejectWithValue is used, the error is in action.payload
                state.error = action.payload || action.error.message;
            });
    };

    // Apply helper to relevant thunks
    addCasesForSections(fetchFeaturedProducts, 'featured');
    addCasesForSections(fetchNewProducts, 'newProducts');
    addCasesForSections(fetchHotProducts, 'hotProducts');
    addCasesForSections(fetchSaleProducts, 'saleProducts');
    addCasesForSections(fetchProductBySlug, 'currentProduct');
    addCasesForSections(fetchRelatedProducts, 'relatedProducts');

    // Handle fetchAllProducts lifecycle
    builder
        .addCase(fetchAllProducts.pending, (state) => {
            state.allProducts.status = 'loading';
        })
        .addCase(fetchAllProducts.fulfilled, (state, action) => {
            state.allProducts.status = 'succeeded';
            state.allProducts.data = action.payload.data.products;
            state.allProducts.totalPages = action.payload.totalPages;
            // Optionally update current page from response if backend sends it
            // state.allProducts.page = action.payload.currentPage;
        })
        .addCase(fetchAllProducts.rejected, (state, action) => {
            state.allProducts.status = 'failed';
            state.error = action.payload;
        })
        // Handle deleteProduct success (optimistic update in list)
        .addCase(deleteProduct.fulfilled, (state, action) => {
            state.allProducts.data = state.allProducts.data.filter(p => p._id !== action.payload);
            // Consider also updating status or adding specific delete status
        })
        // Handle potential errors for admin actions (optional, depends on UI needs)
        .addCase(createProduct.rejected, (state, action) => { state.error = action.payload; })
        .addCase(updateProduct.rejected, (state, action) => { state.error = action.payload; })
        .addCase(deleteProduct.rejected, (state, action) => { state.error = action.payload; });

  },
});

// Export actions and reducer
export const { setFilters, setPage, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;