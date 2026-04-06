/**
 * Notification component
 *
 * Props:
 *   message     {string}   — text to display
 *   type        {'success'|'danger'|'warning'|'info'}  — Bootstrap colour variant, default 'info'
 *   dismissible {boolean}  — show × close button, default true
 *   onDismiss   {function} — called when dismissed
 *   icon        {string}   — Bootstrap Icon class, auto-selected if omitted
 *   autoHide    {boolean}  — fade out after 3 s and call onDismiss, default true for success
 */

import { useEffect, useRef, useState } from 'react'

const defaultIcons = {
    success: 'bi-check-circle-fill',
    danger: 'bi-x-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill',
}

export default function Notification({
    message,
    type = 'info',
    dismissible = true,
    onDismiss,
    icon,
    autoHide,
}) {
    const shouldAutoHide = autoHide !== undefined ? autoHide : type === 'success'
    const [visible, setVisible] = useState(true)
    const [fading, setFading] = useState(false)
    const timerRef = useRef(null)

    useEffect(() => {
        setVisible(true)
        setFading(false)
        if (shouldAutoHide && message) {
            timerRef.current = setTimeout(() => {
                setFading(true)
                setTimeout(() => {
                    setVisible(false)
                    if (onDismiss) onDismiss()
                }, 500)
            }, 3000)
        }
        return () => clearTimeout(timerRef.current)
    }, [message])

    if (!message || !visible) return null

    const iconClass = icon || defaultIcons[type] || defaultIcons.info

    return (
        <div
            style={{
                position: 'fixed',
                top: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                minWidth: '320px',
                maxWidth: '560px',
                transition: 'opacity 0.5s ease',
                opacity: fading ? 0 : 1,
            }}
        >
            <div
                className={`alert alert-${type} d-flex align-items-center gap-2 shadow ${dismissible ? 'alert-dismissible' : ''}`}
                role="alert"
            >
                <i className={`bi ${iconClass} flex-shrink-0`}></i>
                <span>{message}</span>
                {dismissible && (
                    <button
                        type="button"
                        className="btn-close ms-auto"
                        aria-label="Dismiss"
                        onClick={() => {
                            clearTimeout(timerRef.current)
                            setFading(true)
                            setTimeout(() => {
                                setVisible(false)
                                if (onDismiss) onDismiss()
                            }, 500)
                        }}
                    />
                )}
            </div>
        </div>
    )
}
