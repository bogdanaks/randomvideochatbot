import { Action, ThunkAction, combineReducers, configureStore } from "@reduxjs/toolkit"
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist"
import storage from "redux-persist/lib/storage"

import { authApi } from "entities/auth/api"
import { authReducer } from "entities/auth/model/slice"
import { chatReducer } from "entities/chat/model/slice"
import { userReducer } from "entities/user/model/slice"
import { videoChatReducer } from "entities/video-chat/model/slice"

const persistConfig = {
  key: "root",
  storage,
  whitelist: [],
}

const rootReducer = combineReducers({
  chat: chatReducer,
  auth: authReducer,
  user: userReducer,
  videoChat: videoChatReducer,
  [authApi.reducerPath]: authApi.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(authApi.middleware),
  devTools: process.env.REACT_APP_ENVIRONMENT !== "production",
})

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
