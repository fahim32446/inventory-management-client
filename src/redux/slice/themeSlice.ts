import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeConfig, ThemeMode } from '../../types';

const defaultTheme: ThemeConfig = {
  mode: 'light',
  primaryColor: '#1677ff',
  sidebarColor: '#0f172a',
  fontFamily: 'Inter, sans-serif',
  compactMode: false,
};

const getInitialTheme = (): ThemeConfig => {
  const saved = localStorage.getItem('app-theme');
  return saved ? JSON.parse(saved) : defaultTheme;
};

const initialState: ThemeConfig = getInitialTheme();

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      localStorage.setItem('app-theme', JSON.stringify(state));
      if (state.mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload;
      localStorage.setItem('app-theme', JSON.stringify(state));
    },
    setSidebarColor: (state, action: PayloadAction<string>) => {
      state.sidebarColor = action.payload;
      localStorage.setItem('app-theme', JSON.stringify(state));
    },
    setFontFamily: (state, action: PayloadAction<string>) => {
      state.fontFamily = action.payload;
      localStorage.setItem('app-theme', JSON.stringify(state));
    },
    setCompactMode: (state, action: PayloadAction<boolean>) => {
      state.compactMode = action.payload;
      localStorage.setItem('app-theme', JSON.stringify(state));
    },
  },
});

export const { setMode, setPrimaryColor, setSidebarColor, setFontFamily, setCompactMode } =
  themeSlice.actions;
export default themeSlice.reducer;
