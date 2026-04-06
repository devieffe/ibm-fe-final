export default function ReviewCard({ text, name, role, rating = 5 }) {
    return (
        <div className="card h-100 shadow-sm review-card">
            <div className="card-body">
                <p className="card-text">"{text}"</p>
                <div className="mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <i
                            key={star}
                            className={`bi ${star <= rating ? 'bi-star-fill text-warning' : 'bi-star text-secondary'
                                } me-1`}
                        ></i>
                    ))}
                </div>
                <p className="mb-1 fw-bold">{name}</p>
                {role && <small className="text-muted">{role}</small>}
            </div>
        </div>
    )
}
