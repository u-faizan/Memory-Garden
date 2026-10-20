import { useEffect, useRef, useState } from 'react'
import { GardenScene } from '../components/garden/GardenScene'
import { PilotPanel, type Panel } from '../components/garden/PilotPanel'
import { useBloomPreview } from '../garden/useBloomPreview'
import { useReducedMotion } from '../garden/useReducedMotion'
import { sunflower } from '../garden/flowerCatalog'

function Sprig() {
  return <svg viewBox="0 0 32 40" fill="none" aria-hidden="true"><path d="M12 37C21 23 14 11 24 3" stroke="currentColor" strokeWidth="1.5" /><path d="M17 24C6 25 5 18 5 14C13 13 18 17 17 24ZM19 16C18 8 23 7 28 7C28 13 24 16 19 16ZM14 32C10 32 5 30 3 26C9 23 14 26 14 32Z" fill="currentColor" opacity=".75" /></svg>
}

const messages = {
  empty: 'A little space for a new beginning.', seed: 'A seed settles into the earth…',
  sprout: 'A small sprout reaches for the light…', young: 'Leaves unfold, a little at a time…',
  bloom: 'Your sunflower is here. Select it to explore.',
}

export default function App() {
  const reducedMotion = useReducedMotion()
  const { stage, playing, plant, inspect } = useBloomPreview(reducedMotion)
  const [panel, setPanel] = useState<Panel>(null)
  const [ready, setReady] = useState(false)
  const [assetError, setAssetError] = useState(false)
  const flowerRef = useRef<HTMLButtonElement>(null)
  const toolsRef = useRef<HTMLButtonElement>(null)
  const returnFocus = useRef<'flower' | 'tools'>('tools')

  // Decode both paintings before inviting the first bloom, including the final art.
  useEffect(() => {
    let active = true
    const decode = async (src: string) => {
      const image = new Image()
      image.src = src
      await image.decode()
    }
    Promise.all([decode('/assets/garden/base.webp'), decode(sunflower.src)])
      .then(() => { if (active) setReady(true) })
      .catch(() => { if (active) setAssetError(true) })
    return () => { active = false }
  }, [])

  function closePanel() {
    setPanel(null)
    if (returnFocus.current === 'flower') flowerRef.current?.focus()
    else toolsRef.current?.focus()
  }
  function startPlanting() { setPanel(null); plant() }

  return (
    <main className="garden-world" data-stage={stage} data-playing={playing}
      onKeyDown={event => { if (event.key === 'Escape' && panel) closePanel() }}>
      <header className="garden-header">
        <div className="wordmark"><Sprig /><h1>MemoryGarden<span>WHERE MEMORIES BLOOM</span></h1></div>
        <button ref={toolsRef} className="tools-toggle" aria-expanded={panel === 'tools'}
          aria-controls={panel === 'tools' ? 'pilot-panel' : undefined}
          onClick={() => { returnFocus.current = 'tools'; if (panel === 'tools') closePanel(); else setPanel('tools') }}>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6H17M3 14H17" stroke="currentColor" strokeWidth="1.3" /><circle cx="7" cy="6" r="2" fill="var(--paper)" stroke="currentColor" /><circle cx="13" cy="14" r="2" fill="var(--paper)" stroke="currentColor" /></svg>
          Preview tools
        </button>
      </header>
      <section className="garden-stage" aria-label="Illustrated garden">
        <GardenScene stage={stage} playing={playing} ready={ready && !assetError}
          flowerRef={flowerRef} selected={panel === 'flower'} onPlant={startPlanting}
          onExplore={() => { returnFocus.current = 'flower'; if (panel === 'flower') closePanel(); else setPanel('flower') }} />
        <PilotPanel panel={panel} stage={stage} reducedMotion={reducedMotion}
          onClose={closePanel} onMotion={() => setPanel('motion')} onInspect={inspect} />
      </section>
      <footer className="garden-dock">
        <p className="bloom-message" aria-live="polite" aria-atomic="true">
          {assetError ? 'The artwork could not load. Please refresh to try again.' : !ready ? 'Opening your little garden…'
            : reducedMotion && stage === 'bloom' ? 'Your sunflower is here, with reduced motion.' : messages[stage]}
        </p>
        <button className="plant-action" onClick={startPlanting} disabled={playing || !ready || assetError}>
          <span aria-hidden="true">✧</span>
          {playing ? 'Watching it grow…' : stage === 'empty' ? 'Plant a sunflower' : 'Replay the bloom'}
        </button>
        <p className="pilot-disclosure">Visual pilot <span aria-hidden="true">·</span> This bloom isn’t saved</p>
      </footer>
    </main>
  )
}
