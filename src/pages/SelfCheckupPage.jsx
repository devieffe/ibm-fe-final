import { useState } from 'react'
import Popup from '../components/Popup'

/* ─── Know-more content ─────────────────────────────────── */
const MORE_INFO = {
    temperature: {
        title: 'Body Temperature — Know More',
        body: (
            <>
                <h6 className="fw-bold">What is a normal body temperature?</h6>
                <p>
                    The average adult body temperature is <strong>36.1 °C – 37.2 °C (97 °F – 99 °F)</strong>.
                    It can vary slightly with age, time of day, and measurement site.
                </p>
                <h6 className="fw-bold mt-3">Types of thermometers</h6>
                <ul>
                    <li><strong>Digital oral</strong> — most common; place under tongue for ~30 s.</li>
                    <li><strong>Infrared ear / forehead</strong> — fast, non-contact; good for children.</li>
                    <li><strong>Mercury glass</strong> — accurate but being phased out; shake down before use.</li>
                </ul>
                <h6 className="fw-bold mt-3">When to be concerned</h6>
                <table className="table table-sm table-bordered">
                    <thead className="table-light">
                        <tr><th>Temperature</th><th>Meaning</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>&lt; 35 °C (95 °F)</td><td className="text-primary">Hypothermia — seek warmth & medical help</td></tr>
                        <tr><td>36.1 – 37.2 °C</td><td className="text-success">Normal range</td></tr>
                        <tr><td>37.3 – 38 °C</td><td className="text-warning">Low-grade fever — rest & fluids</td></tr>
                        <tr><td>38.1 – 39.4 °C</td><td className="text-orange">Fever — consider paracetamol, see doctor if persists</td></tr>
                        <tr><td>&gt; 39.5 °C (103 °F)</td><td className="text-danger">High fever — see a doctor soon</td></tr>
                    </tbody>
                </table>
                <p className="text-muted small mb-0">
                    Tip: Take the reading at the same time each day for the most consistent results.
                </p>
            </>
        ),
    },
    blood_pressure: {
        title: 'Blood Pressure — Know More',
        body: (
            <>
                <h6 className="fw-bold">What do the numbers mean?</h6>
                <p>
                    Blood pressure is expressed as <strong>Systolic / Diastolic mmHg</strong>.
                    Systolic is the pressure when your heart beats; diastolic is when it rests.
                </p>
                <table className="table table-sm table-bordered">
                    <thead className="table-light">
                        <tr><th>Category</th><th>Systolic</th><th></th><th>Diastolic</th></tr>
                    </thead>
                    <tbody>
                        <tr><td className="text-primary fw-semibold">Low (Hypotension)</td><td>&lt; 90</td><td>and/or</td><td>&lt; 60</td></tr>
                        <tr><td className="text-success fw-semibold">Normal</td><td>90 – 119</td><td>and</td><td>60 – 79</td></tr>
                        <tr><td className="text-warning fw-semibold">Elevated</td><td>120 – 129</td><td>and</td><td>&lt; 80</td></tr>
                        <tr><td className="text-orange fw-semibold">High Stage 1</td><td>130 – 139</td><td>or</td><td>80 – 89</td></tr>
                        <tr><td className="text-danger fw-semibold">High Stage 2</td><td>≥ 140</td><td>or</td><td>≥ 90</td></tr>
                    </tbody>
                </table>
                <h6 className="fw-bold mt-3">How to measure correctly</h6>
                <ol>
                    <li>Sit quietly for <strong>5 minutes</strong> before measuring.</li>
                    <li>Place the cuff on your <strong>bare upper arm</strong>, at heart level.</li>
                    <li>Don't talk or move during the reading.</li>
                    <li>Take <strong>two readings, 1 minute apart</strong>, and record the average.</li>
                    <li>Avoid caffeine, exercise, or smoking for at least <strong>30 minutes</strong> beforehand.</li>
                </ol>
                <p className="text-muted small mb-0">
                    If readings are consistently ≥ 130/80 mmHg, consult a doctor.
                </p>
            </>
        ),
    },
    weight: {
        title: 'Body Weight & BMI — Know More',
        body: (
            <>
                <h6 className="fw-bold">Body Mass Index (BMI)</h6>
                <p>
                    BMI is calculated as <strong>weight (kg) ÷ height² (m²)</strong>. It's a general
                    indicator — not a diagnostic tool.
                </p>
                <table className="table table-sm table-bordered">
                    <thead className="table-light">
                        <tr><th>BMI</th><th>Category</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>&lt; 18.5</td><td className="text-primary">Underweight</td></tr>
                        <tr><td>18.5 – 24.9</td><td className="text-success">Normal weight</td></tr>
                        <tr><td>25 – 29.9</td><td className="text-warning">Overweight</td></tr>
                        <tr><td>30 – 34.9</td><td className="text-orange">Obese (Class I)</td></tr>
                        <tr><td>≥ 35</td><td className="text-danger">Obese (Class II–III)</td></tr>
                    </tbody>
                </table>
                <h6 className="fw-bold mt-3">How to weigh yourself accurately</h6>
                <ul>
                    <li>Weigh yourself in the <strong>morning</strong>, after using the toilet, before eating.</li>
                    <li>Use the same scale, on a <strong>hard flat surface</strong>, each time.</li>
                    <li>Wear light or no clothing.</li>
                    <li>Track trends over weeks, not day-to-day fluctuations.</li>
                </ul>
                <h6 className="fw-bold mt-3">BMI Calculator</h6>
                <BmiCalc />
            </>
        ),
    },
}

/* ─── Inline BMI calculator (used inside Know More for weight) ── */
function BmiCalc() {
    const [kg, setKg] = useState('')
    const [cm, setCm] = useState('')
    const bmi = kg && cm ? (parseFloat(kg) / Math.pow(parseFloat(cm) / 100, 2)).toFixed(1) : null
    const cat =
        bmi === null ? null
        : bmi < 18.5 ? { label: 'Underweight', cls: 'text-primary' }
        : bmi < 25   ? { label: 'Normal weight', cls: 'text-success' }
        : bmi < 30   ? { label: 'Overweight', cls: 'text-warning' }
        : bmi < 35   ? { label: 'Obese (Class I)', cls: 'text-orange' }
        :               { label: 'Obese (Class II–III)', cls: 'text-danger' }

    return (
        <div className="border rounded p-3 bg-light">
            <div className="row g-2 align-items-end">
                <div className="col">
                    <label className="form-label small mb-1">Weight (kg)</label>
                    <input type="number" className="form-control form-control-sm" placeholder="e.g. 72"
                        value={kg} onChange={e => setKg(e.target.value)} min="1" max="300" />
                </div>
                <div className="col">
                    <label className="form-label small mb-1">Height (cm)</label>
                    <input type="number" className="form-control form-control-sm" placeholder="e.g. 175"
                        value={cm} onChange={e => setCm(e.target.value)} min="50" max="250" />
                </div>
            </div>
            {cat && (
                <div className="mt-2 text-center">
                    <span className="fw-bold fs-4">{bmi}</span>
                    <span className={`ms-2 fw-semibold ${cat.cls}`}>{cat.label}</span>
                </div>
            )}
        </div>
    )
}

/* ─── Step definitions ──────────────────────────────────── */
const STEPS = [
    {
        id: 'temperature',
        icon: 'bi-thermometer-half',
        iconColor: 'text-danger',
        title: 'Step 1 — Body Temperature',
        alwaysShow: true,
        deviceNote: null,
        instructions: [
            { text: 'Wash your hands before and after handling the thermometer.' },
            { text: 'If using an oral thermometer, make sure you haven\'t eaten or drunk anything hot or cold for at least 15 minutes.' },
            { text: 'Place the thermometer under your tongue (or as directed by your device).' },
            { text: 'Wait for the beep or the time indicated on your device.' },
            { text: 'Read and record the temperature. Normal range: 36.1 °C – 37.2 °C (97 °F – 99 °F).' },
        ],
        moreKey: 'temperature',
    },
    {
        id: 'blood_pressure',
        icon: 'bi-heart-pulse',
        iconColor: 'text-primary',
        title: 'Step 2 — Blood Pressure',
        alwaysShow: false,
        deviceNote: 'Do you have a blood pressure monitor (sphygmomanometer)?',
        instructions: [
            { text: 'Sit comfortably with your back supported and feet flat on the floor.' },
            { text: 'Rest quietly for at least 5 minutes before measuring.' },
            { text: 'Wrap the cuff snugly around your bare upper arm, about 2 cm above the elbow.' },
            { text: 'Keep your arm relaxed at heart level, palm facing up.' },
            { text: 'Press Start and remain still until the reading is complete.' },
            { text: 'Record both numbers: Systolic / Diastolic (e.g. 120 / 80 mmHg).' },
            { text: 'Take a second reading after 1 minute and average the two.' },
        ],
        moreKey: 'blood_pressure',
    },
    {
        id: 'weight',
        icon: 'bi-person-arms-up',
        iconColor: 'text-success',
        title: 'Step 3 — Body Weight',
        alwaysShow: false,
        deviceNote: 'Do you have a bathroom scale?',
        instructions: [
            { text: 'Use the scale in the morning, right after waking up and using the toilet.' },
            { text: 'Place the scale on a hard, flat surface — not carpet.' },
            { text: 'Remove your shoes and wear light clothing (or none).' },
            { text: 'Step on the scale and stand still until the reading stabilises.' },
            { text: 'Record your weight. Track trends weekly rather than daily fluctuations.' },
        ],
        moreKey: 'weight',
    },
]

/* ─── Single step card ──────────────────────────────────── */
function StepCard({ step, index, total, onKnowMore }) {
    const [hasDevice, setHasDevice] = useState(null) // null | true | false

    const showContent = step.alwaysShow || hasDevice === true

    return (
        <div className={`card shadow-sm mb-4 border-0 ${showContent ? 'border-start border-4' : ''}`}
            style={showContent ? { borderLeftColor: 'var(--bs-success)' } : {}}>
            <div className="card-body">
                {/* Header */}
                <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                        style={{ width: 52, height: 52, flexShrink: 0 }}>
                        <i className={`bi ${step.icon} ${step.iconColor} fs-3`}></i>
                    </div>
                    <div>
                        <h5 className="mb-0">{step.title}</h5>
                        <small className="text-muted">Step {index + 1} of {total}</small>
                    </div>
                </div>

                {/* Device question (optional steps) */}
                {!step.alwaysShow && hasDevice === null && (
                    <div className="alert alert-light border d-flex flex-column flex-sm-row align-items-sm-center gap-2">
                        <i className="bi bi-question-circle text-muted fs-5 flex-shrink-0"></i>
                        <span className="flex-grow-1">{step.deviceNote}</span>
                        <div className="d-flex gap-2 flex-shrink-0">
                            <button className="btn btn-sm btn-success" onClick={() => setHasDevice(true)}>
                                <i className="bi bi-check-lg me-1"></i>Yes, I have one
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setHasDevice(false)}>
                                <i className="bi bi-x-lg me-1"></i>No, skip
                            </button>
                        </div>
                    </div>
                )}

                {/* Skipped */}
                {hasDevice === false && (
                    <div className="text-muted fst-italic d-flex align-items-center gap-2">
                        <i className="bi bi-skip-forward-circle text-secondary fs-5"></i>
                        <span>Skipped — no device available.
                            <button className="btn btn-link btn-sm p-0 ms-1" onClick={() => setHasDevice(null)}>
                                Undo
                            </button>
                        </span>
                    </div>
                )}

                {/* Instructions */}
                {showContent && (
                    <>
                        <ol className="mb-3">
                            {step.instructions.map((inst, i) => (
                                <li key={i} className="mb-1">{inst.text}</li>
                            ))}
                        </ol>
                        <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => onKnowMore(step.moreKey)}
                        >
                            <i className="bi bi-info-circle me-2"></i>Know more
                        </button>
                        {!step.alwaysShow && (
                            <button
                                className="btn btn-sm btn-link text-muted ms-2"
                                onClick={() => setHasDevice(null)}
                            >
                                Change answer
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

/* ─── Page ──────────────────────────────────────────────── */
export default function SelfCheckupPage() {
    const [moreKey, setMoreKey] = useState(null)

    const info = moreKey ? MORE_INFO[moreKey] : null

    return (
        <>
            <div className="container mt-4">
                <div className="hero mb-4">
                    <i className="bi bi-clipboard2-pulse-fill text-success hero-icon"></i>
                    <h1 className="mt-2">Self Health Check-Up</h1>
                    <p className="lead text-muted" style={{ maxWidth: 560 }}>
                        Follow these guided steps to assess your basic health indicators at home.
                        Take each reading carefully and record the results.
                    </p>
                </div>

                {/* Progress hint */}
                <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
                    <i className="bi bi-lightbulb-fill fs-5 flex-shrink-0"></i>
                    <span>
                        Work through each step in order. For optional steps, answer the device question
                        to either get full instructions or skip.
                    </span>
                </div>

                {STEPS.map((step, i) => (
                    <StepCard
                        key={step.id}
                        step={step}
                        index={i}
                        total={STEPS.length}
                        onKnowMore={setMoreKey}
                    />
                ))}

                {/* Completion card */}
                <div className="card border-success shadow-sm mb-5">
                    <div className="card-body text-center py-4">
                        <i className="bi bi-patch-check-fill text-success fs-1 mb-2 d-block"></i>
                        <h5>Check-up Complete!</h5>
                        <p className="text-muted mb-3">
                            Keep a note of your readings and compare them over time.
                            If any value is outside the normal range, consider speaking to a doctor.
                        </p>
                        <a href="/appointments" className="btn btn-primary me-2">
                            <i className="bi bi-calendar2-check me-1"></i>Book Appointment
                        </a>
                        <a href="/consultations" className="btn btn-orange">
                            <i className="bi bi-phone me-1"></i>Instant Consultation
                        </a>
                    </div>
                </div>
            </div>

            {/* Know More popup */}
            {info && (
                <Popup
                    onClose={() => setMoreKey(null)}
                    title={info.title}
                    maxWidth="640px"
                >
                    {info.body}
                </Popup>
            )}
        </>
    )
}
