/**
 * BookingsTable — reusable table of bookings (appointments + consultations).
 *
 * Props:
 *   rows         — array of booking objects, each with a `type` field ('appointment'|'consultation')
 *   renderAction — fn(booking) → JSX rendered in the last column
 */
export default function BookingsTable({ rows, renderAction }) {
    if (rows.length === 0) {
        return (
            <div className="text-center py-5 text-muted">
                <i className="bi bi-journal-x fs-1 d-block mb-2"></i>
                <p>No bookings found.</p>
                <p className="small">Book an appointment or consultation first.</p>
            </div>
        )
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th style={{ width: '3rem' }}>#</th>
                        <th>Doctor</th>
                        <th>Specialty</th>
                        <th>Type</th>
                        <th>Date / Slot</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((booking, idx) => (
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
                            <td className="small text-muted">
                                {booking.type === 'appointment'
                                    ? `${booking.date} · ${booking.time}`
                                    : booking.slot}
                            </td>
                            <td>{renderAction(booking)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
