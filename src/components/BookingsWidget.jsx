import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { cancelAppointment, cancelConsultation } from '../store/bookingsSlice'

export default function BookingsWidget() {
    const { isAuthenticated } = useSelector((s) => s.auth)
    const { appointments, consultations } = useSelector((s) => s.bookings)
    const dispatch = useDispatch()

    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState('appointments')

    if (!isAuthenticated) return null

    const total = appointments.length + consultations.length

    const items = tab === 'appointments' ? appointments : consultations
    const accentColor = tab === 'appointments' ? '#0d6efd' : '#ff9a3c'
    const accentIcon = tab === 'appointments' ? 'bi-calendar2-check-fill' : 'bi-phone'
    const emptyIcon = tab === 'appointments' ? 'bi-calendar-x' : 'bi-phone'
    const emptyText = tab === 'appointments' ? 'No appointments yet.' : 'No consultations yet.'

    const handleCancel = (id) => {
        if (tab === 'appointments') dispatch(cancelAppointment(id))
        else dispatch(cancelConsultation(id))
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 1050,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.5rem',
        }}>
            {/* ── Expanded panel ── */}
            {open && (
                <div style={{
                    width: '340px',
                    maxHeight: '420px',
                    background: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid #e5e7eb',
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '0.75rem 1rem',
                        background: 'linear-gradient(135deg,#0d6efd,#6610f2)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                            <i className="bi bi-journals me-2"></i>My Bookings
                        </span>
                        <button
                            onClick={() => setOpen(false)}
                            style={{ background: 'none', border: 'none', color: '#fff', lineHeight: 1, padding: '0 2px', cursor: 'pointer', fontSize: '1.1rem' }}
                        >
                            <i className="bi bi-chevron-down"></i>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
                        {['appointments', 'consultations'].map((t) => {
                            const count = t === 'appointments' ? appointments.length : consultations.length
                            const active = tab === t
                            return (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        background: 'none',
                                        border: 'none',
                                        borderBottom: active ? '2px solid #0d6efd' : '2px solid transparent',
                                        color: active ? '#0d6efd' : '#6c757d',
                                        fontWeight: active ? 600 : 400,
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        transition: 'color 0.15s',
                                    }}
                                >
                                    <i className={`bi ${t === 'appointments' ? 'bi-calendar2-check' : 'bi-phone'} me-1`}></i>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                    {count > 0 && (
                                        <span style={{
                                            marginLeft: '0.35rem',
                                            background: t === 'appointments' ? '#0d6efd' : '#ff9a3c',
                                            color: '#fff',
                                            borderRadius: '999px',
                                            padding: '0 5px',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                        }}>{count}</span>
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    {/* List */}
                    <div style={{ overflowY: 'auto', flex: 1, padding: '0.5rem' }}>
                        {items.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#adb5bd' }}>
                                <i className={`bi ${emptyIcon}`} style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.5rem' }}></i>
                                <span style={{ fontSize: '0.85rem' }}>{emptyText}</span>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.6rem',
                                    padding: '0.55rem 0.5rem',
                                    borderBottom: '1px solid #f0f0f0',
                                }}>
                                    <i
                                        className={`bi ${accentIcon}`}
                                        style={{ color: accentColor, fontSize: '1rem', flexShrink: 0 }}
                                    ></i>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            Dr. {item.doctorName}
                                        </div>
                                        <div style={{ color: '#6c757d', fontSize: '0.74rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {tab === 'appointments'
                                                ? `${item.date} at ${item.time}`
                                                : item.slot}
                                            {' · '}{item.specialty}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleCancel(item.id)}
                                        title="Cancel"
                                        style={{
                                            background: 'none',
                                            border: '1px solid #dee2e6',
                                            borderRadius: '6px',
                                            padding: '2px 6px',
                                            cursor: 'pointer',
                                            color: '#dc3545',
                                            fontSize: '0.75rem',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* ── FAB button ── */}
            <button
                onClick={() => setOpen((v) => !v)}
                title="My Bookings"
                style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#0d6efd,#6610f2)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1.3rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(13,110,253,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'transform 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <i className={`bi ${open ? 'bi-x-lg' : 'bi-journals'}`}></i>
                {!open && total > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        background: '#dc3545',
                        color: '#fff',
                        borderRadius: '999px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        minWidth: '17px',
                        height: '17px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 3px',
                        lineHeight: 1,
                    }}>{total}</span>
                )}
            </button>
        </div>
    )
}
