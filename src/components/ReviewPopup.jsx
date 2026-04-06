import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Popup from './Popup'
import { addReview } from '../store/bookingsSlice'

/**
 * ReviewPopup — star rating + text review form for a single booking.
 * Props:
 *   booking  — appointment or consultation object
 *   type     — 'appointment' | 'consultation'
 *   onClose  — called after submit or dismiss
 */
export default function ReviewPopup({ booking, type, onClose }) {
    const dispatch = useDispatch()
    const [rating, setRating] = useState(0)
    const [hovered, setHovered] = useState(0)
    const [text, setText] = useState('')
    const [error, setError] = useState('')
    const [done, setDone] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (rating < 1) { setError('Please select a star rating.'); return }
        if (!text.trim()) { setError('Please write a short review.'); return }
        dispatch(addReview({ bookingId: booking.id, rating, text: text.trim() }))
        setDone(true)
    }

    const isAppt = type === 'appointment'

    return (
        <Popup
            onClose={onClose}
            title="Write a Review"
            subtitle={`Dr. ${booking.doctorName} — ${booking.specialty}`}
            maxWidth="460px"
        >
            {done ? (
                <div className="text-center py-3">
                    <i className="bi bi-patch-check-fill text-success fs-1 d-block mb-3"></i>
                    <p className="fw-semibold mb-1">Thank you for your review!</p>
                    <p className="text-muted small mb-4">Your feedback helps others find the right doctor.</p>
                    <button className="btn btn-primary w-100" onClick={onClose}>Close</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} noValidate>

                    {/* Booking summary */}
                    <div className="rounded p-3 mb-4 small"
                        style={{ background: isAppt ? '#e8f0fe' : '#fff0e6', border: `1px solid ${isAppt ? '#b6cefb' : '#ffd5b0'}` }}>
                        <i className={`bi ${isAppt ? 'bi-calendar2-check-fill text-primary' : 'bi-phone'} me-2`}
                            style={!isAppt ? { color: '#ff9a3c' } : {}}></i>
                        <strong>{isAppt ? `${booking.date} at ${booking.time}` : booking.slot}</strong>
                        <span className="text-muted ms-2">{booking.specialty}</span>
                    </div>

                    {/* Star rating */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold d-block">Rating</label>
                        <div className="d-flex gap-1" style={{ fontSize: '1.6rem' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                    key={star}
                                    className={`bi ${star <= (hovered || rating) ? 'bi-star-fill' : 'bi-star'}`}
                                    style={{
                                        color: star <= (hovered || rating) ? '#ff9a3c' : '#adb5bd',
                                        cursor: 'pointer',
                                        transition: 'color 0.1s',
                                    }}
                                    onClick={() => { setRating(star); setError('') }}
                                    onMouseEnter={() => setHovered(star)}
                                    onMouseLeave={() => setHovered(0)}
                                    role="button"
                                    aria-label={`${star} star`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Review text */}
                    <div className="mb-3">
                        <label htmlFor="rv-text" className="form-label fw-semibold">Your Review</label>
                        <textarea
                            id="rv-text"
                            className={`form-control${error && !text.trim() ? ' is-invalid' : ''}`}
                            rows={4}
                            placeholder="Share your experience with this doctor…"
                            value={text}
                            onChange={(e) => { setText(e.target.value); setError('') }}
                        />
                    </div>

                    {error && (
                        <div className="alert alert-danger py-2 small mb-3">
                            <i className="bi bi-exclamation-circle me-2"></i>{error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100">
                        <i className="bi bi-send-fill me-2"></i>Submit Review
                    </button>
                </form>
            )}
        </Popup>
    )
}
