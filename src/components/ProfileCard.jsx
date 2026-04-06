import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile } from '../store/authSlice'
import { updateUser } from '../pages/LoginPage'
import UserName from './UserName'

export default function ProfileCard() {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)

    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState({
        fullName: user?.username || '',
        phone: user?.phone || '',
    })
    const [errors, setErrors] = useState({})
    const [successMsg, setSuccessMsg] = useState('')

    if (!user) {
        return (
            <div className="alert alert-warning">
                You must be logged in to view your profile.
            </div>
        )
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
        setSuccessMsg('')
    }

    const handlePhoneChange = (e) => {
        setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })
        setErrors({ ...errors, phone: '' })
        setSuccessMsg('')
    }

    const validate = () => {
        const next = {}
        const phoneRegex = /^\d{7,15}$/

        if (!formData.fullName.trim()) next.fullName = 'Full name is required.'
        if (!formData.phone.trim()) {
            next.phone = 'Phone number is required.'
        } else if (!phoneRegex.test(formData.phone.trim())) {
            next.phone = 'Enter digits only (7–15 digits).'
        }

        return next
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const next = validate()
        if (Object.keys(next).length > 0) {
            setErrors(next)
            return
        }

        const result = updateUser(user.id, {
            fullName: formData.fullName.trim(),
            phone: formData.phone.trim(),
        })

        if (!result.success) {
            setErrors({ form: result.error })
            return
        }

        dispatch(
            updateProfile({
                username: result.user.fullName,
                phone: result.user.phone,
            })
        )

        setSuccessMsg('Profile updated successfully.')
        setEditing(false)
    }

    const handleCancel = () => {
        setFormData({
            fullName: user?.username || '',
            phone: user?.phone || '',
        })
        setErrors({})
        setSuccessMsg('')
        setEditing(false)
    }

    // Initials avatar — include Dr. prefix for doctors
    const displayName = (user.role === 'Doctor' ? 'Dr. ' : '') + (user.username || user.email || '?')
    const initials = displayName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <div className="card shadow-sm profile-card mx-auto">
            {/* Avatar header */}
            <div className="profile-card-header text-center py-4">
                <div className="profile-avatar mx-auto mb-3">
                    {initials}
                </div>
                {!editing && (
                    <>
                        <UserName name={user.username || user.email} role={user.role} tag="h4" className="mb-0" />
                        <span className="badge bg-primary mt-1">{user.role}</span>
                    </>
                )}
            </div>

            <div className="card-body px-4 pb-4">
                {successMsg && (
                    <div className="alert alert-success py-2 d-flex align-items-center gap-2">
                        <i className="bi bi-check-circle-fill"></i> {successMsg}
                    </div>
                )}

                {!editing ? (
                    /* ── View mode ── */
                    <>
                        <ul className="list-group list-group-flush mb-4">
                            <li className="list-group-item px-0">
                                <div className="text-muted small"><i className="bi bi-shield-check me-2"></i>Role</div>
                                <div className="fw-semibold">{user.role}</div>
                            </li>
                            <li className="list-group-item px-0">
                                <div className="text-muted small"><i className="bi bi-person me-2"></i>Full name</div>
                                <UserName name={user.username} role={user.role} className="fw-semibold" />
                            </li>
                            <li className="list-group-item px-0">
                                <div className="text-muted small"><i className="bi bi-envelope me-2"></i>Email</div>
                                <div className="fw-semibold">{user.email}</div>
                            </li>
                            <li className="list-group-item px-0">
                                <div className="text-muted small"><i className="bi bi-telephone me-2"></i>Phone</div>
                                <div className="fw-semibold">{user.phone || '—'}</div>
                            </li>
                        </ul>
                        <button
                            className="btn btn-primary w-100"
                            onClick={() => { setEditing(true); setSuccessMsg('') }}
                        >
                            <i className="bi bi-pencil me-2"></i>Edit Profile
                        </button>
                    </>
                ) : (
                    /* ── Edit mode ── */
                    <form onSubmit={handleSubmit} noValidate>
                        {errors.form && (
                            <div className="alert alert-danger py-2">{errors.form}</div>
                        )}

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Role</label>
                            <input
                                type="text"
                                className="form-control"
                                value={user.role}
                                readOnly
                                disabled
                            />
                            <div className="form-text">Role cannot be changed.</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="profile-fullName" className="form-label fw-semibold">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="profile-fullName"
                                name="fullName"
                                className={`form-control${errors.fullName ? ' is-invalid' : ''}`}
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                            {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="profile-email" className="form-label fw-semibold">
                                Email
                            </label>
                            <input
                                type="email"
                                id="profile-email"
                                className="form-control"
                                value={user.email}
                                readOnly
                                disabled
                            />
                            <div className="form-text">Email cannot be changed.</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="profile-phone" className="form-label fw-semibold">
                                Phone
                            </label>
                            <input
                                type="tel"
                                id="profile-phone"
                                name="phone"
                                className={`form-control${errors.phone ? ' is-invalid' : ''}`}
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                inputMode="numeric"
                                placeholder="Digits only"
                            />
                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                        </div>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary flex-grow-1">
                                <i className="bi bi-check-lg me-1"></i>Save Changes
                            </button>
                            <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
