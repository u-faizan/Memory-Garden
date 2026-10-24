import type { Photo } from '../lib/db'

// One object URL per stored photo blob, shared by every view of that photo.
const urls = new WeakMap<Blob, string>()
export function photoUrl(photo?: Photo) {
  if (!photo) return undefined
  let url = urls.get(photo.blob)
  if (!url) { url = URL.createObjectURL(photo.blob); urls.set(photo.blob, url) }
  return url
}

export function formatDate(value: string) {
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return value
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
}
