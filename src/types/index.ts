export type ThemeMode = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  avatar?: string;
}

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  sidebarColor: string;
  fontFamily: string;
  compactMode: boolean;
}
