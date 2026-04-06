import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Login from '../components/Login'
import users from '../data/users'
import { loginSuccess } from '../store/authSlice'
import { loginUser } from '../services/Login.jsx'

const STORAGE_KEY = 'stayHealthyUsers'
const fallbackUsers = [...users]

function syncUsersData(nextUsers) {
    users.length = 0
    users.push(...nextUsers)
}

function canUseLocalStorage() {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function mergeUsersByEmail(baseUsers, incomingUsers) {
    const mergedUsers = [...baseUsers]

    incomingUsers.forEach((incomingUser) => {
        const exists = mergedUsers.some(
            (baseUser) => normalizeEmail(baseUser.email) === normalizeEmail(incomingUser.email)
        )

        if (!exists) {
            mergedUsers.push(incomingUser)
        }
    })

    return mergedUsers
}

function readUsers() {
    if (!canUseLocalStorage()) {
        syncUsersData(fallbackUsers)
        return fallbackUsers
    }

    const rawUsers = window.localStorage.getItem(STORAGE_KEY)

    if (!rawUsers) {
        const seededUsers = [...users]
        syncUsersData(seededUsers)
        return seededUsers
    }

    try {
        const parsedUsers = JSON.parse(rawUsers)
        const persistedUsers = Array.isArray(parsedUsers) ? parsedUsers : []
        const nextUsers = mergeUsersByEmail(users, persistedUsers)
        syncUsersData(nextUsers)
        return nextUsers
    } catch {
        const seededUsers = [...users]
        syncUsersData(seededUsers)
        return seededUsers
    }
}

function writeUsers(nextUsers) {
    if (!canUseLocalStorage()) {
        fallbackUsers.length = 0
        fallbackUsers.push(...nextUsers)
        syncUsersData(nextUsers)
        return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUsers))
    syncUsersData(nextUsers)
}

function normalizeEmail(email) {
    return email.trim().toLowerCase()
}

function findUserByEmail(email) {
    const normalizedEmail = normalizeEmail(email)
    return readUsers().find((user) => normalizeEmail(user.email) === normalizedEmail) || null
}

export function updateUser(id, updates) {
    const allUsers = readUsers()
    const index = allUsers.findIndex((u) => u.id === id)

    if (index === -1) {
        return { success: false, error: 'User not found.' }
    }

    // If email is being changed, ensure it is not taken by another account
    if (updates.email) {
        const normalizedNew = normalizeEmail(updates.email)
        const conflict = allUsers.find(
            (u, i) => i !== index && normalizeEmail(u.email) === normalizedNew
        )
        if (conflict) {
            return { success: false, error: 'That email is already in use.' }
        }
    }

    const updatedUser = { ...allUsers[index], ...updates }
    const nextUsers = allUsers.map((u, i) => (i === index ? updatedUser : u))
    writeUsers(nextUsers)

    return { success: true, error: null, user: updatedUser }
}

export function addUser(user) {
    const existingUser = findUserByEmail(user.email)

    if (existingUser) {
        return {
            success: false,
            error: 'An account with this email already exists.',
            user: null,
        }
    }

    const createdUser = {
        id: Date.now(),
        fullName: user.fullName.trim(),
        role: user.role,
        email: user.email.trim(),
        phone: user.phone.trim(),
        password: user.password,
    }

    const nextUsers = [...readUsers(), createdUser]
    writeUsers(nextUsers)

    return {
        success: true,
        error: null,
        user: createdUser,
    }
}

function authenticateUser(email, password) {
    const existingUser = findUserByEmail(email)

    if (!existingUser) {
        return null
    }

    return existingUser.password === password ? existingUser : null
}

export default function LoginPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isAuthenticated } = useSelector((state) => state.auth)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const validateForm = () => {
        const nextErrors = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!email.trim()) {
            nextErrors.email = 'Email is required.'
        } else if (!emailRegex.test(email.trim())) {
            nextErrors.email = 'Enter a valid email address.'
        }

        if (!password.trim()) {
            nextErrors.password = 'Password is required.'
        }

        return nextErrors
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const nextErrors = validateForm()
        setErrors(nextErrors)

        if (Object.keys(nextErrors).length > 0) return

        setLoading(true)

        let user

        // Use real API if configured (returns null when no URL set), otherwise fall back to localStorage
        const apiResult = await loginUser(email, password)

        if (apiResult !== null) {
            setLoading(false)
            if (!apiResult.success) {
                setErrors({ form: apiResult.error })
                return
            }
            user = apiResult.user
        } else {
            user = authenticateUser(email, password)
            setLoading(false)
            if (!user) {
                setErrors({ form: 'Invalid email or password.' })
                return
            }
        }

        dispatch(
            loginSuccess({
                id: user.id,
                username: user.fullName,
                role: user.role,
                email: user.email,
                phone: user.phone,
            })
        )
        navigate('/')
    }

    const handleReset = () => {
        setEmail('')
        setPassword('')
        setErrors({})
    }

    const handleForgotPassword = () => {
        setPassword('')
        setErrors((previousErrors) => {
            const { password: _password, form: _form, ...rest } = previousErrors
            return rest
        })
    }

    return (
        <>
            <div className="container mt-4">
                <div className="hero">
                    <h1>Welcome Back</h1>
                    <p>Log in to your account and continue your wellness journey with Stay Healthy.</p>
                </div>
            </div>

            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <Login
                            isAuthenticated={isAuthenticated}
                            email={email}
                            password={password}
                            errors={errors}
                            loading={loading}
                            onEmailChange={(event) => {
                                setEmail(event.target.value)
                                setErrors((previousErrors) => {
                                    const { email: _email, form: _form, ...rest } = previousErrors
                                    return rest
                                })
                            }}
                            onPasswordChange={(event) => {
                                setPassword(event.target.value)
                                setErrors((previousErrors) => {
                                    const { password: _password, form: _form, ...rest } = previousErrors
                                    return rest
                                })
                            }}
                            onSubmit={handleSubmit}
                            onReset={handleReset}
                            onForgotPassword={handleForgotPassword}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
