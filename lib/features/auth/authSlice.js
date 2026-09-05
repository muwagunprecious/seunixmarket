import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuthenticated: false,
    role: 'customer', // 'customer', 'seller', 'admin'
    sellerStatus: 'none', // 'none', 'pending', 'approved', 'rejected'
    sellerNin: '',
    storeInfo: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            const { name, email, role, avatar, storeInfo, sellerNin, sellerStatus } = action.payload;
            state.user = { name, email, avatar: avatar || '' };
            state.isAuthenticated = true;
            state.role = role || 'customer';
            state.sellerStatus = sellerStatus || (role === 'seller' ? 'approved' : 'none');
            state.sellerNin = sellerNin || (storeInfo?.nin || '');
            state.storeInfo = storeInfo || null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.role = 'customer';
            state.sellerStatus = 'none';
            state.sellerNin = '';
            state.storeInfo = null;
        },
        registerSeller: (state, action) => {
            const { name, email, storeName, storeUsername, description, nin, contact, address } = action.payload;
            state.user = { name, email, avatar: '' };
            state.isAuthenticated = true;
            state.role = 'seller';
            state.sellerStatus = 'pending';
            state.sellerNin = nin;
            state.storeInfo = {
                name: storeName,
                username: storeUsername,
                description,
                nin,
                contact,
                email,
                address,
                status: 'pending'
            };
        },
        updateSellerStatus: (state, action) => {
            state.sellerStatus = action.payload;
            if (state.storeInfo) {
                state.storeInfo.status = action.payload;
            }
        }
    }
});

export const { login, logout, registerSeller, updateSellerStatus } = authSlice.actions;
export default authSlice.reducer;
