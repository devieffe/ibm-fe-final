/**
 * UserName — renders a formatted display name based on role.
 * Doctors automatically get the "Dr." prefix.
 *
 * Props:
 *   name  {string}  — the user's full name
 *   role  {string}  — 'Doctor' | 'Patient' (or any other role)
 *   tag   {string}  — HTML tag to wrap with, default 'span'
 *   className {string} — optional extra classes
 */
export default function UserName({ name, role, tag: Tag = 'span', className = '' }) {
    const prefix = role === 'Doctor' ? 'Dr. ' : ''
    return <Tag className={className}>{prefix}{name}</Tag>
}
