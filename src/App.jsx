import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AppLayout from './components/AppLayout'
import Notification from './components/Notification'
import { clearNotification } from './store/notificationSlice'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import AppointmentsPage from './pages/AppointmentsPage'
import HealthBlogPage from './pages/HealthBlogPage'
import ReviewsPage from './pages/ReviewsPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import MyReviewsPage from './pages/MyReviewsPage'
import ConsultationsPage from './pages/ConsultationsPage'
import ReportsPage from './pages/ReportsPage'
import SelfCheckupPage from './pages/SelfCheckupPage'

function AppNotification() {
    const dispatch = useDispatch()
    const { message, type } = useSelector((s) => s.notification)
    return (
        <Notification
            message={message}
            type={type}
            onDismiss={() => dispatch(clearNotification())}
        />
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AppNotification />
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/appointments" element={<AppointmentsPage />} />
                    <Route path="/health-blog" element={<HealthBlogPage />} />
                    <Route path="/reviews" element={<ReviewsPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/my-reviews" element={<MyReviewsPage />} />
                    <Route path="/consultations" element={<ConsultationsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/checkup" element={<SelfCheckupPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
