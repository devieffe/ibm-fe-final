export default function AboutUsSection() {
    return (
        <div className="mt-5 mb-5">
            <div className="row align-items-center">
                <div className="col-md-6">
                    <h2>About Us</h2>
                    <p>Stay Healthy is dedicated to promoting wellness and healthy living. Our team of experts provides guidance on nutrition, exercise, and mental health to help you achieve your best self.</p>
                    <p>Founded in 2020, we have helped thousands of individuals transform their lives through personalized health plans and evidence-based advice.</p>
                    <h5>Our Mission</h5>
                    <p>To empower people with the knowledge and tools they need to live healthier, happier lives.</p>
                    <ul className="list-unstyled">
                        <li><i className="bi bi-check-circle text-success me-2"></i>Expert nutrition guidance</li>
                        <li><i className="bi bi-check-circle text-success me-2"></i>Personalized exercise plans</li>
                        <li><i className="bi bi-check-circle text-success me-2"></i>Mental wellness support</li>
                        <li><i className="bi bi-check-circle text-success me-2"></i>24/7 community access</li>
                    </ul>
                </div>
                <div className="col-md-6 text-center">
                    <i className="bi bi-people-fill hero-icon"></i>
                    <p className="mt-3">Join our community of health enthusiasts</p>
                </div>
            </div>
        </div>
    )
}