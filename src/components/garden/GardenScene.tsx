import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { GardenWorld } from '../../art/GardenWorld'
import { FlowerArt } from '../../art/flowers/FlowerArt'
import type { GrowthStage } from '../../art/flowers/stages'
import { soilSize, type SpotId, type WorldLayout } from '../../garden/layouts'

interface Props {
  layout: WorldLayout; stage: GrowthStage; playing: boolean; selecting: boolean; parallax: boolean
  activeSpot: SpotId; title: string; flowerRef: RefObject<HTMLButtonElement | null>
  onPlant: (spot: SpotId) => void; onExplore: () => void
}

export function GardenScene({ layout, stage, playing, selecting, parallax, activeSpot, title, flowerRef, onPlant, onExplore }: Props) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [celebrating, setCelebrating] = useState(false)
  const wasPlaying = useRef(false)
  // When a bloom finishes, its title writes itself above the flower and a
  // butterfly visits; afterwards the title returns on hover or focus.
  useEffect(() => {
    const finished = wasPlaying.current && !playing && stage === 'bloom'
    wasPlaying.current = playing
    if (!finished) return
    const start = setTimeout(() => setCelebrating(true), 0)
    const end = setTimeout(() => setCelebrating(false), 4800)
    return () => { clearTimeout(start); clearTimeout(end) }
  }, [playing, stage])
  const celebrate = celebrating && !playing
  // Pointer parallax writes CSS variables directly; no React render per move.
  useEffect(() => {
    const frame = frameRef.current
    if (!frame || !parallax) return
    let raf = 0
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        frame.style.setProperty('--px', (event.clientX / innerWidth * 2 - 1).toFixed(3))
        frame.style.setProperty('--py', (event.clientY / innerHeight * 2 - 1).toFixed(3))
      })
    }
    addEventListener('pointermove', move)
    return () => { removeEventListener('pointermove', move); cancelAnimationFrame(raf); frame.style.removeProperty('--px'); frame.style.removeProperty('--py') }
  }, [parallax])

  const { width: w, height: h } = layout
  return <section ref={frameRef} className={`world-frame ${selecting ? 'world-frame--selecting' : ''}`} aria-label="Your Secret Glade garden">
    <GardenWorld layout={layout}>
      <div className="spots">
        {layout.spots.map((spot, index) => {
          const occupied = spot.id === activeSpot && stage !== 'empty'
          const { rx, ry } = soilSize(layout, spot.depth)
          const style = {
            left: `${spot.x / w * 100}%`, top: `${spot.y / h * 100}%`, zIndex: Math.round(spot.y),
            '--soil-w': `${(rx * 2 / w * 100).toFixed(2)}cqw`, '--soil-h': `${(ry * 2 / h * 100).toFixed(2)}cqh`,
            '--flower-h': `calc(${spot.depth} * ${layout.flowerUnit})`,
          } as CSSProperties
          return <div key={spot.id} className={`spot ${occupied ? 'spot--occupied' : ''}`} data-spot-id={spot.id} style={style}>
            {occupied
              ? <button ref={flowerRef} className={`flower-button ${playing ? 'flower-button--growing' : ''} ${celebrate ? 'flower-button--celebrating' : ''}`}
                data-spot-id={spot.id} data-stage={stage} disabled={playing || selecting} onClick={onExplore} aria-label={`${title}, a sunflower — open its journal page`}>
                <span className="flower-sway"><FlowerArt type="sunflower" stage={stage} animate={playing} /></span>
                {stage === 'bloom' && <span className="flower-title" aria-hidden="true">{title}</span>}
                {celebrate && <svg className="visitor" viewBox="-20 -14 40 28" aria-hidden="true" focusable="false">
                  <path className="visitor-wing" d="M0,0C-6,-12 -18,-13 -17,-4C-18,3 -9,7 0,1Z" fill="#f0a23b" />
                  <path className="visitor-wing visitor-wing--right" d="M0,0C6,-12 18,-13 17,-4C18,3 9,7 0,1Z" fill="#e8912c" />
                  <path d="M0,-6L0,7" stroke="#4a3626" strokeWidth="1.6" strokeLinecap="round" />
                </svg>}
              </button>
              : <button className="spot-target" data-spot-id={spot.id} aria-label={`Plant here, spot ${index + 1} of ${layout.spots.length}`}
                disabled={playing} tabIndex={selecting ? 0 : -1} onClick={() => onPlant(spot.id)}>
                <span className="spot-glow" aria-hidden="true" />
                <span className="spot-label" aria-hidden="true">Plant here</span>
              </button>}
          </div>
        })}
      </div>
    </GardenWorld>
  </section>
}
