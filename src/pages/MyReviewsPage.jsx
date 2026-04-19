import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { ReviewPopup } from '../components/GiveReviews'
import usePageTitle from '../hooks/usePageTitle'

export default function MyReviewsPage() {
    usePageTitle('My Reviews', 'Write and manage your reviews for StayHealthy doctors and wellness consultations.')
    const { isAuthenticated } = useSelector((s) => s.auth)
    const { appointments, consultations, reviews } = useSelector((s) => s.bookings)

    const [target, setTarget] = useState(null) // { booking, type }

    if (!isAuthenticated) return <Navigate to="/login" replace />

    // Merge appointments + consultations into one reviewable list
    const rows = [
        ...appointments.map((b) => ({ ...b, type: 'appointment' })),
        ...consultations.map((b) => ({ ...b, type: 'consultation' })),
    ]

    const preview = (id) => {
        const r = reviews[id]
        if (!r) return null
        const words = r.text.split(' ').slice(0, 6).join(' ')
        return words + (r.text.split(' ').length > 6 ? '…' : '')
    }

    return (
        <div className="container mt-4">
            <div className="hero mb-4">
                <h1>My Reviews</h1>
                <p>Leave a review for every doctor you've visited.</p>
            </div>

            {rows.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <i className="bi bi-chat-square-text fs-1 d-block mb-2"></i>
                    <p>You have no bookings to review yet.</p>
                    <p className="small">Book an appointment or consultation first.</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '3rem' }}>#</th>
                                <th>Doctor</th>
                                <th>Specialty</th>
                                <th>Type</th>
                                <th>Review</th>
                                <th style={{ width: '10rem' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((booking, idx) => {
                                const reviewed = !!reviews[booking.id]
                                const p = preview(booking.id)
                                return (
                                    <tr key={booking.id}>
                                        <td className="text-muted">{idx + 1}</td>
                                        <td className="fw-semibold">Dr. {booking.doctorName}</td>
                                        <td className="text-muted small">{booking.specialty}</td>
                                        <td>
                                            {booking.type === 'appointment' ? (
                                                <span className="badge" style={{ background: '#e8f0fe', color: '#0d6efd' }}>
                                                    <i className="bi bi-calendar2-check-fill me-1"></i>Appointment
                                                </span>
                                            ) : (
                                                <span className="badge" style={{ background: '#fff4ec', color: '#ff9a3c' }}>
                                                    <i className="bi bi-phone me-1"></i>Consultation
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-muted small fst-italic">
                                            {reviewed ? (
                                                <span>
                                                    {'★'.repeat(reviews[booking.id].rating)}
                                                    {'☆'.repeat(5 - reviews[booking.id].rating)}
                                                    <span className="ms-2">{p}</span>
                                                </span>
                                            ) : (
                                                <span className="text-muted">—</span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary w-100"
                                                disabled={reviewed}
                                                onClick={() => setTarget({ booking, type: booking.type })}
                                            >
                                                {reviewed
                                                    ? <><i className="bi bi-check-circle me-1"></i>Reviewed</>
                                                    : <><i className="bi bi-pencil me-1"></i>Write Review</>}
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {target && (
                <ReviewPopup
                    booking={target.booking}
                    type={target.type}
                    onClose={() => setTarget(null)}
                />
            )}
        </div>
    )
}
