import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './api/auth'
import mainReducer from './features/mainSlice'

export const store = configureStore({
    reducer: {
        main: mainReducer,
        [authApi.reducerPath]: authApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
})