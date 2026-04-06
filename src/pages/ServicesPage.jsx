import { useNavigate } from 'react-router-dom'
import ServicesCardsGrid from '../components/ServicesCardsGrid'

export default function ServicesPage() {
    const navigate = useNavigate()

    return (
        <>
            <div className="container mt-4">
                <div className="hero">
                    <h1>Our Services</h1>
                    <p>Discover the tailored wellness services we offer for nutrition, fitness, and mental wellbeing.</p>
                </div>
            </div>

            <div className="container mt-4">
                <ServicesCardsGrid />

                <div className="row g-4 mt-4 align-items-stretch">
                    <div className="col-lg-6 d-flex">
                        <div className="card p-4 shadow-sm w-100" style={{ backgroundColor: 'rgba(0,255,255,0.08)' }}>
                            <h4>Why Choose Our Services?</h4>
                            <ul className="list-unstyled mb-0">
                                <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Expert guidance from wellness professionals</li>
                                <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Flexible programs for busy schedules</li>
                                <li><i className="bi bi-check-circle text-success me-2"></i>Support for nutrition, fitness, and mental health</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-6 d-flex">
                        <div className="card p-4 shadow-sm w-100 d-flex flex-column bg-white">
                            <h4>Join Our Clinic's Staff</h4>
                            <p className="flex-grow-1">Are you a healthcare professional? Join our growing network of doctors and wellness experts and make a difference.</p>
                            <button className="btn btn-primary w-100" onClick={() => navigate('/signup')}>
                                <i className="bi bi-person-plus me-2"></i>Join As a Doctor
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
