import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { jsPDF } from 'jspdf'
import BookingsTable from '../components/BookingsTable'
import Popup from '../components/Popup'

function buildPdf(booking, reviews) {
    const doc = new jsPDF()
    const isAppt = booking.type === 'appointment'
    const accentHex = isAppt ? [13, 110, 253] : [255, 154, 60]
    const review = reviews[booking.id]

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

    // ── Prescription Details ──────────────────────────────────────────────────
    y += 6
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 30)
    doc.text('Prescription Details', 14, y)
    y += 4
    doc.setDrawColor(...accentHex)
    doc.setLineWidth(0.5)
    doc.line(14, y, 196, y)
    y += 9

    const specialty = (booking.specialty || '').toLowerCase()
    const prescriptionData = specialty.includes('cardio')
        ? {
            diagnosis: 'Mild hypertension, routine monitoring',
            medications: [
                { name: 'Amlodipine 5mg', dosage: '1 tablet daily (morning)' },
                { name: 'Aspirin 75mg', dosage: '1 tablet daily (with food)' },
            ],
            instructions: 'Avoid high-sodium diet. Moderate aerobic exercise recommended.',
            followUp: '4 weeks',
        }
        : specialty.includes('derm')
            ? {
                diagnosis: 'Mild eczema / contact dermatitis',
                medications: [
                    { name: 'Hydrocortisone cream 1%', dosage: 'Apply to affected area twice daily' },
                    { name: 'Cetirizine 10mg', dosage: '1 tablet at night' },
                ],
                instructions: 'Avoid known irritants. Moisturise twice daily with fragrance-free lotion.',
                followUp: '3 weeks',
            }
            : specialty.includes('ortho')
                ? {
                    diagnosis: 'Mild musculoskeletal strain',
                    medications: [
                        { name: 'Ibuprofen 400mg', dosage: '1 tablet three times daily after meals (max 5 days)' },
                        { name: 'Diclofenac gel 1%', dosage: 'Apply to affected area up to 3 times daily' },
                    ],
                    instructions: 'Rest affected area. Apply ice pack 15 min, 3× per day.',
                    followUp: '2 weeks',
                }
                : {
                    diagnosis: 'General wellness consultation',
                    medications: [
                        { name: 'Vitamin D3 1000 IU', dosage: '1 capsule daily (with meal)' },
                        { name: 'Paracetamol 500mg', dosage: '1–2 tablets as needed (max 8/day)' },
                    ],
                    instructions: 'Maintain balanced diet, adequate hydration, and regular sleep schedule.',
                    followUp: '6 weeks',
                }

    doc.setFontSize(11)

    // Diagnosis
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(100, 100, 100)
    doc.text('Diagnosis:', 14, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(30, 30, 30)
    doc.text(prescriptionData.diagnosis, 70, y)
    y += 9

    // Medications
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(100, 100, 100)
    doc.text('Medications:', 14, y)
    y += 7
    prescriptionData.medications.forEach((med, i) => {
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(30, 30, 30)
        doc.text(`${i + 1}. ${med.name}`, 20, y)
        y += 6
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(80, 80, 80)
        doc.text(`   ${med.dosage}`, 20, y)
        y += 7
    })

    // Instructions
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(100, 100, 100)
    doc.text('Instructions:', 14, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(30, 30, 30)
    const instructionLines = doc.splitTextToSize(prescriptionData.instructions, 120)
    doc.text(instructionLines, 70, y)
    y += instructionLines.length * 6 + 3

    // Follow-up
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(100, 100, 100)
    doc.text('Follow-up:', 14, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(30, 30, 30)
    doc.text(`In ${prescriptionData.followUp}`, 70, y)
    y += 12

    // ── Patient Review ────────────────────────────────────────────────────────
    if (review) {
        doc.setFontSize(13)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(30, 30, 30)
        doc.text('Patient Review', 14, y)
        y += 4
        doc.setDrawColor(...accentHex)
        doc.line(14, y, 196, y)
        y += 9

        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(100, 100, 100)
        doc.text('Rating:', 14, y)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(30, 30, 30)
        doc.text('★'.repeat(review.rating) + '☆'.repeat(5 - review.rating) + `  (${review.rating}/5)`, 70, y)
        y += 9

        doc.setFont('helvetica', 'bold')
        doc.setTextColor(100, 100, 100)
        doc.text('Comments:', 14, y)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(30, 30, 30)
        const reviewLines = doc.splitTextToSize(review.text, 120)
        doc.text(reviewLines, 70, y)
    }

    // Footer
    doc.setFontSize(9)
    doc.setTextColor(160, 160, 160)
    doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 285)
    doc.text('StayHealthy © 2026', 160, 285)

    return doc
}

export default function ReportsPage() {
    usePageTitle('My Reports', 'View and download PDF health reports for your StayHealthy appointments and consultations.')
    const { isAuthenticated } = useSelector((s) => s.auth)
    const { appointments, consultations, reviews } = useSelector((s) => s.bookings)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [previewTitle, setPreviewTitle] = useState('')

    if (!isAuthenticated) return <Navigate to="/login" replace />

    const rows = [
        ...appointments.map((b) => ({ ...b, type: 'appointment' })),
        ...consultations.map((b) => ({ ...b, type: 'consultation' })),
    ]

    const handleView = (booking) => {
        const doc = buildPdf(booking, reviews)
        const blob = doc.output('blob')
        const url = URL.createObjectURL(blob)
        setPreviewTitle(`Report — Dr. ${booking.doctorName}`)
        setPreviewUrl(url)
    }

    const handleDownload = (booking) => {
        const doc = buildPdf(booking, reviews)
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
