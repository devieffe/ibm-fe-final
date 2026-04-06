import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Notification from './Notification'
import Popup from './Popup'
import { addAppointment } from '../store/bookingsSlice'

export default function AppointmentForm({ doctor, onClose, onBooked }) {
    const dispatch = useDispatch()
    const user = useSelector((s) => s.auth.user)

    const [name, setName] = useState(user?.username || '')
    const [phone, setPhone] = useState(user?.phone || '')
    const [formData, setFormData] = useState({ date: '', time: '' })
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState('')

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }

    const validate = () => {
        const next = {}
        if (!name.trim()) next.name = 'Name is required.'
        if (!phone.trim()) next.phone = 'Phone number is required.'
        if (!formData.date) next.date = 'Please select a date.'
        if (!formData.time) next.time = 'Please select a time.'
        return next
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const next = validate()
        if (Object.keys(next).length > 0) { setErrors(next); return }

        const booking = {
            doctorId: doctor.id,
            doctorName: doctor.name,
            specialty: doctor.specialty,
            date: formData.date,
            time: formData.time,
            patientName: name.trim(),
            patientPhone: phone.trim(),
        }
        setSuccess(`Appointment with Dr. ${doctor.name} booked for ${formData.date} at ${formData.time}.`)
        dispatch(addAppointment(booking))
        if (onBooked) onBooked(booking)
    }

    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    ]

    const today = new Date().toISOString().split('T')[0]

    return (
        <Popup onClose={onClose} title="Book Appointment" maxWidth="480px">
            {success ? (
                <>
                    <Notification message={success} type="success" dismissible={false} />
                    <button className="btn btn-primary w-100 mt-3" onClick={onClose}>Done</button>
                </>
            ) : (
                <form onSubmit={handleSubmit} noValidate>

                    {/* Doctor info */}
                    <div className="d-flex align-items-center gap-3 rounded p-3 mb-4"
                        style={{ background: '#e8f0fe', border: '1px solid #b6cefb' }}>
                        <i className="bi bi-person-circle fs-2 text-primary"></i>
                        <div>
                            <div className="fw-bold">Dr. {doctor.name}</div>
                            <div className="text-muted small">{doctor.specialty}</div>
                            <div className="text-muted small">
                                <i className="bi bi-briefcase me-1"></i>{doctor.experience}
                                <span className="mx-2">·</span>
                                <i className="bi bi-calendar3 me-1"></i>{doctor.availability}
                            </div>
                        </div>
                    </div>

                    {/* Patient name */}
                    <div className="mb-3">
                        <label htmlFor="appt-name" className="form-label fw-semibold">Your Name</label>
                        <input
                            id="appt-name"
                            type="text"
                            className={`form-control${errors.name ? ' is-invalid' : ''}`}
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors((ev) => ({ ...ev, name: '' })) }}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    {/* Patient phone */}
                    <div className="mb-3">
                        <label htmlFor="appt-phone" className="form-label fw-semibold">Phone Number</label>
                        <input
                            id="appt-phone"
                            type="tel"
                            className={`form-control${errors.phone ? ' is-invalid' : ''}`}
                            value={phone}
                            onChange={(e) => { setPhone(e.target.value); setErrors((ev) => ({ ...ev, phone: '' })) }}
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>

                    {/* Date */}
                    <div className="mb-3">
                        <label htmlFor="appt-date" className="form-label fw-semibold">Date</label>
                        <input
                            type="date"
                            id="appt-date"
                            name="date"
                            className={`form-control${errors.date ? ' is-invalid' : ''}`}
                            value={formData.date}
                            min={today}
                            onChange={handleChange}
                        />
                        {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                    </div>

                    {/* Time */}
                    <div className="mb-4">
                        <label htmlFor="appt-time" className="form-label fw-semibold">Time</label>
                        <select
                            id="appt-time"
                            name="time"
                            className={`form-select${errors.time ? ' is-invalid' : ''}`}
                            value={formData.time}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select a time slot</option>
                            {timeSlots.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        {errors.time && <div className="invalid-feedback">{errors.time}</div>}
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        <i className="bi bi-calendar-check me-2"></i>Book Now
                    </button>
                </form>
            )}
        </Popup>
    )
}
