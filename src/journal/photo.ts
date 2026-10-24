import type { Photo } from '../lib/db'

// Photos stay in this browser: decoded, resized to at most 1600 px and saved
// as WebP. Nothing is uploaded anywhere.
const accepted = ['image/jpeg', 'image/png', 'image/webp']

export async function preparePhoto(file: File): Promise<Photo> {
  if (!accepted.includes(file.type)) throw new Error('Please choose a JPEG, PNG or WebP photo.')
  if (file.size > 5_000_000) throw new Error('That photo is larger than 5 MB. Please choose a smaller one.')
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }).catch(() => { throw new Error('That photo could not be opened.') })
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale), height = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width; canvas.height = height
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', .82))
  if (!blob) throw new Error('That photo could not be prepared.')
  return { blob, width, height }
}
