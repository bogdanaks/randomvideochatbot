import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { RootState } from "app/store"

const initialState: UserState = {
  isVisibleSettings: false,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsVisibleSettings: (state, action: PayloadAction<boolean>) => {
      state.isVisibleSettings = action.payload
    },
  },
})

export const { setIsVisibleSettings } = userSlice.actions

export const selectIsVisibleSettings = (state: RootState) => state.user.isVisibleSettings

export const userReducer = userSlice.reducer
