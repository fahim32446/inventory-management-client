import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILoginData, ILoginResponse } from '../../features/auth/auth.interface';

const initialState: ILoginResponse = {
  success: false,
  message: '',
  data: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<ILoginResponse>) => {
      state.success = action.payload.success;
      state.message = action.payload.message;
      state.data = action.payload.data;
      state.accessToken = action.payload.accessToken;
    },
    setProfileData: (state, action: PayloadAction<ILoginData | null>) => {
      state.data = action.payload;
    },

    logout: (state) => {
      state.success = false;
      state.message = '';
      state.data = null;
      state.accessToken = null;
    },
  },
});

export const { setAuth, logout, setProfileData } = authSlice.actions;
export default authSlice.reducer;
