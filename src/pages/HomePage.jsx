import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AboutUsSection from '../components/AboutUsSection'
import HomeReviewsStripe from '../components/HomeReviewsStripe'

export default function HomePage() {
    const navigate = useNavigate()
    const { isAuthenticated } = useSelector((state) => state.auth)

    return (
        <>
            <div className="container">
                <div className="hero hero-home hero-home-gradient">
                    <h1>Welcome to Stay Healthy</h1>
                    <p>This is a Bootstrap-enabled React page.</p>
                    <button
                        className="btn btn-primary btn-lg mt-3"
                        onClick={() => navigate(isAuthenticated ? '/services' : '/login')}
                    >
                        Get Started
                    </button>
                </div>
            </div>

            <div className="container mt-4">
                <div className="row mb-5">
                    <div className="col-md-4 text-center">
                        <i className="bi bi-apple text-success feature-icon"></i>
                        <h3>Nutrition</h3>
                        <p>Eat healthy foods to fuel your body and mind.</p>
                    </div>
                    <div className="col-md-4 text-center">
                        <i className="bi bi-activity text-primary feature-icon"></i>
                        <h3>Exercise</h3>
                        <p>Stay active with regular physical activities.</p>
                    </div>
                    <div className="col-md-4 text-center">
                        <i className="bi bi-heart-fill text-danger feature-icon"></i>
                        <h3>Wellness</h3>
                        <p>Focus on mental and emotional well-being.</p>
                    </div>
                </div>

                <AboutUsSection />
                <HomeReviewsStripe />
            </div>
        </>
    )
}
