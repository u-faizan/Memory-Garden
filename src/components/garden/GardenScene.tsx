import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { GardenWorld } from '../../art/GardenWorld'
import { FlowerArt } from '../../art/flowers/FlowerArt'
import type { GrowthStage } from '../../art/flowers/stages'
import { soilSize, type SpotId, type WorldLayout } from '../../garden/layouts'
import type { Memory } from '../../lib/db'

interface Props {
  layout: WorldLayout; memories: Memory[]; growingId: string | null; stage: GrowthStage; playing: boolean; parallax: boolean
  onSpot: (spot: SpotId) => void; onOpen: (memory: Memory) => void
}

export function GardenScene({ layout, memories, growingId, stage, playing, parallax, onSpot, onOpen }: Props) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [celebrating, setCelebrating] = useState(false)
  const wasPlaying = useRef(false)
  // When a bloom finishes, its title writes itself above the flower and a
  // butterfly visits; afterwards titles return on hover or focus.
  useEffect(() => {
    const finished = wasPlaying.current && !playing && stage === 'bloom'
    wasPlaying.current = playing
    if (!finished) return
    const start = setTimeout(() => setCelebrating(true), 0)
    const end = setTimeout(() => setCelebrating(false), 4800)
    return () => { clearTimeout(start); clearTimeout(end) }
  }, [playing, stage])
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
  const bySpot = new Map(memories.map(memory => [memory.spotId, memory]))
  return <section ref={frameRef} className="world-frame" aria-label="Your Secret Glade garden">
    <GardenWorld layout={layout}>
      <div className="spots">
        {layout.spots.map((spot, index) => {
          const memory = bySpot.get(spot.id)
          const { rx, ry } = soilSize(layout, spot.depth)
          const style = {
            left: `${spot.x / w * 100}%`, top: `${spot.y / h * 100}%`, zIndex: Math.round(spot.y),
            '--soil-w': `${(rx * 2 / w * 100).toFixed(2)}cqw`, '--soil-h': `${(ry * 2 / h * 100).toFixed(2)}cqh`,
            '--flower-h': `calc(${spot.depth} * ${layout.flowerUnit})`,
          } as CSSProperties
          if (!memory) return <div key={spot.id} className="spot" data-spot-id={spot.id} style={style}>
            <button className="spot-target" data-spot-id={spot.id} aria-label={`Plant a memory here, spot ${index + 1} of ${layout.spots.length}`}
              disabled={playing} onClick={() => onSpot(spot.id)}>
              <span className="spot-glow" aria-hidden="true" />
              <span className="spot-label" aria-hidden="true">Plant a memory here</span>
            </button>
          </div>
          const growing = memory.id === growingId
          const celebrate = growing && celebrating && !playing
          return <div key={spot.id} className="spot spot--occupied" data-spot-id={spot.id} style={style}>
            <button className={`flower-button ${growing && playing ? 'flower-button--growing' : ''} ${celebrate ? 'flower-button--celebrating' : ''}`}
              data-spot-id={spot.id} data-memory-id={memory.id} data-stage={growing ? stage : 'bloom'} disabled={growing && playing}
              onClick={() => onOpen(memory)} aria-label={`Open memory: ${memory.title}`}>
              <span className="flower-sway"><FlowerArt type={memory.flowerType} stage={growing ? stage : 'bloom'} animate={growing && playing} /></span>
              <span className="flower-title" aria-hidden="true">{memory.title}</span>
              {celebrate && <svg className="visitor" viewBox="-20 -14 40 28" aria-hidden="true" focusable="false">
                <path className="visitor-wing" d="M0,0C-6,-12 -18,-13 -17,-4C-18,3 -9,7 0,1Z" fill="#f0a23b" />
                <path className="visitor-wing visitor-wing--right" d="M0,0C6,-12 18,-13 17,-4C18,3 9,7 0,1Z" fill="#e8912c" />
                <path d="M0,-6L0,7" stroke="#4a3626" strokeWidth="1.6" strokeLinecap="round" />
              </svg>}
            </button>
          </div>
        })}
      </div>
    </GardenWorld>
  </section>
}
