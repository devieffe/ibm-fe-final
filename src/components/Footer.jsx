import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="bg-secondary text-light py-4 mt-4">
            <div className="container py-4">
                <div className="row g-4 pt-1 pb-4">
                    <div className="col-md-4">
                        <h5>StayHealthy</h5>
                        <p className="mb-0">Your trusted guide to nutrition, fitness, and wellness.</p>
                    </div>
                    <div className="col-md-4">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled mb-0">
                            <li><Link to="/" className="text-light text-decoration-none">Home</Link></li>
                            <li><Link to="/services" className="text-light text-decoration-none">Services</Link></li>
                            <li><Link to="/appointments" className="text-light text-decoration-none">Appointments</Link></li>
                            <li><Link to="/health-blog" className="text-light text-decoration-none">Health Blog</Link></li>
                            <li><Link to="/reviews" className="text-light text-decoration-none">Reviews</Link></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Contact us</h5>
                        <p className="mb-1">Email: info@stayhealthy.com</p>
                        <p className="mb-2">Phone: +1 (555) 123-4567</p>
                        <div>
                            <a href="#" className="text-light me-3" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
                            <a href="#" className="text-light me-3" aria-label="Twitter"><i className="bi bi-twitter"></i></a>
                            <a href="#" className="text-light" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
                        </div>
                    </div>
                </div>
                <hr className="my-3" />
                <div className="text-center">
                    <small>&copy; 2026 Stay Healthy. All rights reserved.</small>
                </div>
            </div>
        </footer>
    )
}
