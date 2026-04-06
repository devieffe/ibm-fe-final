// Authentication API endpoint
const LOGIN_API_URL = 'https://stayhealthy-api.dev/login'

export async function loginUser(email, password) {
    try {
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
    } catch {
        // Network error or API unavailable — signal caller to use local fallback
        return null
    }
}
