export const a = true
// import { PayloadAction, createSlice } from "@reduxjs/toolkit"

// import { RootState } from "app/store"

// const initialState: ChatState = {
//   webApp: null,
//   initData: null,
// }

// export const telegramSlice = createSlice({
//   name: "telegram",
//   initialState,
//   reducers: {
//     setInit: (state, actions: PayloadAction<InitState>) => {
//       state.messages = actions.payload.messages
//       state.users = actions.payload.users
//       state.roomId = actions.payload.roomId
//       state.socketId = actions.payload.socketId
//       state.isLoading = false
//     },
//     setReply: (state, actions: PayloadAction<ChatMessage | null>) => {
//       state.reply = actions.payload
//     },
//   },
// })

// export const { setInit } = telegramSlice.actions

// export const selectTelegram = (state: RootState) => state.telegram

// export const telegramReducer = telegramSlice.reducer
