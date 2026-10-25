import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { GardenScene } from '../components/garden/GardenScene'
import { CoverFace, Desk, Endpaper, Butterfly, Sprig } from '../components/book/BookArt'
import { useBookGeometry } from '../components/book/useBookGeometry'
import { Journal, type Session } from '../journal/Journal'
import type { GrowthStage } from '../art/flowers/stages'
import { useBloomPreview } from '../garden/useBloomPreview'
import { useReducedMotion } from '../garden/useReducedMotion'
import { useLayout } from '../garden/useLayout'
import { spotIds, type SpotId } from '../garden/layouts'
import { availableFlowers } from '../garden/flowers'
import { newId, store, today, type Draft, type Entry, type Memory } from '../lib/db'
import { hasSeenIntro, rememberIntro } from '../lib/preferences'

type Phase = 'cover' | 'opening' | 'film' | 'garden' | 'closing'
type Film = 'idle' | 'starting' | 'playing' | 'fading'
const phaseLength = { opening: 5000, closing: 3600 }
const messages: Record<GrowthStage, string> = {
  empty: '', seed: 'A seed of a memory…', sprout: 'A new beginning…', young: 'Finding its shape…', bud: 'Finding its shape…', bloom: 'In full bloom — still here.',
}
const blankEntry = (): Entry => ({ id: newId(), title: '', story: '', feeling: '', memoryDate: today(), flowerType: availableFlowers[0].id })

export default function App() {
  const reducedMotion = useReducedMotion()
  const layout = useLayout()
  const geometry = useBookGeometry(layout.name)
  // The intro and growth are user-started story moments, so they always play;
  // the reduced-motion preference calms ambient decoration (parallax, drift).
  const { stage, playing, plant } = useBloomPreview(false)
  const [phase, setPhase] = useState<Phase>(() => hasSeenIntro() ? 'garden' : 'cover')
  const [memories, setMemories] = useState<Memory[]>([])
  const [draft, setDraft] = useState<Draft | null>(null)
  const [draftPrompt, setDraftPrompt] = useState(false)
  const [page, setPage] = useState(0)
  const [session, setSession] = useState<Session | null>(null)
  const [growingId, setGrowingId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [film, setFilm] = useState<Film>('idle')
  const filmRef = useRef<HTMLVideoElement>(null)
  const plantRef = useRef<HTMLButtonElement>(null)
  const openRef = useRef<HTMLButtonElement>(null)
  const arrivedFrom = useRef<Phase | null>(null)
  const returnFocus = useRef<string | null>(null)

  // Restore this browser's garden and any unfinished draft.
  useEffect(() => {
    store.memories().then(setMemories).catch(() => setNotice('This browser could not open your saved garden.'))
    store.draft().then(saved => { if (saved) { setDraft(saved); setDraftPrompt(true) } }).catch(() => undefined)
  }, [])
  // Opening and closing are timed CSS sequences; the timer commits the phase.
  useEffect(() => {
    if (phase !== 'opening' && phase !== 'closing') return
    const timer = setTimeout(() => setPhase(phase === 'opening' ? 'garden' : 'cover'), phaseLength[phase])
    return () => clearTimeout(timer)
  }, [phase])
  // After a transition, move focus to the new screen's primary action.
  useEffect(() => {
    if (!arrivedFrom.current || (phase !== 'garden' && phase !== 'cover')) return
    ;(phase === 'garden' ? plantRef : openRef).current?.focus()
    arrivedFrom.current = null
  }, [phase])

  const occupied = (p: number) => new Set(memories.filter(m => m.page === p).map(m => m.spotId))
  const lastPage = memories.reduce((max, m) => Math.max(max, m.page), 0)
  const pageCount = lastPage + 1 + (occupied(lastPage).size >= spotIds.length ? 1 : 0)
  const freeSpot = (p: number) => spotIds.find(id => !occupied(p).has(id))

  // Wide screens play the learner's Flow clip (book → car → gate); phones keep
  // the CSS opening, which is also the fallback.
  const filmable = layout.name === 'wide'
  function openBook() {
    rememberIntro(); arrivedFrom.current = 'cover'
    const video = filmRef.current
    if (!filmable || !video) { setPhase('opening'); return }
    setFilm('starting')
    video.currentTime = 0
    video.play().catch(() => { setFilm('idle'); setPhase('opening') })
  }
  function finishFilm(fade = 900) {
    filmRef.current?.pause()
    arrivedFrom.current = 'cover'
    setFilm('fading'); setPhase('garden')
    setTimeout(() => setFilm('idle'), fade)
  }
  function closeBook() { arrivedFrom.current = 'garden'; setPhase('closing') }
  function skip() {
    if (phase === 'film') { finishFilm(300); return }
    arrivedFrom.current = phase; setPhase(phase === 'closing' ? 'cover' : 'garden')
  }

  // Start (or resume) writing a new memory for a chosen or automatic spot.
  function startMemory(spot?: SpotId) {
    let target = page, chosen = spot
    if (!chosen) {
      for (let p = page; p <= pageCount; p++) { const free = freeSpot(p); if (free) { target = p; chosen = free; break } }
    }
    if (!chosen) return
    setPage(target); setDraftPrompt(false); returnFocus.current = null
    setSession({ kind: 'new', entry: draft ? { ...draft } : blankEntry(), page: target, spotId: chosen, resumed: !!draft })
  }
  async function plantMemory(entry: Entry, p: number, spotId: SpotId) {
    const now = Date.now()
    const memory: Memory = { ...entry, page: p, spotId, createdAt: now, updatedAt: now }
    await store.plant(memory)
    setMemories(list => [...list.filter(m => m.id !== memory.id), memory])
    setDraft(null); setSession(null); setPage(p); setGrowingId(memory.id); returnFocus.current = memory.id
    plant()
  }
  async function updateMemory(memory: Memory) {
    await store.update(memory)
    setMemories(list => list.map(m => m.id === memory.id ? memory : m))
    setSession({ kind: 'memory', memory })
  }
  async function deleteMemory(memory: Memory) {
    await store.remove(memory.id)
    setMemories(list => list.filter(m => m.id !== memory.id))
    if (growingId === memory.id) setGrowingId(null)
    returnFocus.current = null; setSession(null)
  }
  function closeJournal() {
    if (session?.kind === 'new') store.draft().then(saved => setDraft(saved ?? null)).catch(() => undefined)
    if (session?.kind === 'memory') returnFocus.current = session.memory.id
    setSession(null)
  }
  // Return focus to the flower (or the planting button) once the journal closes.
  useEffect(() => {
    if (session || playing) return
    const id = returnFocus.current
    const target = id ? document.querySelector<HTMLButtonElement>(`[data-memory-id="${id}"]`) : null
    ;(target ?? (phase === 'garden' ? plantRef.current : null))?.focus({ preventScroll: true })
  }, [session, playing, phase])

  const inGarden = phase === 'garden'
  const growingTitle = memories.find(m => m.id === growingId)?.title ?? ''
  return <>
    <h1 className="visually-hidden">MemoryGarden — Where Memories Bloom</h1>
    <div className="storybook" data-phase={phase} data-layout={layout.name} data-motion="full"
      style={{ ...geometry, '--open-ms': `${phaseLength.opening}ms`, '--close-ms': `${phaseLength.closing}ms` } as CSSProperties}>
      <Desk />
      <div className="book-stage">
        <div className="book-pages" aria-hidden="true" />
        <div className="book-cover" aria-hidden="true" onClick={phase === 'cover' ? openBook : undefined}>
          <div className="cover-front"><CoverFace /></div>
          <div className="cover-back"><Endpaper /></div>
        </div>
        <div className="world-window" inert={!inGarden}>
          <GardenScene layout={layout} memories={memories.filter(m => m.page === page)} growingId={growingId} stage={stage} playing={playing}
            parallax={inGarden && !reducedMotion} onSpot={startMemory} onOpen={memory => setSession({ kind: 'memory', memory })} />
        </div>
        <div className="book-gutter" aria-hidden="true" />
      </div>

      {phase === 'cover' && <div className="cover-actions">
        <button ref={openRef} className="open-book" onClick={openBook}><Sprig className="open-book-sprig" gold={false} />Open My Garden</button>
      </div>}
      {filmable && (phase === 'cover' || film !== 'idle') && <video ref={filmRef} className="intro-film" data-state={film} src="/assets/intro/intro-desktop.mp4"
        preload="auto" muted playsInline aria-hidden="true"
        onPlaying={() => { if (film === 'starting') { setFilm('playing'); setPhase('film') } }}
        onEnded={() => finishFilm()} onError={() => { if (film === 'starting') { setFilm('idle'); setPhase('opening') } }} />}
      {(phase === 'opening' || phase === 'film' || phase === 'closing') && <button className="skip-intro" onClick={skip}>{phase === 'closing' ? 'Skip' : 'Skip introduction'}</button>}

      {inGarden && <div className="garden-ui">
        <p className="identity" aria-hidden="true"><Butterfly className="identity-mark" fill="#a8873f" />MemoryGarden</p>
        <button className="close-book" onClick={closeBook} disabled={playing}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.5C6 4 9 4 12 6c3-2 6-2 9-.5V19c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M12 6v13.5" stroke="currentColor" strokeWidth="1.6" /></svg>
          <span className="close-book-label">Close my garden</span>
        </button>
        <p className="visually-hidden" role="status">{playing ? messages[stage] : growingTitle && stage === 'bloom' ? `${growingTitle} is planted.` : ''}</p>
        {notice && <p className="garden-notice" role="alert">{notice}</p>}
        {draftPrompt && draft && !session && <div className="draft-card" role="group" aria-label="Unfinished memory">
          <p>Your story is still waiting to bloom <span aria-hidden="true">🌱</span></p>
          <div><button onClick={() => startMemory(draft.page === page ? draft.spotId : undefined)}>Continue writing</button><button onClick={() => setDraftPrompt(false)}>Not now</button></div>
        </div>}
        {pageCount > 1 && <nav className="pager" aria-label="Garden pages">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0 || playing} aria-label="Previous garden page">‹</button>
          <span>Page {page + 1} of {pageCount}</span>
          <button onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))} disabled={page >= pageCount - 1 || playing} aria-label="Next garden page">›</button>
        </nav>}
        <button ref={plantRef} className="plant-cta" onClick={() => startMemory()} disabled={playing}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M12 12C12 7 8 4.5 4 5c0 4.5 3.5 7 8 7Zm0-1c0-4 3-6.5 7.5-6 0 4-3 6.5-7.5 6Z" fill="currentColor" opacity=".85" /></svg>
          {draft ? 'Continue my memory' : 'Plant a Memory'}
        </button>
      </div>}
    </div>
    <Journal session={session} onClose={closeJournal} onPlant={plantMemory} onUpdate={updateMemory} onDelete={deleteMemory} />
  </>
}
