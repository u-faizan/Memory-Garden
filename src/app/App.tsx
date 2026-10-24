import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { GardenScene } from '../components/garden/GardenScene'
import { CoverFace, Desk, Endpaper, Butterfly, Sprig } from '../components/book/BookArt'
import { SamplePage } from '../components/journal/SamplePage'
import { useBookGeometry } from '../components/book/useBookGeometry'
import { growthStages, type GrowthStage } from '../art/flowers/stages'
import { useBloomPreview } from '../garden/useBloomPreview'
import { useReducedMotion } from '../garden/useReducedMotion'
import { useLayout } from '../garden/useLayout'
import type { SpotId } from '../garden/layouts'
import { hasSeenIntro, rememberIntro } from '../lib/preferences'

type Phase = 'cover' | 'opening' | 'garden' | 'closing'
const phaseLength = { opening: 5000, closing: 3600 }
const messages: Record<GrowthStage, string> = {
  empty: '', seed: 'A seed of a memory…', sprout: 'A new beginning…', young: 'Finding its shape…', bud: 'Finding its shape…', bloom: 'In full bloom — still here.',
}

export default function App() {
  const reducedMotion = useReducedMotion()
  const layout = useLayout()
  const geometry = useBookGeometry(layout.name)
  const { stage, playing, plant, inspect } = useBloomPreview(reducedMotion)
  const [phase, setPhase] = useState<Phase>(() => hasSeenIntro() ? 'garden' : 'cover')
  const [activeSpot, setActiveSpot] = useState<SpotId>('glade-04')
  const [selecting, setSelecting] = useState(false)
  const [reading, setReading] = useState(false)
  const flowerRef = useRef<HTMLButtonElement>(null)
  const plantRef = useRef<HTMLButtonElement>(null)
  const openRef = useRef<HTMLButtonElement>(null)
  const arrivedFrom = useRef<Phase | null>(null)
  const inspecting = import.meta.env.DEV && new URLSearchParams(location.search).get('pilot') === '1'

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
  useEffect(() => {
    if (selecting) document.querySelector<HTMLButtonElement>('.spot-target:not(:disabled)')?.focus()
  }, [selecting])

  function openBook() {
    rememberIntro()
    arrivedFrom.current = 'cover'
    setPhase(reducedMotion ? 'garden' : 'opening')
  }
  function closeBook() {
    setSelecting(false)
    arrivedFrom.current = 'garden'
    setPhase(reducedMotion ? 'cover' : 'closing')
  }
  function skip() {
    arrivedFrom.current = phase
    setPhase(phase === 'closing' ? 'cover' : 'garden')
  }
  function startPlanting(spot: SpotId) { setReading(false); setSelecting(false); setActiveSpot(spot); plant() }
  function closeReading() { setReading(false); requestAnimationFrame(() => flowerRef.current?.focus()) }

  const inGarden = phase === 'garden'
  return <>
    <h1 className="visually-hidden">MemoryGarden — Where Memories Bloom</h1>
    <div className="storybook" data-phase={phase} data-layout={layout.name} data-motion={reducedMotion ? 'reduced' : 'full'}
      style={{ ...geometry, '--open-ms': `${phaseLength.opening}ms`, '--close-ms': `${phaseLength.closing}ms` } as CSSProperties}
      onKeyDown={event => {
        if (event.key !== 'Escape' || !selecting) return
        setSelecting(false); plantRef.current?.focus()
      }}>
      <Desk />
      <div className="book-stage">
        <div className="book-pages" aria-hidden="true" />
        <div className="book-cover" aria-hidden="true" onClick={phase === 'cover' ? openBook : undefined}>
          <div className="cover-front"><CoverFace /></div>
          <div className="cover-back"><Endpaper /></div>
        </div>
        <div className="world-window" inert={!inGarden}>
          <GardenScene layout={layout} stage={stage} playing={playing} selecting={selecting} parallax={inGarden && !reducedMotion}
            activeSpot={activeSpot} title="A Small Victory" flowerRef={flowerRef} onPlant={startPlanting} onExplore={() => setReading(true)} />
        </div>
        <div className="book-gutter" aria-hidden="true" />
      </div>

      {phase === 'cover' && <div className="cover-actions">
        <button ref={openRef} className="open-book" onClick={openBook}>
          <Sprig className="open-book-sprig" gold={false} />Open My Garden
        </button>
      </div>}
      {(phase === 'opening' || phase === 'closing') && <button className="skip-intro" onClick={skip}>Skip</button>}

      {inGarden && <div className="garden-ui">
        <p className="identity" aria-hidden="true"><Butterfly className="identity-mark" fill="#a8873f" />MemoryGarden</p>
        <p className="pilot-note">Sunflower study · not saved</p>
        <button className="close-book" onClick={closeBook} disabled={playing}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.5C6 4 9 4 12 6c3-2 6-2 9-.5V19c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M12 6v13.5" stroke="currentColor" strokeWidth="1.6" /></svg>
          <span className="close-book-label">Close my garden</span>
        </button>
        <p className="visually-hidden" role="status">{playing ? messages[stage] : ''}</p>
        {selecting
          ? <div className="planting-guide" role="group" aria-label="Choose a planting spot">
            <span>Choose a little place to bloom</span>
            <button onClick={() => { setSelecting(false); plantRef.current?.focus() }}>Cancel</button>
          </div>
          : <button ref={plantRef} className="plant-cta" onClick={() => { setReading(false); setSelecting(true) }} disabled={playing}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M12 12C12 7 8 4.5 4 5c0 4.5 3.5 7 8 7Zm0-1c0-4 3-6.5 7.5-6 0 4-3 6.5-7.5 6Z" fill="currentColor" opacity=".85" /></svg>
            Plant a Memory
          </button>}
      </div>}

      {inspecting && inGarden && <div className="stage-inspector" role="group" aria-label="Inspect a growth stage">
        {growthStages.map(value => <button key={value} aria-pressed={stage === value} onClick={() => inspect(value)}>{value}</button>)}
        <button onClick={() => inspect('empty')}>clear</button>
      </div>}
    </div>
    <SamplePage open={reading} onClose={closeReading} onReplay={() => startPlanting(activeSpot)} />
  </>
}
