import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const services = [
    {
        icon: 'bi bi-phone',
        iconStyle: { color: '#ff9a3c' },
        title: 'Instant Consultation',
        description: 'Connect with a doctor immediately. Choose a time slot and get expert advice without the wait.',
        authRequired: true,
        action: '/consultations',
        btnLabel: 'Start Consultation',
        btnVariant: 'btn-orange',
    },
    {
        icon: 'bi bi-calendar2-check-fill text-primary',
        title: 'Book Appointment',
        description: 'Schedule a consultation with one of our specialists at a time that works for you.',
        authRequired: true,
        action: '/appointments',
        btnLabel: 'Book Appointment',
        btnVariant: 'btn-primary',
    },
    {
        icon: 'bi bi-clipboard2-pulse-fill text-success',
        title: 'Self Checkup',
        description: 'Use our guided self-assessment tools to monitor your symptoms and track your health.',
        authRequired: false,
        action: '/checkup',
        btnLabel: 'Start Checkup',
        btnVariant: 'btn-success',
    },
    {
        icon: 'bi bi-heart-pulse-fill text-danger',
        title: 'Health Tips & Guidance',
        description: 'Browse expert articles, wellness tips, and lifestyle advice to stay at your best.',
        authRequired: false,
        action: '/health-blog',
        btnLabel: 'Browse Tips',
        btnVariant: 'btn-danger',
    },
]

export default function ServicesCardsGrid() {
    const { isAuthenticated } = useSelector((state) => state.auth)
    const navigate = useNavigate()

    const handleClick = (service) => {
        if (service.authRequired && !isAuthenticated) {
            navigate('/login')
            return
        }
        if (service.action) navigate(service.action)
    }

    return (
        <div className="row g-4 mt-2">
            {services.map((service) => {
                const locked = service.authRequired && !isAuthenticated
                return (
                    <div className="col-lg-3 col-md-6" key={service.title}>
                        <div className={`card h-100 shadow-sm${locked ? ' border-secondary opacity-75' : ''}`}>
                            <div className="card-body d-flex flex-column text-center">
                                <i className={`${service.icon} service-icon`} style={service.iconStyle || {}}></i>
                                <h5 className="mt-3">{service.title}</h5>
                                <p className="flex-grow-1">{service.description}</p>
                                <button
                                    className={`btn btn-sm ${service.btnVariant} mt-auto`}
                                    onClick={() => handleClick(service)}
                                >
                                    {locked
                                        ? <><i className="bi bi-box-arrow-in-right me-1"></i>Log in to access</>
                                        : service.btnLabel
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
