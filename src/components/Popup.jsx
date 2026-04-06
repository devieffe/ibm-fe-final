/**
 * Popup — generic lightbox overlay / modal container.
 *
 * Props:
 *   onClose    — called when backdrop or × button is clicked
 *   title      — optional heading text
 *   subtitle   — optional small text below title
 *   children   — modal body content
 *   maxWidth   — CSS max-width string, default '520px'
 *   closeBtn   — show × button, default true
 */
export default function Popup({ onClose, title, subtitle, children, maxWidth = '520px', closeBtn = true }) {
    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose()
    }

    return (
        <div className="popup-overlay" onClick={handleBackdrop}>
            <div className="popup-modal text-start" style={{ maxWidth }}>
                {closeBtn && (
                    <button
                        type="button"
                        className="btn-close popup-close"
                        aria-label="Close"
                        onClick={onClose}
                    />
                )}
                {title && <h5 className="mb-1">{title}</h5>}
                {subtitle && <p className="text-muted small mb-3">{subtitle}</p>}
                {children}
            </div>
        </div>
    )
}
