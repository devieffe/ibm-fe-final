import { useDispatch } from 'react-redux'
import Popup from './Popup'
import { cancelAppointment, cancelConsultation } from '../store/bookingsSlice'

/**
 * CancelBookingPopup — shows full booking details and a confirm-cancel button.
 * Props:
 *   booking  — the booking object (appointment or consultation)
 *   type     — 'appointment' | 'consultation'
 *   onClose  — called after cancel or dismiss
 */
export default function CancelBookingPopup({ booking, type, onClose }) {
    const dispatch = useDispatch()

    const isAppt = type === 'appointment'

    const handleCancel = () => {
        if (isAppt) dispatch(cancelAppointment(booking.id))
        else dispatch(cancelConsultation(booking.id))
        onClose()
    }

    return (
        <Popup
            onClose={onClose}
            title={isAppt ? 'Cancel Appointment' : 'Cancel Consultation'}
            subtitle={`Dr. ${booking.doctorName} — ${booking.specialty}`}
            maxWidth="460px"
        >
            <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item d-flex justify-content-between">
                    <span className="text-muted">
                        <i className="bi bi-person-fill me-2"></i>Doctor
                    </span>
                    <strong>Dr. {booking.doctorName}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                    <span className="text-muted">
                        <i className="bi bi-heart-pulse me-2"></i>Specialty
                    </span>
                    <span>{booking.specialty}</span>
                </li>
                {isAppt ? (
                    <>
                        <li className="list-group-item d-flex justify-content-between">
                            <span className="text-muted">
                                <i className="bi bi-calendar3 me-2"></i>Date
                            </span>
                            <span>{booking.date}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <span className="text-muted">
                                <i className="bi bi-clock me-2"></i>Time
                            </span>
                            <span>{booking.time}</span>
                        </li>
                    </>
                ) : (
                    <li className="list-group-item d-flex justify-content-between">
                        <span className="text-muted">
                            <i className="bi bi-clock me-2"></i>Time slot
                        </span>
                        <span>{booking.slot}</span>
                    </li>
                )}
                {booking.notes && (
                    <li className="list-group-item">
                        <div className="text-muted mb-1">
                            <i className="bi bi-chat-left-text me-2"></i>Notes
                        </div>
                        <div>{booking.notes}</div>
                    </li>
                )}
            </ul>

            <p className="text-muted small mb-4">
                <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                This will permanently remove this {isAppt ? 'appointment' : 'consultation'} from your list.
            </p>

            <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary flex-grow-1" onClick={onClose}>
                    Keep it
                </button>
                <button className="btn btn-danger flex-grow-1" onClick={handleCancel}>
                    <i className="bi bi-x-lg me-2"></i>Yes, cancel
                </button>
            </div>
        </Popup>
    )
}
