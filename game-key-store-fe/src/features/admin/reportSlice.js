import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRevenueByPeriod, fetchBestSellers } from '../../api/reportApi'; // Đảm bảo đường dẫn này đúng

// Async thunk để lấy báo cáo doanh thu, chấp nhận dateRange
export const getRevenueReport = createAsyncThunk(
    'reports/fetchRevenue',
    async (dateRange, { rejectWithValue }) => {
        try {
            return await fetchRevenueByPeriod(dateRange);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch revenue report');
        }
    }
);

// Async thunk để lấy top sản phẩm bán chạy, chấp nhận { year, month }
export const getBestSellersReport = createAsyncThunk(
    'reports/fetchBestSellers',
    async ({ year, month }, { rejectWithValue }) => {
        try {
            return await fetchBestSellers({ year, month });
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch best sellers report');
        }
    }
);

// State ban đầu
const initialState = {
    revenueByPeriod: {
        data: [],
        status: 'idle',
        error: null,
    },
    bestSellers: {
        data: [],
        status: 'idle',
        error: null,
    },
    // State cho bộ lọc doanh thu
    dateRange: {
        startDate: null,
        endDate: null,
    },
    // State cho bộ lọc sản phẩm bán chạy
    bestSellersDate: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1 // Tháng (1-12)
    },
};

// Tạo slice
const reportSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        // Action để cập nhật khoảng ngày cho báo cáo doanh thu
        setDateRange: (state, action) => {
            state.dateRange = action.payload; // payload: { startDate, endDate }
            state.revenueByPeriod.status = 'idle'; // Reset status để fetch lại
            state.revenueByPeriod.error = null;
        },
        // Action để cập nhật ngày tháng cho báo cáo sản phẩm bán chạy
        setBestSellersDate: (state, action) => {
            state.bestSellersDate = action.payload; // payload: { year, month }
            state.bestSellers.status = 'idle'; // Reset status để fetch lại
            state.bestSellers.error = null;
        },
        // Action (tùy chọn) để reset state
        resetReports: (state) => {
            state.revenueByPeriod = initialState.revenueByPeriod;
            state.bestSellers = initialState.bestSellers;
            state.dateRange = initialState.dateRange;
            state.bestSellersDate = initialState.bestSellersDate;
        }
    },
    // Xử lý các thunk bất đồng bộ
    extraReducers: (builder) => {
        // Helper
        const handleThunk = (thunk, stateKey) => {
            builder
                .addCase(thunk.pending, (state) => {
                    state[stateKey].status = 'loading';
                    state[stateKey].error = null;
                })
                .addCase(thunk.fulfilled, (state, action) => {
                    state[stateKey].status = 'succeeded';
                    state[stateKey].data = action.payload;
                })
                .addCase(thunk.rejected, (state, action) => {
                    state[stateKey].status = 'failed';
                    state[stateKey].error = action.payload;
                });
        };

        // Áp dụng cho cả 2 thunk
        handleThunk(getRevenueReport, 'revenueByPeriod');
        handleThunk(getBestSellersReport, 'bestSellers');
    }
});

// Export các actions
export const { setDateRange, setBestSellersDate, resetReports } = reportSlice.actions;

// Export các selectors
export const selectRevenueReport = (state) => state.reports.revenueByPeriod;
export const selectBestSellersReport = (state) => state.reports.bestSellers;
export const selectReportDateRange = (state) => state.reports.dateRange;
export const selectBestSellersDate = (state) => state.reports.bestSellersDate;

// Export reducer
export default reportSlice.reducer;