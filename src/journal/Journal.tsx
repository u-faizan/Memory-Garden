import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { availableFlowers, flowerArt, flowerInfo } from '../garden/flowers'
import type { SpotId } from '../garden/layouts'
import { store, type Entry, type Memory } from '../lib/db'
import { photoUrl } from './format'
import { PageLayout } from './PageLayout'
import { preparePhoto } from './photo'
import { Sprig } from '../components/book/BookArt'

export type Session =
  | { kind: 'new'; entry: Entry; page: number; spotId: SpotId; resumed: boolean }
  | { kind: 'memory'; memory: Memory }

interface Props {
  session: Session | null
  onClose: () => void
  onPlant: (entry: Entry, page: number, spotId: SpotId) => Promise<void>
  onUpdate: (memory: Memory) => Promise<void>
  onDelete: (memory: Memory) => Promise<void>
}

type Mode = 'write' | 'preview' | 'read' | 'confirm-delete' | 'confirm-discard'
function problem(entry: Entry) {
  if (!entry.title.trim()) return 'Give this memory a title.'
  const length = [...entry.story.trim()].length
  if (length < 10) return 'Write at least a few words of your story (10 characters or more).'
  if (length > 2000) return 'Your story is longer than 2,000 characters. Please shorten it a little.'
  return ''
}

export function Journal({ session, onClose, onPlant, onUpdate, onDelete }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [mode, setMode] = useState<Mode>('write')
  const [entry, setEntry] = useState<Entry | null>(null)
  const [dirty, setDirty] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [loadedFor, setLoadedFor] = useState<Session | null>(null)

  // Adopt a new session during render (no effect round-trip).
  if (session !== loadedFor) {
    setLoadedFor(session)
    if (session) {
      setEntry(session.kind === 'new' ? session.entry : session.memory)
      setMode(session.kind === 'new' ? 'write' : 'read')
      setDirty(false); setError(''); setBusy(false)
      setStatus(session.kind === 'new' && session.resumed ? 'Draft restored' : '')
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (session && !dialog.open) dialog.showModal()
    if (!session && dialog.open) dialog.close()
  }, [session])

  // Each mode (write, preview, read) starts at the top of the page.
  useEffect(() => { dialogRef.current?.scrollTo({ top: 0 }) }, [mode])

  // Autosave unfinished writing for a new memory, shortly after each change.
  const isNew = session?.kind === 'new'
  useEffect(() => {
    if (!isNew || !dirty || !entry || session?.kind !== 'new') return
    const { page, spotId } = session
    const timer = setTimeout(() => {
      store.saveDraft({ ...entry, page, spotId, savedAt: Date.now() })
        .then(() => setStatus('Draft saved'))
        .catch(() => setStatus('Draft could not be saved in this browser'))
    }, 600)
    return () => clearTimeout(timer)
  }, [entry, dirty, isNew, session])

  if (!session || !entry) return <dialog ref={dialogRef} className="journal" aria-label="Memory journal" />

  const change = (patch: Partial<Entry>) => { setEntry({ ...entry, ...patch }); setDirty(true); setError(''); setStatus('Saving…') }
  const editingMemory = session.kind === 'memory' ? session.memory : null
  const flower = flowerInfo(entry.flowerType)

  async function addPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try { change({ photo: await preparePhoto(file) }) } catch (reason) { setError((reason as Error).message) }
  }
  async function close() {
    if (session?.kind === 'new' && dirty) await store.saveDraft({ ...entry!, page: session.page, spotId: session.spotId, savedAt: Date.now() }).catch(() => undefined)
    onClose()
  }
  async function plant() {
    const issue = problem(entry!)
    if (issue) { setError(issue); setMode('write'); return }
    if (busy) return
    setBusy(true)
    try {
      if (session?.kind === 'new') await onPlant(entry!, session.page, session.spotId)
      else if (editingMemory) { await onUpdate({ ...editingMemory, ...entry!, updatedAt: Date.now() }); setMode('read'); setDirty(false) }
    } catch {
      setError('This memory could not be saved in this browser. Your writing is still here — please try again.')
    } finally { setBusy(false) }
  }

  const actionLabel = session.kind === 'new' ? 'Plant this memory' : 'Save changes'
  return <dialog ref={dialogRef} className="journal" aria-labelledby="journal-heading"
    onCancel={event => { event.preventDefault(); if (mode === 'confirm-delete' || mode === 'confirm-discard') setMode(editingMemory ? 'read' : 'write'); else void close() }}>
    <article className={`journal-book journal-book--${mode}`}>
      <button className="journal-close" onClick={() => void close()} aria-label="Back to garden">×</button>

      {mode === 'write' && <form className="journal-write" onSubmit={event => { event.preventDefault(); void plant() }}>
        <section className="journal-page journal-page--left">
          <p className="journal-eyebrow" id="journal-heading">{editingMemory ? 'Editing a page' : 'A new page in your garden'}</p>
          <label className="field field--title"><span className="visually-hidden">Title</span>
            <input value={entry.title} maxLength={100} placeholder="Give this memory a title" onChange={e => change({ title: e.target.value })} autoFocus />
          </label>
          <div className="field-row">
            <label className="field field--date"><span>Date</span>
              <input type="date" value={entry.memoryDate} onChange={e => change({ memoryDate: e.target.value })} required />
            </label>
            <label className="field field--feeling"><span>Feeling <em>(optional)</em></span>
              <input value={entry.feeling} maxLength={120} placeholder={flower.meaning} onChange={e => change({ feeling: e.target.value })} />
            </label>
          </div>
          <label className="field field--story"><span>What moment would you like to remember?</span>
            <textarea value={entry.story} maxLength={2000} rows={9} placeholder="Write it the way you want to remember it…" onChange={e => change({ story: e.target.value })} />
          </label>
          <p className="field-count" aria-live="polite">{[...entry.story].length} / 2,000</p>
        </section>
        <section className="journal-page journal-page--right">
          <div className="photo-slot">
            {entry.photo
              ? <><img src={photoUrl(entry.photo)} alt="Selected photograph" /><button type="button" className="photo-remove" onClick={() => change({ photo: undefined })}>Remove photo</button></>
              : <label className="photo-add"><input type="file" accept="image/jpeg,image/png,image/webp" className="visually-hidden" onChange={e => void addPhoto(e)} />
                <span className="photo-add-mark" aria-hidden="true">＋</span><span>Add a photograph</span><small>optional · JPEG, PNG or WebP up to 5 MB</small></label>}
          </div>
          <fieldset className="packets"><legend>Choose a flower</legend>
            {availableFlowers.map(option => <label key={option.id} className={`packet ${entry.flowerType === option.id ? 'packet--chosen' : ''}`}>
              <input type="radio" name="flower" className="visually-hidden" checked={entry.flowerType === option.id} onChange={() => change({ flowerType: option.id })} />
              <img src={flowerArt(option.id, 'bloom')} alt="" /><strong>{option.name}</strong><span>{option.meaning}</span>
            </label>)}
          </fieldset>
          <div className="journal-actions">
            <p className="journal-status" role="status">{error ? '' : status}</p>
            {error && <p className="journal-error" role="alert">{error}</p>}
            <div className="journal-buttons">
              {session.kind === 'new' && (dirty || session.resumed) && <button type="button" className="journal-link" onClick={() => setMode('confirm-discard')}>Discard draft</button>}
              {editingMemory && <button type="button" className="journal-secondary" onClick={() => { setEntry(editingMemory); setMode('read'); setError('') }}>Cancel</button>}
              <button type="button" className="journal-secondary" onClick={() => { const issue = problem(entry); if (issue) setError(issue); else setMode('preview') }}>Preview</button>
              <button type="submit" className="journal-primary" disabled={busy}><Sprig className="button-sprig" gold={false} />{busy ? 'Planting…' : actionLabel}</button>
            </div>
          </div>
        </section>
      </form>}

      {(mode === 'preview' || mode === 'read' || mode === 'confirm-delete') && <div className="journal-reader">
        <p className="visually-hidden" id="journal-heading">{mode === 'preview' ? 'Preview of your page' : entry.title}</p>
        <PageLayout entry={entry} />
        <div className="journal-reader-actions">
          {mode === 'preview' ? <>
            <button className="journal-secondary" onClick={() => setMode('write')}>Back to writing</button>
            <button className="journal-primary" onClick={() => void plant()} disabled={busy}><Sprig className="button-sprig" gold={false} />{busy ? 'Planting…' : actionLabel}</button>
          </> : <>
            <button className="journal-link journal-link--danger" onClick={() => setMode('confirm-delete')}>Delete…</button>
            <button className="journal-secondary" onClick={() => setMode('write')}>Edit page</button>
            <button className="journal-primary" onClick={() => void close()}>Back to garden</button>
          </>}
        </div>
        {error && <p className="journal-error" role="alert">{error}</p>}
      </div>}

      {(mode === 'confirm-delete' || mode === 'confirm-discard') && <div className="journal-confirm" role="alertdialog" aria-labelledby="confirm-title" aria-describedby="confirm-text">
        <div className="confirm-card">
          <h3 id="confirm-title">{mode === 'confirm-delete' ? 'Let this memory go?' : 'Discard this draft?'}</h3>
          <p id="confirm-text">{mode === 'confirm-delete' ? 'This will remove the memory and its flower from your garden. This action cannot be undone.' : 'Your unfinished writing will be removed from this browser.'}</p>
          <div className="confirm-buttons">
            <button className="journal-primary" autoFocus onClick={() => setMode(mode === 'confirm-delete' ? 'read' : 'write')}>{mode === 'confirm-delete' ? 'Keep My Memory' : 'Keep Writing'}</button>
            <button className="journal-danger" onClick={() => {
              if (mode === 'confirm-delete' && editingMemory) void onDelete(editingMemory).catch(() => { setError('This memory could not be deleted. It is still safe in your garden.'); setMode('read') })
              else void store.discardDraft().then(onClose)
            }}>{mode === 'confirm-delete' ? 'Delete Forever' : 'Discard Draft'}</button>
          </div>
        </div>
      </div>}
    </article>
  </dialog>
}
