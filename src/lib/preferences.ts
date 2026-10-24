// Slice 1 keeps the "introduction seen" flag in local storage. It moves to the
// IndexedDB preferences store with the repository in slice 2.
const introKey = 'memorygarden.introSeen'

export function hasSeenIntro() {
  try { return localStorage.getItem(introKey) === '1' } catch { return false }
}

export function rememberIntro() {
  try { localStorage.setItem(introKey, '1') } catch { /* Private mode: the intro simply plays again. */ }
}
