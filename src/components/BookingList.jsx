import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Popup from './Popup'

/**
 * BookingList — reusable list of bookings with details popup and cancel.
 *
 * Props:
 *   items         — array of booking objects from Redux
 *   onCancel      — action creator to dispatch with item.id
 *   emptyIcon     — bootstrap icon class for empty state
 *   emptyText     — text shown when no items
 *   accentColor   — Bootstrap color name: 'primary' | 'warning' | etc.
 *   accentIcon    — bootstrap icon class for the list row icon
 *   renderSummary — fn(item) → short summary string shown in the row
 *   renderDetails — fn(item) → JSX shown inside the details popup
 *   detailsTitle  — fn(item) → string used as popup title
 */
export default function BookingList({
    items,
    onCancel,
    emptyIcon = 'bi-calendar-x',
    emptyText = 'Nothing here yet.',
    accentColor = 'primary',
    accentIcon = 'bi-calendar2-check-fill',
    renderSummary,
    renderDetails,
    detailsTitle,
}) {
    const dispatch = useDispatch()
    const [selected, setSelected] = useState(null)
    const [confirmId, setConfirmId] = useState(null)

    const handleCancel = (id) => {
        dispatch(onCancel(id))
        if (selected?.id === id) setSelected(null)
        setConfirmId(null)
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-5 text-muted">
                <i className={`bi ${emptyIcon} fs-1 d-block mb-2`}></i>
                {emptyText}
            </div>
        )
    }

    return (
        <>
            {/* ── List ── */}
            <div className="d-flex flex-column gap-2">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`card shadow-sm booking-list-row${selected?.id === item.id ? ' border-' + accentColor : ''}`}
                    >
                        <div className="card-body py-3 d-flex align-items-center gap-3">
                            <i className={`bi ${accentIcon} text-${accentColor} fs-4 flex-shrink-0`}></i>

                            <div className="flex-grow-1 min-w-0">
                                <div className="fw-semibold">Dr. {item.doctorName}</div>
                                <small className="text-muted">{renderSummary(item)}</small>
                            </div>

                            <div className="d-flex gap-2 flex-shrink-0">
                                <button
                                    className={`btn btn-sm btn-outline-${accentColor}`}
                                    onClick={() => setSelected(item)}
                                >
                                    <i className="bi bi-eye me-1"></i>Details
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => setConfirmId(item.id)}
                                >
                                    <i className="bi bi-x-lg me-1"></i>Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Details popup ── */}
            {selected && (
                <Popup
                    onClose={() => setSelected(null)}
                    title={detailsTitle ? detailsTitle(selected) : `Dr. ${selected.doctorName}`}
                    maxWidth="460px"
                >
                    {renderDetails(selected)}
                    <div className="d-flex gap-2 mt-4">
                        <button
                            className="btn btn-outline-danger flex-grow-1"
                            onClick={() => setConfirmId(selected.id)}
                        >
                            <i className="bi bi-x-lg me-1"></i>Cancel this booking
                        </button>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => setSelected(null)}
                        >
                            Close
                        </button>
                    </div>
                </Popup>
            )}

            {/* ── Cancel confirm popup ── */}
            {confirmId !== null && (
                <Popup
                    onClose={() => setConfirmId(null)}
                    title="Cancel booking?"
                    maxWidth="380px"
                >
                    <p className="text-muted mb-4">This action cannot be undone. Are you sure you want to cancel this booking?</p>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-danger flex-grow-1"
                            onClick={() => handleCancel(confirmId)}
                        >
                            Yes, cancel it
                        </button>
                        <button
                            className="btn btn-outline-secondary flex-grow-1"
                            onClick={() => setConfirmId(null)}
                        >
                            Keep it
                        </button>
                    </div>
                </Popup>
            )}
        </>
    )
}
