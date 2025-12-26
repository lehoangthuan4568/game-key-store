// src/features/admin/userManagementSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Make sure the path to adminApi is correct
import { getAllUsers, deleteUserById, updateUserRoleById } from '../../api/adminApi';

// Thunk to fetch all users (with pagination and search)
export const fetchUsersAdmin = createAsyncThunk(
    'adminUsers/fetchAll',
    async (params, { rejectWithValue }) => {
        // params = { page, limit, search }
        try {
            const data = await getAllUsers(params);
            return data; // Returns { totalPages, data: { users } }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

// Thunk to delete a user
export const deleteUser = createAsyncThunk(
    'adminUsers/delete',
    async (userId, { rejectWithValue }) => {
        try {
            // API call returns the ID of the deleted user on success
            const deletedUserId = await deleteUserById(userId);
            return deletedUserId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
        }
    }
);

// Thunk to update a user's role
export const updateUserRole = createAsyncThunk(
    'adminUsers/updateRole',
    async ({ userId, role }, { rejectWithValue }) => {
        try {
            // API call returns the updated user object
            const updatedUser = await updateUserRoleById(userId, role);
            return updatedUser;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update role');
        }
    }
);

// Initial state for the slice
const initialState = {
    users: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    page: 1,
    totalPages: 1,
    searchQuery: '', // State for the search query
    error: null,
};

// Create the slice
const userManagementSlice = createSlice({
    name: 'adminUsers',
    initialState,
    reducers: {
        // Action to set the current page
        setAdminUsersPage: (state, action) => {
            state.page = action.payload;
            state.status = 'idle'; // Reset status to trigger refetch
        },
        // Action to set the search query
        setAdminUsersSearch: (state, action) => {
            state.searchQuery = action.payload;
            state.page = 1; // Reset to page 1 when starting a new search
            state.status = 'idle'; // Reset status to trigger refetch
        },
    },
    // Handle async thunk lifecycles
    extraReducers: (builder) => {
        builder
            // fetchUsersAdmin
            .addCase(fetchUsersAdmin.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUsersAdmin.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload.data.users;
                state.totalPages = action.payload.totalPages;
                state.page = action.payload.currentPage || state.page; // Update page from response if available
            })
            .addCase(fetchUsersAdmin.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // deleteUser
            .addCase(deleteUser.pending, (state) => {
                // Optionally mark state as 'loading' or handle UI feedback in component
                state.status = 'loading';
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                // Optimistically remove the user from the state
                state.users = state.users.filter(user => user._id !== action.payload);
                state.status = 'succeeded'; // Reset status
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload; // Store the error message
                // (Handled by toast in component)
            })

            // updateUserRole
            .addCase(updateUserRole.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                // Optimistically update the user in the state
                const index = state.users.findIndex(user => user._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                state.status = 'succeeded'; // Reset status
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload; // Store the error message
                // (Handled by toast in component)
            });
    }
});

// Export sync actions
export const { setAdminUsersPage, setAdminUsersSearch } = userManagementSlice.actions;

// Export selectors (optional but good practice)
export const selectAdminUsers = (state) => state.adminUsers.users;
export const selectAdminUsersStatus = (state) => state.adminUsers.status;
export const selectAdminUsersError = (state) => state.adminUsers.error;
export const selectAdminUsersPagination = (state) => ({
    page: state.adminUsers.page,
    totalPages: state.adminUsers.totalPages,
    searchQuery: state.adminUsers.searchQuery,
});

// Export the reducer as default
export default userManagementSlice.reducer;