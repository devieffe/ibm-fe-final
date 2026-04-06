import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Popup from './Popup'
import Notification from './Notification'
import { addConsultation } from '../store/bookingsSlice'

export default function ConsultationForm({ doctor, onClose, onBooked }) {
    const dispatch = useDispatch()
    const user = useSelector((s) => s.auth.user)

    const [name, setName] = useState(user?.username || '')
    const [phone, setPhone] = useState(user?.phone || '')
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState('')

    const validate = () => {
        const e = {}
        if (!name.trim()) e.name = 'Name is required.'
        if (!phone.trim()) e.phone = 'Phone number is required.'
        return e
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const e2 = validate()
        if (Object.keys(e2).length) { setErrors(e2); return }

        const booking = {
            doctorId: doctor.id,
            doctorName: doctor.name,
            specialty: doctor.specialty,
            slot: new Date().toLocaleString(),
            patientName: name.trim(),
            patientPhone: phone.trim(),
        }
        dispatch(addConsultation(booking))
        setSuccess(`Consultation with Dr. ${doctor.name} booked!`)
        if (onBooked) onBooked(booking)
    }

    return (
        <Popup
            onClose={onClose}
            title="Book Instant Consultation"
            maxWidth="460px"
        >
            {success ? (
                <>
                    <Notification message={success} type="success" dismissible={false} />
                    <button className="btn btn-primary w-100 mt-3" onClick={onClose}>Done</button>
                </>
            ) : (
                <form onSubmit={handleSubmit} noValidate>

                    {/* ── Doctor info ── */}
                    <div className="d-flex align-items-center gap-3 rounded p-3 mb-4"
                        style={{ background: '#fff0e6', border: '1px solid #ffd5b0' }}>
                        <i className="bi bi-person-circle fs-2" style={{ color: '#ff9a3c' }}></i>
                        <div>
                            <div className="fw-bold">Dr. {doctor.name}</div>
                            <div className="text-muted small">{doctor.specialty}</div>
                            <div className="text-muted small">
                                <i className="bi bi-calendar3 me-1"></i>{doctor.availability}
                            </div>
                        </div>
                    </div>

                    {/* ── Patient name ── */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold" htmlFor="cf-name">Your Name</label>
                        <input
                            id="cf-name"
                            type="text"
                            className={`form-control${errors.name ? ' is-invalid' : ''}`}
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors((ev) => ({ ...ev, name: '' })) }}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    {/* ── Patient phone ── */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold" htmlFor="cf-phone">Phone Number</label>
                        <input
                            id="cf-phone"
                            type="tel"
                            className={`form-control${errors.phone ? ' is-invalid' : ''}`}
                            value={phone}
                            onChange={(e) => { setPhone(e.target.value); setErrors((ev) => ({ ...ev, phone: '' })) }}
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>

                    <button type="submit" className="btn btn-orange w-100">
                        <i className="bi bi-phone me-2"></i>Book Now
                    </button>
                </form>
            )}
        </Popup>
    )
}

