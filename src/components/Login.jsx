import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login({
    isAuthenticated,
    email,
    password,
    errors = {},
    loading = false,
    onEmailChange,
    onPasswordChange,
    onSubmit,
    onReset = () => { },
    onForgotPassword = () => { },
}) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="card p-4 shadow-sm">
            <h4 className="mb-4">Log In</h4>
            {isAuthenticated && (
                <div className="alert alert-success" role="alert">
                    You are currently logged in.
                </div>
            )}
            <form noValidate onSubmit={onSubmit}>
                {errors.form && (
                    <div className="alert alert-danger" role="alert">
                        {errors.form}
                    </div>
                )}
                <div className="mb-3">
                    <label className="form-label" htmlFor="email">Email address</label>
                    <input
                        className={`form-control${errors.email ? ' is-invalid' : ''}`}
                        type="email"
                        id="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={onEmailChange}
                        required
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="password">Password</label>
                    <div className="input-group">
                        <input
                            className={`form-control${errors.password ? ' is-invalid' : ''}`}
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={onPasswordChange}
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
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <button
                        className="btn btn-link p-0"
                        type="button"
                        onClick={onForgotPassword}
                    >
                        Forgot password?
                    </button>
                    <button className="btn btn-outline-secondary btn-sm" type="button" onClick={onReset}>
                        Reset Fields
                    </button>
                </div>
                <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                    {loading
                        ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Logging in…</>
                        : 'Log In'
                    }
                </button>
            </form>
            <p className="mt-3 text-center mb-0">
                Don&apos;t have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    )
}