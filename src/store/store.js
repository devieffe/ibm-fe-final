import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import bookingsReducer from './bookingsSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        bookings: bookingsReducer,
    },
})
