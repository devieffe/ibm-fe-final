// Set to your real API endpoint to enable server authentication.
// When null the app falls back to local localStorage authentication.
const LOGIN_API_URL = null // e.g. 'https://api.stayhealthy.dev/login'

export async function loginUser(email, password) {
    if (!LOGIN_API_URL) return null  // signal to use local fallback

    const response = await fetch(LOGIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        return { success: false, error: data.message || 'Invalid email or password.' }
    }

    return { success: true, user: data.user ?? data }
}
