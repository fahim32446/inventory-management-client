import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type DrawerTypes =
  | {
      title: string | undefined;
      content: React.ReactNode | undefined;
      extra?: React.ReactNode;
      footer?: React.ReactNode;
      placement?: "top" | "right" | "bottom" | "left";
      size?: "default" | "large";
      width?: 378 | 500 | 600 | 700 | 800 | 900 | 1000;
    }
  | undefined;

type DrawerStateType = DrawerTypes & { open: boolean };

const initialState: DrawerStateType = {
  open: false,
  title: undefined,
  content: undefined,
  extra: undefined,
  footer: undefined,
  placement: "right",
  size: "default",
  width: 378,
};

const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    showDrawer: (state, { payload }: PayloadAction<DrawerTypes>) => {
      state.open = true;
      state.title = payload?.title;
      state.content = payload?.content;
      state.extra = payload?.extra;
      state.footer = payload?.footer;
      state.placement = payload?.placement;
      state.size = payload?.size;
      state.width = payload?.width;
    },
    closeDrawer: (state) => {
      state.open = false;
      state.title = undefined;
      state.content = undefined;
    },
  },
});

export const DrawerState = (state: RootState) => state.drawer;

export const { showDrawer, closeDrawer } = drawerSlice.actions;

export default drawerSlice.reducer;
