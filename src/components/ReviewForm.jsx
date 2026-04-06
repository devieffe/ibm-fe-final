import { useState } from 'react'

// Component for submitting a new review
export default function ReviewForm({ onReviewSubmit }) {
    const [showForm, setShowForm] = useState(false)
    const [submittedMessage, setSubmittedMessage] = useState(null)
    const [showWarning, setShowWarning] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        review: '',
        rating: 0,
    })

    const closeForm = () => {
        setShowForm(false)
        setShowWarning(false)
    }

    // Close when clicking the backdrop (but not the form itself)
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) closeForm()
    }

    // Open the review form
    const handleButtonClick = () => {
        setShowForm(true)
        setSubmittedMessage(null)
    }

    // Keep form data in sync with user input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Handle star rating click
    const handleRating = (value) => {
        setFormData({ ...formData, rating: value })
    }

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault()

        // Validate: all fields required, rating must be selected
        if (!formData.name || !formData.review || formData.rating < 1) {
            setShowWarning(true)
            return
        }

        setShowWarning(false)
        setSubmittedMessage(formData)

        // Notify parent with the new review object
        if (onReviewSubmit) {
            onReviewSubmit({
                text: formData.review,
                name: formData.name,
                role: 'Community Member',
                rating: Number(formData.rating),
            })
        }

        // Reset form and hide it
        setFormData({ name: '', review: '', rating: 0 })
        setShowForm(false)
    }

    const handleReset = () => {
        setFormData({ name: '', review: '', rating: 0 })
        setShowWarning(false)
    }

    return (
        <div>
            {/* Trigger button */}
            <button className="btn btn-primary" onClick={handleButtonClick}>
                <i className="bi bi-pencil-square me-2"></i>Write a Review
            </button>

            {/* Lightbox */}
            {showForm && (
                <div className="review-add-overlay" onClick={handleBackdropClick}>
                    <div className="review-add-modal text-start">
                        {/* × close button top-right */}
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
                            {/* Name */}
                            <div className="mb-3">
                                <label htmlFor="review-name" className="form-label fw-semibold">
                                    Name
                                </label>
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

                            {/* Star Rating */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold d-block">Rating</label>
                                <div className="d-flex gap-1 fs-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <i
                                            key={star}
                                            className={`bi review-add-star ${star <= formData.rating
                                                ? 'bi-star-fill text-warning'
                                                : 'bi-star text-secondary'
                                                }`}
                                            onClick={() => handleRating(star)}
                                            role="button"
                                            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Review text */}
                            <div className="mb-3">
                                <label htmlFor="review-text" className="form-label fw-semibold">
                                    Review
                                </label>
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
                                <button type="submit" className="btn btn-primary">
                                    Submit Review
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={handleReset}
                                >
                                    Reset Fields
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation banner after submission */}
            {submittedMessage && (
                <div className="alert alert-success mt-3 d-inline-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill fs-5"></i>
                    <span>
                        Thanks, <strong>{submittedMessage.name}</strong>! Your review has been posted.
                    </span>
                </div>
            )}
        </div>
    )
}
