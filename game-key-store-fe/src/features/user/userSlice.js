import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    loginUser,
    registerUser,
    verifyEmail,
    forgotPasswordRequest,
    verifyPinRequest,
    resetPasswordRequest,
    updateMyPassword as updateMyPasswordApi, // Đổi tên để tránh trùng
    resendPinRequest
} from '../../api/authApi';
import { getMe } from '../../api/userApi'; // Import getMe

// --- Async Thunks ---

// Đăng nhập bằng Email/Password
export const login = createAsyncThunk('user/login', async (credentials, { rejectWithValue }) => {
    try {
        const data = await loginUser(credentials);
        return { user: data.data.user, token: data.token };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
});

// Đăng ký
export const register = createAsyncThunk('user/register', async (userData, { rejectWithValue }) => {
    try {
        const data = await registerUser(userData);
        return data.message;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Đăng ký thất bại');
    }
});

// Xác thực Email
export const verify = createAsyncThunk('user/verify', async (verificationData, { rejectWithValue }) => {
    try {
        const data = await verifyEmail(verificationData);
        return { user: data.data.user, token: data.token };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Xác thực thất bại');
    }
});

// Gửi lại mã PIN
export const resendPin = createAsyncThunk('user/resendPin', async (emailData, { rejectWithValue }) => {
    try {
        const data = await resendPinRequest(emailData);
        return data.message;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Gửi lại PIN thất bại');
    }
});

// --- Luồng Quên Mật khẩu ---
export const forgotPassword = createAsyncThunk('user/forgotPassword', async (emailData, { rejectWithValue }) => {
    try {
        const data = await forgotPasswordRequest(emailData);
        return data.message;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Yêu cầu thất bại');
    }
});

export const verifyResetPin = createAsyncThunk('user/verifyResetPin', async (pinData, { rejectWithValue }) => {
    try {
        const data = await verifyPinRequest(pinData);
        return data.message;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Mã PIN không hợp lệ');
    }
});

export const resetPassword = createAsyncThunk('user/resetPassword', async (resetData, { rejectWithValue }) => {
    try {
        const data = await resetPasswordRequest(resetData);
        return { user: data.data.user, token: data.token };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Đặt lại mật khẩu thất bại');
    }
});

// --- Các chức năng User (đã đăng nhập) ---

// Đổi mật khẩu
export const updatePassword = createAsyncThunk('user/updatePassword', async (passwordData, { rejectWithValue }) => {
    try {
        const data = await updateMyPasswordApi(passwordData);
        return { user: data.data.user, token: data.token };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
});

// Lấy thông tin User bằng Token (Dùng cho Google Callback)
export const fetchUserByToken = createAsyncThunk(
    'user/fetchByToken',
    async (token, { dispatch, rejectWithValue }) => {
        try {
            // 1. Gọi getMe VÀ TRUYỀN TOKEN TRỰC TIẾP
            // (Hàm getMe trong userApi.js đã được sửa để chấp nhận token)
            const user = await getMe(token);

            // 2. Trả về user và token để extraReducer xử lý
            return { user, token };
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return rejectWithValue(error.response?.data?.message || 'Token không hợp lệ');
        }
    }
);

// --- State ban đầu ---
const initialState = {
    user: null,
    isAuthenticated: false,
    token: null,
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
};

// --- Định nghĩa Slice ---
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Đăng xuất: Xóa state và user/token khỏi localStorage
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            // Việc xóa wishlist state sẽ được component (Header) dispatch riêng
        },
        // Khôi phục state từ localStorage khi tải lại trang
        rehydrateAuth: (state, action) => {
            // === MOCK GAMIFICATION DATA ===
            // Inject mock data if not present (simulating backend response)
            const userWithMockData = {
                ...action.payload.user,
                rank: action.payload.user.rank || { name: 'Gold', tier: 3, nextTierXp: 5000, icon: '👑' },
                xp: action.payload.user.xp || 3450,
                points: action.payload.user.points || 1250,
                badges: action.payload.user.badges || ['early_adopter', 'big_spender', 'rpg_fan'],
                stats: {
                    totalSpent: 15000000,
                    gamesOwned: 42,
                    memberSince: '2023-01-15'
                }
            };
            state.user = userWithMockData;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        // Xóa lỗi (để reset thông báo)
        clearAuthError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Xử lý các thunk dẫn đến trạng thái "đã đăng nhập"
        // (login, verify, resetPassword, updatePassword, fetchUserByToken)
        [login, verify, resetPassword, updatePassword, fetchUserByToken].forEach(thunk => {
            builder
                .addCase(thunk.pending, (state) => { state.status = 'loading'; state.error = null; })
                .addCase(thunk.fulfilled, (state, action) => {
                    state.status = 'succeeded';

                    // === MOCK GAMIFICATION DATA ===
                    // Inject mock data if not present (simulating backend response)
                    const userWithMockData = {
                        ...action.payload.user,
                        rank: action.payload.user.rank || { name: 'Gold', tier: 3, nextTierXp: 5000, icon: '👑' },
                        xp: action.payload.user.xp || 3450,
                        points: action.payload.user.points || 1250,
                        badges: action.payload.user.badges || ['early_adopter', 'big_spender', 'rpg_fan'],
                        stats: {
                            totalSpent: 15000000,
                            gamesOwned: 42,
                            memberSince: '2023-01-15'
                        }
                    };

                    state.user = userWithMockData;
                    state.token = action.payload.token;
                    state.isAuthenticated = true;
                    // Đồng bộ localStorage
                    localStorage.setItem('user', JSON.stringify(userWithMockData));
                    localStorage.setItem('token', action.payload.token);
                })
                .addCase(thunk.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });
        });

        // Xử lý các thunk chỉ trả về thông báo thành công (không đăng nhập)
        [register, forgotPassword, verifyResetPin, resendPin].forEach(thunk => {
            builder
                .addCase(thunk.pending, (state) => { state.status = 'loading'; state.error = null; })
                .addCase(thunk.fulfilled, (state) => { state.status = 'succeeded'; })
                .addCase(thunk.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });
        });
    },
});

// Export các actions
export const { logout, rehydrateAuth, clearAuthError } = userSlice.actions;

// --- Selectors ---
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUser = (state) => state.user.user;
export const selectAuthStatus = (state) => state.user.status;
export const selectAuthError = (state) => state.user.error;
export const selectToken = (state) => state.user.token;

// Export reducer
export default userSlice.reducer;