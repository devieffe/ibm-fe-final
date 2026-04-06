import { Link } from 'react-router-dom'
import ReviewCard from './ReviewCard'
import reviews from '../data/reviews'

export default function HomeReviewsStripe() {
    const looped = [...reviews, ...reviews]

    return (
        <div className="mt-5 mb-5">
            <h2 className="text-center">What Our Clients Say</h2>
            <div className="reviews-container home-reviews-fullbleed">
                <div className="reviews-scroll">
                    {looped.map(({ text, name, role }, index) => (
                        <div className="review" key={`${name}-${index}`}>
                            <ReviewCard text={text} name={name} role={role} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="text-center mt-3">
                <Link className="btn btn-primary" to="/reviews">More Reviews</Link>
            </div>
        </div>
    )
}