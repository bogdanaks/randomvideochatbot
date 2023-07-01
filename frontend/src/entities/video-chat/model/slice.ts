import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { RootState } from "app/store"

const initialState: VideoChatState = {
  recipientPeerId: null,
  isSearching: false,
}

export const videChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setRecipientPeerId: (state, actions: PayloadAction<string | null>) => {
      state.recipientPeerId = actions.payload
    },
    setIsSearching: (state, actions: PayloadAction<boolean>) => {
      state.isSearching = actions.payload
    },
  },
})

export const { setRecipientPeerId, setIsSearching } = videChatSlice.actions

export const selectRecipientPeerId = (state: RootState) => state.videoChat.recipientPeerId
export const selectVideoChat = (state: RootState) => state.videoChat

export const videoChatReducer = videChatSlice.reducer
