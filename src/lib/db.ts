import { openDB, type DBSchema } from 'idb'
import type { FlowerType } from '../garden/flowers'
import type { SpotId } from '../garden/layouts'

// Browser-local storage. Each browser profile keeps its own garden; clearing
// site data removes it. Nothing here is synced or encrypted.
export interface Photo { blob: Blob; width: number; height: number }
export interface Entry {
  id: string
  title: string
  story: string
  feeling: string
  memoryDate: string
  flowerType: FlowerType
  photo?: Photo
}
export interface Memory extends Entry { page: number; spotId: SpotId; createdAt: number; updatedAt: number }
export interface Draft extends Entry { page: number; spotId: SpotId; savedAt: number }

interface Schema extends DBSchema {
  memories: { key: string; value: Memory }
  drafts: { key: string; value: Draft }
}

const db = openDB<Schema>('memorygarden', 1, {
  upgrade(database) {
    database.createObjectStore('memories', { keyPath: 'id' })
    database.createObjectStore('drafts')
  },
})

export const store = {
  async memories() { return (await db).getAll('memories') },
  // Saving the memory and clearing its draft happen in one transaction; the
  // stable id makes a repeated Plant click update rather than duplicate.
  async plant(memory: Memory) {
    const tx = (await db).transaction(['memories', 'drafts'], 'readwrite')
    await tx.objectStore('memories').put(memory)
    await tx.objectStore('drafts').delete('active')
    await tx.done
  },
  async update(memory: Memory) { await (await db).put('memories', memory) },
  async remove(id: string) { await (await db).delete('memories', id) },
  async draft() { return (await db).get('drafts', 'active') },
  async saveDraft(draft: Draft) { await (await db).put('drafts', draft, 'active') },
  async discardDraft() { await (await db).delete('drafts', 'active') },
}

export const today = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}
export const newId = () => crypto.randomUUID()
