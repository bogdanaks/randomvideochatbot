import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { RootState } from "app/store"

const initialState: UserState = {
  isVisibleSettings: false,
  selectedCountry: null,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsVisibleSettings: (state, action: PayloadAction<boolean>) => {
      state.isVisibleSettings = action.payload
    },
    setSelectedCountry: (state, action: PayloadAction<Country | null>) => {
      state.selectedCountry = action.payload
    },
  },
})

export const { setIsVisibleSettings, setSelectedCountry } = userSlice.actions

export const selectIsVisibleSettings = (state: RootState) => state.user.isVisibleSettings
export const selectSelectedCountry = (state: RootState) => state.user.selectedCountry

export const userReducer = userSlice.reducer
