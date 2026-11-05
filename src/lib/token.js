const SESSION_DURATION_MS = 48 * 60 * 60 * 1000

export function getTokenExpiry(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return 0
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const { exp, iat } = JSON.parse(atob(payload))
    if (!Number.isFinite(exp) || !Number.isFinite(iat)) return 0
    return Math.min(exp * 1000, iat * 1000 + SESSION_DURATION_MS)
  } catch {
    return 0
  }
}
