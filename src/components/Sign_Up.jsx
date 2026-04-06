import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { addUser } from '../pages/LoginPage'
import { loginSuccess } from '../store/authSlice'
import { registerUser } from '../services/Sign_Up.jsx'

export default function Sign_Up() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [fullName, setFullName] = useState('')
    const [role, setRole] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const validateForm = () => {
        const nextErrors = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const phoneRegex = /^\d{7,15}$/

        if (!role.trim()) {
            nextErrors.role = 'Role is required.'
        }

        if (!fullName.trim()) {
            nextErrors.fullName = 'Full name is required.'
        }

        if (!email.trim()) {
            nextErrors.email = 'Email is required.'
        } else if (!emailRegex.test(email.trim())) {
            nextErrors.email = 'Enter a valid email address.'
        }

        if (!phone.trim()) {
            nextErrors.phone = 'Phone number is required.'
        } else if (!phoneRegex.test(phone.trim())) {
            nextErrors.phone = 'Enter a valid phone number using digits only.'
        }

        if (!password.trim()) {
            nextErrors.password = 'Password is required.'
        }

        if (!confirmPassword.trim()) {
            nextErrors.confirmPassword = 'Confirm password is required.'
        } else if (password !== confirmPassword) {
            nextErrors.confirmPassword = 'Passwords do not match.'
        }

        return nextErrors
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const nextErrors = validateForm()
        setErrors(nextErrors)

        if (Object.keys(nextErrors).length > 0) return

        setLoading(true)

        const payload = { fullName, role, email, phone, password }

        // Use real API if configured (returns null when no URL set), otherwise fall back to localStorage
        const apiResult = await registerUser(payload)
        const result = apiResult ?? addUser(payload)

        setLoading(false)

        if (!result.success) {
            setErrors({ form: result.error })
            return
        }

        dispatch(
            loginSuccess({
                id: result.user.id,
                username: result.user.fullName,
                role: result.user.role,
                email: result.user.email,
                phone: result.user.phone,
            })
        )

        navigate('/')
    }

    const handlePhoneChange = (event) => {
        const digitsOnly = event.target.value.replace(/\D/g, '')
        setPhone(digitsOnly)
        setErrors((previousErrors) => {
            const { phone: _phone, form: _form, ...rest } = previousErrors
            return rest
        })
    }

    const handleReset = () => {
        setFullName('')
        setRole('')
        setEmail('')
        setPhone('')
        setPassword('')
        setConfirmPassword('')
        setShowPassword(false)
        setShowConfirmPassword(false)
        setErrors({})
    }

    return (
        <div className="card p-4 shadow-sm">
            <h4 className="mb-4">Sign Up</h4>
            <form noValidate onSubmit={handleSubmit}>
                {errors.form && (
                    <div className="alert alert-danger" role="alert">
                        {errors.form}
                    </div>
                )}
                <div className="mb-3">
                    <label className="form-label" htmlFor="role">Role</label>
                    <select
                        className={`form-select${errors.role ? ' is-invalid' : ''}`}
                        id="role"
                        value={role}
                        onChange={(event) => {
                            setRole(event.target.value)
                            setErrors((previousErrors) => {
                                const { role: _role, form: _form, ...rest } = previousErrors
                                return rest
                            })
                        }}
                        required
                    >
                        <option value="" disabled>Select role</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Patient">Patient</option>
                    </select>
                    {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="fullName">Full Name</label>
                    <input
                        className={`form-control${errors.fullName ? ' is-invalid' : ''}`}
                        type="text"
                        id="fullName"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(event) => {
                            setFullName(event.target.value)
                            setErrors((previousErrors) => {
                                const { fullName: _fullName, form: _form, ...rest } = previousErrors
                                return rest
                            })
                        }}
                        required
                    />
                    {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="email">Email address</label>
                    <input
                        className={`form-control${errors.email ? ' is-invalid' : ''}`}
                        type="email"
                        id="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value)
                            setErrors((previousErrors) => {
                                const { email: _email, form: _form, ...rest } = previousErrors
                                return rest
                            })
                        }}
                        required
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="phone">Phone Number</label>
                    <input
                        className={`form-control${errors.phone ? ' is-invalid' : ''}`}
                        type="tel"
                        id="phone"
                        placeholder="Digits only"
                        value={phone}
                        onChange={handlePhoneChange}
                        inputMode="numeric"
                        required
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="password">Password</label>
                    <div className="input-group">
                        <input
                            className={`form-control${errors.password ? ' is-invalid' : ''}`}
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value)
                                setErrors((previousErrors) => {
                                    const { password: _password, form: _form, ...rest } = previousErrors
                                    return rest
                                })
                            }}
                            required
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => setShowPassword((previous) => !previous)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                    </div>
                    {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-group">
                        <input
                            className={`form-control${errors.confirmPassword ? ' is-invalid' : ''}`}
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(event) => {
                                setConfirmPassword(event.target.value)
                                setErrors((previousErrors) => {
                                    const { confirmPassword: _confirmPassword, form: _form, ...rest } = previousErrors
                                    return rest
                                })
                            }}
                            required
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => setShowConfirmPassword((previous) => !previous)}
                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                            <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                    </div>
                    {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
                </div>
                <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                    {loading
                        ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating account…</>
                        : 'Create Account'
                    }
                </button>
                <button className="btn btn-outline-secondary w-100 mt-2" type="button" onClick={handleReset}>Reset Fields</button>
            </form>
            <p className="mt-3 text-center mb-0">
                Already have account? <Link to="/login">Log in</Link>
            </p>
        </div>
    )
}