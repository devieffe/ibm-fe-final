import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Popup from './Popup'
import { addReview } from '../store/bookingsSlice'
import { showNotification } from '../store/notificationSlice'

// ─── ReviewForm ───────────────────────────────────────────────────────────────
// Stand-alone "Write a Review" button + lightbox for the public Reviews page.
export function ReviewForm({ onReviewSubmit }) {
    const dispatch = useDispatch()
    const [showForm, setShowForm] = useState(false)
    const [showWarning, setShowWarning] = useState(false)
    const [formData, setFormData] = useState({ name: '', review: '', rating: 0 })

    const closeForm = () => { setShowForm(false); setShowWarning(false) }
    const handleBackdropClick = (e) => { if (e.target === e.currentTarget) closeForm() }
    const handleButtonClick = () => { setShowForm(true) }
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
    const handleRating = (value) => setFormData({ ...formData, rating: value })
    const handleReset = () => { setFormData({ name: '', review: '', rating: 0 }); setShowWarning(false) }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.name || !formData.review || formData.rating < 1) {
            setShowWarning(true)
            return
        }
        setShowWarning(false)
        if (onReviewSubmit) {
            onReviewSubmit({
                text: formData.review,
                name: formData.name,
                role: 'Community Member',
                rating: Number(formData.rating),
            })
        }
        setFormData({ name: '', review: '', rating: 0 })
        setShowForm(false)
        dispatch(showNotification({ message: `Thanks, ${formData.name}! Your review has been posted.`, type: 'success' }))
    }

    return (
        <div>
            <button className="btn btn-primary" onClick={handleButtonClick}>
                <i className="bi bi-pencil-square me-2"></i>Write a Review
            </button>

            {showForm && (
                <div className="review-add-overlay" onClick={handleBackdropClick}>
                    <div className="review-add-modal text-start">
                        <button
                            type="button"
                            className="btn-close review-add-close"
                            aria-label="Close"
                            onClick={closeForm}
                        />
                        <h5 className="mb-3">Give Your Feedback</h5>
                        {showWarning && (
                            <div className="alert alert-warning py-2">
                                Please fill out all fields and select a star rating.
                            </div>
                        )}
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-3">
                                <label htmlFor="review-name" className="form-label fw-semibold">Name</label>
                                <input
                                    type="text"
                                    id="review-name"
                                    name="name"
                                    className="form-control"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold d-block">Rating</label>
                                <div className="d-flex gap-1 fs-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <i
                                            key={star}
                                            className={`bi review-add-star ${star <= formData.rating ? 'bi-star-fill text-warning' : 'bi-star text-secondary'}`}
                                            onClick={() => handleRating(star)}
                                            role="button"
                                            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="review-text" className="form-label fw-semibold">Review</label>
                                <textarea
                                    id="review-text"
                                    name="review"
                                    className="form-control"
                                    rows={4}
                                    placeholder="Share your experience…"
                                    value={formData.review}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary">Submit Review</button>
                                <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>
                                    Reset Fields
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}

// ─── ReviewPopup ──────────────────────────────────────────────────────────────
// Popup-based review form tied to a specific booking (appointments / consultations).
export function ReviewPopup({ booking, type, onClose }) {
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
                    <div className="rounded p-3 mb-4 small"
                        style={{ background: isAppt ? '#e8f0fe' : '#fff0e6', border: `1px solid ${isAppt ? '#b6cefb' : '#ffd5b0'}` }}>
                        <i className={`bi ${isAppt ? 'bi-calendar2-check-fill text-primary' : 'bi-phone'} me-2`}
                            style={!isAppt ? { color: '#ff9a3c' } : {}}></i>
                        <strong>{isAppt ? `${booking.date} at ${booking.time}` : booking.slot}</strong>
                        <span className="text-muted ms-2">{booking.specialty}</span>
                    </div>
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
