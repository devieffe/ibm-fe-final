import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ReviewCard from '../components/ReviewCard'
import ReviewForm from '../components/ReviewForm'
import reviews from '../data/reviews'

export default function ReviewsPage() {
    const [allReviews, setAllReviews] = useState(reviews)
    const { isAuthenticated } = useSelector((s) => s.auth)
    const navigate = useNavigate()

    const handleNewReview = (newReview) => {
        setAllReviews((prev) => [newReview, ...prev])
    }

    return (
        <>
            <div className="container mt-4">
                <div className="hero">
                    <h1>Reviews</h1>
                    <p>See what our community is saying about Stay Healthy.</p>
                </div>
            </div>

            <div className="container mt-4">
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {allReviews.map(({ text, name, role, rating }, index) => (
                        <div className="col" key={`${name}-${index}`}>
                            <ReviewCard text={text} name={name} role={role} rating={rating} />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-5">
                    {isAuthenticated ? (
                        <>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/my-reviews')}
                            >
                                <i className="bi bi-pencil-square me-2"></i>Write a Review
                            </button>
                            <ReviewForm onReviewSubmit={handleNewReview} />
                        </>
                    ) : (
                        <p className="text-muted">
                            <i className="bi bi-lock-fill me-2"></i>
                            <a href="/login" className="text-decoration-none">Log in</a> to write a review.
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}
