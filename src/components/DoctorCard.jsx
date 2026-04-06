import { useState } from 'react'
import UserName from './UserName'
import CancelBookingPopup from './CancelBookingPopup'

/**
 * DoctorCard
 * Props:
 *   doctor       — doctor object
 *   onBook       — called with doctor when the book button is clicked
 *   btnLabel     — book button label
 *   btnIcon      — book button icon class
 *   btnVariant   — book button Bootstrap variant class
 *   bookingType  — 'appointment' | 'consultation' — which booking type this card represents
 *   appointment  — existing appointment booking for this doctor (or null)
 *   consultation — existing consultation booking for this doctor (or null)
 */
export default function DoctorCard({
    doctor,
    onBook,
    btnLabel = 'Book Appointment',
    btnIcon = 'bi-calendar-plus',
    btnVariant = 'btn-primary',
    bookingType = 'appointment',
    appointment = null,
    consultation = null,
}) {
    const [cancelTarget, setCancelTarget] = useState(null) // { booking, type }

    // The active booking relevant to this card's type
    const activeBooking = bookingType === 'appointment' ? appointment : consultation

    return (
        <>
            <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <i className={`bi ${doctor.avatar} text-primary doctor-card-avatar`}></i>
                        <div>
                            <UserName name={doctor.name} role="Doctor" tag="h6" className="mb-0 fw-bold" />
                            <small className="text-muted">{doctor.specialty}</small>
                        </div>
                    </div>

                    <ul className="list-unstyled small text-muted mb-3 flex-grow-1">
                        <li className="mb-1">
                            <i className="bi bi-briefcase me-2"></i>{doctor.experience} experience
                        </li>
                        <li>
                            <i className="bi bi-calendar3 me-2"></i>Available: {doctor.availability}
                        </li>
                    </ul>

                    {activeBooking ? (
                        /* ── Already booked: show summary + cancel button ── */
                        <div className="mt-auto d-flex flex-column gap-2">
                            <div
                                className="rounded px-2 py-2 small"
                                style={{ background: bookingType === 'appointment' ? '#e8f0fe' : '#fff0e6' }}
                            >
                                <div className="fw-semibold mb-1">
                                    <i className={`bi ${bookingType === 'appointment' ? 'bi-calendar2-check-fill text-primary' : 'bi-phone'} me-1`} style={bookingType !== 'appointment' ? { color: '#ff9a3c' } : {}}></i>
                                    {bookingType === 'appointment' ? 'Appointment booked' : 'Consultation booked'}
                                </div>
                                <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                                    {bookingType === 'appointment'
                                        ? `${activeBooking.date} · ${activeBooking.time}`
                                        : activeBooking.slot}
                                </div>
                            </div>
                            <button
                                className="btn btn-outline-danger w-100"
                                onClick={() => setCancelTarget({ booking: activeBooking, type: bookingType })}
                            >
                                <i className="bi bi-x-circle me-2"></i>Cancel {bookingType === 'appointment' ? 'Appointment' : 'Consultation'}
                            </button>
                        </div>
                    ) : (
                        /* ── Not booked: show book button ── */
                        <button
                            className={`btn ${btnVariant} w-100 mt-auto`}
                            onClick={() => onBook(doctor)}
                        >
                            <i className={`bi ${btnIcon} me-2`}></i>{btnLabel}
                        </button>
                    )}
                </div>
            </div>

            {cancelTarget && (
                <CancelBookingPopup
                    booking={cancelTarget.booking}
                    type={cancelTarget.type}
                    onClose={() => setCancelTarget(null)}
                />
            )}
        </>
    )
}
