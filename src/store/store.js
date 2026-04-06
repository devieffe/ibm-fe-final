import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import bookingsReducer from './bookingsSlice'
import notificationReducer from './notificationSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        bookings: bookingsReducer,
        notification: notificationReducer,
    },
})
