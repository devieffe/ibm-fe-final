import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import doctors from '../data/doctors'
import DoctorCard from '../components/DoctorCard'
import AppointmentForm from '../components/AppointmentForm'
import DoctorSearch from '../components/DoctorSearch'
import Notification from '../components/Notification'
import BookingList from '../components/BookingList'
import { cancelAppointment } from '../store/bookingsSlice'
import usePageTitle from '../hooks/usePageTitle'

export default function AppointmentsPage() {
    usePageTitle('Appointments', 'Book an appointment with a StayHealthy specialist at a time that works for you.')
    const { isAuthenticated } = useSelector((state) => state.auth)
    const { appointments, consultations } = useSelector((state) => state.bookings)

    const [tab, setTab] = useState('book')
    const [selectedDoctor, setSelectedDoctor] = useState(null)
    const [bookedMsg, setBookedMsg] = useState('')
    const [query, setQuery] = useState('')

    if (!isAuthenticated) return <Navigate to="/login" replace />

    const visibleDoctors = useMemo(() => {
        if (!query) return doctors
        return doctors.filter((d) => d.specialty === query)
    }, [query])

    // latest appointment per doctorId
    const latestAppt = useMemo(() => {
        const map = {}
            ;[...appointments].reverse().forEach((a) => { if (!map[a.doctorId]) map[a.doctorId] = a })
        return map
    }, [appointments])

    // latest consultation per doctorId
    const latestConsult = useMemo(() => {
        const map = {}
            ;[...consultations].reverse().forEach((c) => { if (!map[c.doctorId]) map[c.doctorId] = c })
        return map
    }, [consultations])

    const handleBooked = (appt) => {
        setSelectedDoctor(null)
        setBookedMsg(`Appointment with Dr. ${appt.doctorName} confirmed for ${appt.date} at ${appt.time}.`)
    }

    return (
        <>
            <div className="container mt-4">
                <div className="hero mb-3">
                    <h1>Appointments</h1>
                    <p>Book a new appointment or manage your existing ones.</p>
                </div>

                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <button
                            className={`nav-link${tab === 'book' ? ' active' : ''}`}
                            onClick={() => setTab('book')}
                        >
                            <i className="bi bi-calendar-plus me-2"></i>Book Appointment
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link${tab === 'my' ? ' active' : ''}`}
                            onClick={() => setTab('my')}
                        >
                            <i className="bi bi-calendar2-check me-2"></i>My Appointments
                            {appointments.length > 0 && (
                                <span className="badge bg-primary ms-2">{appointments.length}</span>
                            )}
                        </button>
                    </li>
                </ul>

                {tab === 'book' && (
                    <>
                        <div className="row justify-content-center mb-4">
                            <div className="col-lg-6">
                                <DoctorSearch
                                    onQueryChange={(q) => { setQuery(q); setBookedMsg('') }}
                                    placeholder="All specialties"
                                />
                            </div>
                        </div>

                        {bookedMsg && (
                            <Notification
                                message={bookedMsg}
                                type="success"
                                dismissible
                                onDismiss={() => setBookedMsg('')}
                            />
                        )}

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted small">
                                {visibleDoctors.length === doctors.length
                                    ? `${doctors.length} doctors available`
                                    : `${visibleDoctors.length} of ${doctors.length} doctors`
                                }
                            </span>
                            {query && (
                                <span className="badge bg-primary-subtle text-primary">
                                    <i className="bi bi-funnel me-1"></i>{query}
                                </span>
                            )}
                        </div>

                        {visibleDoctors.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-search fs-1 d-block mb-2"></i>
                                No doctors found for <strong>{query}</strong>
                            </div>
                        ) : (
                            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
                                {visibleDoctors.map((doctor) => (
                                    <div className="col" key={doctor.id}>
                                        <DoctorCard
                                            doctor={doctor}
                                            onBook={setSelectedDoctor}
                                            bookingType="appointment"
                                            appointment={latestAppt[doctor.id] || null}
                                            consultation={latestConsult[doctor.id] || null}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {tab === 'my' && (
                    <BookingList
                        items={appointments}
                        onCancel={cancelAppointment}
                        emptyIcon="bi-calendar-x"
                        emptyText="You have no appointments yet."
                        accentColor="primary"
                        accentIcon="bi-calendar2-check-fill"
                        renderSummary={(a) => `${a.date} at ${a.time} · ${a.specialty}`}
                        detailsTitle={(a) => `Appointment with Dr. ${a.doctorName}`}
                        renderDetails={(a) => (
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between">
                                    <span className="text-muted"><i className="bi bi-person-fill me-2"></i>Doctor</span>
                                    <strong>Dr. {a.doctorName}</strong>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span className="text-muted"><i className="bi bi-heart-pulse me-2"></i>Specialty</span>
                                    <span>{a.specialty}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span className="text-muted"><i className="bi bi-calendar3 me-2"></i>Date</span>
                                    <span>{a.date}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span className="text-muted"><i className="bi bi-clock me-2"></i>Time</span>
                                    <span>{a.time}</span>
                                </li>
                                {a.notes && (
                                    <li className="list-group-item">
                                        <div className="text-muted mb-1"><i className="bi bi-chat-left-text me-2"></i>Notes</div>
                                        <div>{a.notes}</div>
                                    </li>
                                )}
                            </ul>
                        )}
                    />
                )}
            </div>

            {selectedDoctor && (
                <AppointmentForm
                    doctor={selectedDoctor}
                    onClose={() => setSelectedDoctor(null)}
                    onBooked={handleBooked}
                />
            )}
        </>
    )
}
