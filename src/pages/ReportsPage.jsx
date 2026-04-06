import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import BookingsTable from '../components/BookingsTable'
import Popup from '../components/Popup'

function buildPdf(booking) {
    const doc = new jsPDF()
    const isAppt = booking.type === 'appointment'
    const accentHex = isAppt ? [13, 110, 253] : [255, 154, 60]

    // Header bar
    doc.setFillColor(...accentHex)
    doc.rect(0, 0, 210, 28, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('StayHealthy — Medical Report', 14, 18)

    // Reset text colour
    doc.setTextColor(30, 30, 30)

    // Section: Booking type
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text(isAppt ? 'Appointment Record' : 'Consultation Record', 14, 40)

    doc.setDrawColor(...accentHex)
    doc.setLineWidth(0.5)
    doc.line(14, 43, 196, 43)

    // Fields
    const fields = isAppt
        ? [
            ['Doctor', `Dr. ${booking.doctorName}`],
            ['Specialty', booking.specialty],
            ['Date', booking.date],
            ['Time', booking.time],
            ...(booking.patientName ? [['Patient Name', booking.patientName]] : []),
            ...(booking.patientPhone ? [['Patient Phone', booking.patientPhone]] : []),
        ]
        : [
            ['Doctor', `Dr. ${booking.doctorName}`],
            ['Specialty', booking.specialty],
            ['Time Slot', booking.slot],
            ...(booking.patientName ? [['Patient Name', booking.patientName]] : []),
            ...(booking.patientPhone ? [['Patient Phone', booking.patientPhone]] : []),
        ]

    let y = 54
    doc.setFontSize(11)
    fields.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(100, 100, 100)
        doc.text(label + ':', 14, y)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(30, 30, 30)
        doc.text(String(value), 70, y)
        y += 9
    })

    // Footer
    doc.setFontSize(9)
    doc.setTextColor(160, 160, 160)
    doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 285)
    doc.text('StayHealthy © 2026', 160, 285)

    return doc
}

export default function ReportsPage() {
    const { isAuthenticated } = useSelector((s) => s.auth)
    const { appointments, consultations } = useSelector((s) => s.bookings)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [previewTitle, setPreviewTitle] = useState('')

    if (!isAuthenticated) return <Navigate to="/login" replace />

    const rows = [
        ...appointments.map((b) => ({ ...b, type: 'appointment' })),
        ...consultations.map((b) => ({ ...b, type: 'consultation' })),
    ]

    const handleView = (booking) => {
        const doc = buildPdf(booking)
        const blob = doc.output('blob')
        const url = URL.createObjectURL(blob)
        setPreviewTitle(`Report — Dr. ${booking.doctorName}`)
        setPreviewUrl(url)
    }

    const handleDownload = (booking) => {
        const doc = buildPdf(booking)
        doc.save(`report-${booking.doctorName.replace(/\s+/g, '-').toLowerCase()}-${booking.id}.pdf`)
    }

    const handleClosePreview = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
    }

    return (
        <>
            <div className="container mt-4">
                <div className="hero mb-4">
                    <h1>My Reports</h1>
                    <p>View or download a PDF report for each of your bookings.</p>
                </div>

                <BookingsTable
                    rows={rows}
                    renderAction={(booking) => (
                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleView(booking)}
                                title="View PDF"
                            >
                                <i className="bi bi-eye me-1"></i>View
                            </button>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleDownload(booking)}
                                title="Download PDF"
                            >
                                <i className="bi bi-download me-1"></i>Download
                            </button>
                        </div>
                    )}
                />
            </div>

            {previewUrl && (
                <Popup
                    onClose={handleClosePreview}
                    title={previewTitle}
                    maxWidth="780px"
                >
                    <iframe
                        src={previewUrl}
                        title="PDF Preview"
                        style={{ width: '100%', height: '520px', border: 'none', borderRadius: '6px' }}
                    />
                </Popup>
            )}
        </>
    )
}
