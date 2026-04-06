import { createSlice } from '@reduxjs/toolkit'

const bookingsSlice = createSlice({
    name: 'bookings',
    initialState: {
        appointments: [],
        consultations: [],
        reviews: {},   // keyed by bookingId: { rating, text }
    },
    reducers: {
        addAppointment: (state, action) => {
            state.appointments.unshift({ ...action.payload, id: Date.now() })
        },
        cancelAppointment: (state, action) => {
            state.appointments = state.appointments.filter((a) => a.id !== action.payload)
            delete state.reviews[action.payload]
        },
        addConsultation: (state, action) => {
            state.consultations.unshift({ ...action.payload, id: Date.now() })
        },
        cancelConsultation: (state, action) => {
            state.consultations = state.consultations.filter((c) => c.id !== action.payload)
            delete state.reviews[action.payload]
        },
        addReview: (state, action) => {
            // payload: { bookingId, rating, text }
            state.reviews[action.payload.bookingId] = {
                rating: action.payload.rating,
                text: action.payload.text,
            }
        },
    },
})

export const { addAppointment, cancelAppointment, addConsultation, cancelConsultation, addReview } = bookingsSlice.actions
export default bookingsSlice.reducer
