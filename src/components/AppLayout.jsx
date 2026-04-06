import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import BookingsWidget from './BookingsWidget'

export default function AppLayout() {
    return (
        <div className="page-wrap">
            <header>
                <Navbar />
            </header>
            <main>
                <Outlet />
            </main>
            <Footer />
            <BookingsWidget />
        </div>
    )
}
