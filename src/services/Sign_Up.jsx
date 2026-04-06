// Set to your real API endpoint to enable server registration.
// When null the app falls back to local localStorage storage.
const REGISTER_API_URL = null // e.g. 'https://api.stayhealthy.dev/register'

export async function registerUser(payload) {
    if (!REGISTER_API_URL) return null  // signal to use local fallback

    const response = await fetch(REGISTER_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        return {
            success: false,
            error: data.message || `Registration failed (${response.status}).`,
            user: null,
        }
    }

    return { success: true, error: null, user: data.user ?? data }
}
