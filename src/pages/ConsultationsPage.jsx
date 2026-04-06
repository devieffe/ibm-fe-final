import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import doctors from '../data/doctors'
import DoctorSearch from '../components/DoctorSearch'
import DoctorCard from '../components/DoctorCard'
import ConsultationForm from '../components/ConsultationForm'
import Notification from '../components/Notification'
import BookingList from '../components/BookingList'
import { cancelConsultation } from '../store/bookingsSlice'

export default function ConsultationsPage() {
    const { isAuthenticated } = useSelector((state) => state.auth)
    const { appointments, consultations } = useSelector((state) => state.bookings)

    const [tab, setTab] = useState('book')
    const [query, setQuery] = useState('')
    const [activeDoctor, setActiveDoctor] = useState(null)
    const [bookedMsg, setBookedMsg] = useState('')

    if (!isAuthenticated) return <Navigate to="/login" replace />

    const visibleDoctors = useMemo(() => {
        if (!query) return []
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

    const handleBooked = ({ doctorName, slot }) => {
        setActiveDoctor(null)
        setBookedMsg(`Instant consultation with Dr. ${doctorName} booked for ${slot}.`)
    }

    return (
        <>
            <div className="container mt-4">
                <div className="hero mb-3">
                    <h1>Instant Consultation</h1>
                    <p>Book an instant consultation or manage your existing ones.</p>
                </div>

                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <button
                            className={`nav-link${tab === 'book' ? ' active' : ''}`}
                            onClick={() => setTab('book')}
                        >
                        <i className="bi bi-phone me-2"></i>Book Consultation
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link${tab === 'my' ? ' active' : ''}`}
                            onClick={() => setTab('my')}
                        >
                            <i className="bi bi-phone me-2"></i>My Consultations
                            {consultations.length > 0 && (
                                <span className="badge ms-2" style={{background:'#ff9a3c'}}>{consultations.length}</span>
                            )}
                        </button>
                    </li>
                </ul>

                {tab === 'book' && (
                    <>
                        <div className="row justify-content-center mb-3">
                            <div className="col-lg-6">
                                <DoctorSearch
                                    onQueryChange={(q) => { setQuery(q); setBookedMsg('') }}
                                    placeholder="Select a specialty…"
                                />
                                {!query && (
                                    <p className="text-muted small mt-2 mb-0">
                                        <i className="bi bi-arrow-up me-1"></i>Select a specialty to see available doctors
                                    </p>
                                )}
                            </div>
                        </div>

                        {visibleDoctors.length > 0 && (
                            <>
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
                                        {visibleDoctors.length} doctor{visibleDoctors.length !== 1 ? 's' : ''} found
                                    </span>
                                    <span className="badge bg-primary-subtle text-primary">
                                        <i className="bi bi-funnel me-1"></i>{query}
                                    </span>
                                </div>
                                <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
                                    {visibleDoctors.map((doctor) => (
                                        <div className="col" key={doctor.id}>
                                            <DoctorCard
                                                doctor={doctor}
                                                onBook={setActiveDoctor}
                                                btnLabel="Book Instant Consultation"
                                                btnIcon="bi-phone"
                                                btnVariant="btn-orange"
                                                bookingType="consultation"
                                                appointment={latestAppt[doctor.id] || null}
                                                consultation={latestConsult[doctor.id] || null}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}

                {tab === 'my' && (
                    <BookingList
                        items={consultations}
                        onCancel={cancelConsultation}
                        emptyIcon="bi-phone"
                        emptyText="You have no consultations yet."
                        accentColor="orange"
                        accentIcon="bi-phone"
                        renderSummary={(c) => `${c.slot} · ${c.specialty}`}
                        detailsTitle={(c) => `Consultation with Dr. ${c.doctorName}`}
                        renderDetails={(c) => (
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between">
                                    <span className="text-muted"><i className="bi bi-person-fill me-2"></i>Doctor</span>
                                    <strong>Dr. {c.doctorName}</strong>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span className="text-muted"><i className="bi bi-heart-pulse me-2"></i>Specialty</span>
                                    <span>{c.specialty}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span className="text-muted"><i className="bi bi-clock me-2"></i>Time slot</span>
                                    <span>{c.slot}</span>
                                </li>
                                {c.notes && (
                                    <li className="list-group-item">
                                        <div className="text-muted mb-1"><i className="bi bi-chat-left-text me-2"></i>Notes</div>
                                        <div>{c.notes}</div>
                                    </li>
                                )}
                            </ul>
                        )}
                    />
                )}
            </div>

            {activeDoctor && (
                <ConsultationForm
                    doctor={activeDoctor}
                    onClose={() => setActiveDoctor(null)}
                    onBooked={handleBooked}
                />
            )}
        </>
    )
}
