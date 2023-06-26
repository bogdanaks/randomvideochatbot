import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { RootState } from "app/store"

const initialState: VideoChatState = {
  recipientPeerId: null,
}

export const videChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setRecipientPeerId: (state, actions: PayloadAction<string | null>) => {
      state.recipientPeerId = actions.payload
    },
  },
})

export const { setRecipientPeerId } = videChatSlice.actions

export const selectRecipientPeerId = (state: RootState) => state.videoChat.recipientPeerId

export const videoChatReducer = videChatSlice.reducer
