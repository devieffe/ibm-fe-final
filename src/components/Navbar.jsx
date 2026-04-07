// Repository: ibm-fe-final-upd — https://github.com/devieffe/ibm-fe-final-upd
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'
import UserName from './UserName'

function navClass({ isActive }) {
    return `nav-link${isActive ? ' active' : ''}`
}

export default function Navbar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isAuthenticated, user } = useSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        navigate('/')
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light" aria-label="Main navigation">
            <div className="container-fluid">
                <div className="d-flex justify-content-between w-100">
                    <NavLink className="navbar-brand" to="/">
                        <span className="text-primary">Stay</span>
                        <span className="text-success">Healthy</span>
                    </NavLink>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <NavLink className={navClass} to="/">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={navClass} to="/services">Services</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={navClass} to="/appointments">Appointments</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={navClass} to="/health-blog">Health blog</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={navClass} to="/reviews">Reviews</NavLink>
                        </li>
                    </ul>

                    <div className="d-flex ms-auto align-items-center gap-2">
                        {isAuthenticated ? (
                            <>
                                {/* User dropdown */}
                                <div className="dropdown">
                                    <button
                                        className="btn btn-outline-secondary dropdown-toggle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        aria-label="User menu"
                                    >
                                        <i className="bi bi-person-circle me-1"></i>
                                        <UserName name={user?.username || user?.email} role={user?.role} />
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                            <NavLink className="dropdown-item" to="/profile">
                                                <i className="bi bi-pencil me-2"></i>Edit profile
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="dropdown-item" to="/my-reviews">
                                                <i className="bi bi-star me-2"></i>Edit reviews
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="dropdown-item" to="/reports">
                                                <i className="bi bi-file-earmark-medical me-2"></i>Reports
                                            </NavLink>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button className="dropdown-item text-danger" onClick={handleLogout}>
                                                <i className="bi bi-box-arrow-right me-2"></i>Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <>
                                <NavLink className="btn btn-outline-primary" to="/signup">Sign Up</NavLink>
                                <NavLink className="btn btn-primary" to="/login">Log in</NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
