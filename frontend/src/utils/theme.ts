export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

function prefersDark() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement

  // Remove both explicit theme classes first
  root.classList.remove('dark')
  root.classList.remove('theme-dark')

  // Only apply explicit dark class when the explicit theme is 'dark'.
  // We intentionally avoid applying dark based on system preference here so
  // the app theme is controlled only by the persisted user choice (button).
  if (theme === 'dark') {
    root.classList.add('dark')
  }

  try {
    // Persist only valid theme values (we accept 'light'|'dark' here).
    localStorage.setItem(STORAGE_KEY, theme)
  } catch (e) {
    // ignore storage errors
  }
}

export function getStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (!v) return null
    if (v === 'dark' || v === 'light' || v === 'system') return v as Theme
    return null
  } catch (e) {
    return null
  }
}

export function initTheme() {
  // If a user previously selected a theme, honor it. Otherwise default to
  // light so system preference doesn't automatically change the app theme.
  const stored = getStoredTheme()
  if (stored) {
    applyTheme(stored)
    return
  }

  // Default to light to ensure the button/toggle is the only thing that
  // switches between light/dark for the user.
  applyTheme('light')
}

export function toggleTheme() {
  // Toggle between explicit 'light' and 'dark'. If nothing stored assume 'light'.
  const current = getStoredTheme() || 'light'
  const next = current === 'dark' ? 'light' : 'dark'
  applyTheme(next)
}
