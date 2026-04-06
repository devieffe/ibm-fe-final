import { useMemo } from 'react'
import doctors from '../data/doctors'

/**
 * FindDoctorSearch — specialty picker that filters the doctor list.
 * Props:
 *   value          — currently selected specialty string (or '')  [select mode]
 *   onChange       — called with a doctor object when one is selected [select mode, unused here]
 *   onQueryChange  — called with the selected specialty string      [filter mode]
 *   placeholder    — select placeholder text
 */
export default function FindDoctorSearch({ onQueryChange, placeholder = 'Filter by specialty…' }) {
    const specialties = useMemo(() => {
        const seen = new Set()
        const list = []
        doctors.forEach((d) => {
            if (!seen.has(d.specialty)) {
                seen.add(d.specialty)
                list.push(d.specialty)
            }
        })
        return list.sort()
    }, [])

    const handleChange = (e) => {
        onQueryChange?.(e.target.value)
    }

    return (
        <div className="input-group">
            <span className="input-group-text bg-white">
                <i className="bi bi-funnel text-muted"></i>
            </span>
            <select
                className="form-select border-start-0"
                defaultValue=""
                onChange={handleChange}
            >
                <option value="">{placeholder}</option>
                {specialties.map((s) => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>
        </div>
    )
}
