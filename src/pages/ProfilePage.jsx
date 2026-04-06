import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import ProfileCard from '../components/ProfileCard'

export default function ProfilePage() {
    const { isAuthenticated } = useSelector((state) => state.auth)

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return (
        <div className="container mt-4">
            <div className="hero mb-4">
                <h1>My Profile</h1>
                <p>View and edit your account details.</p>
            </div>
            <ProfileCard />
        </div>
    )
}
