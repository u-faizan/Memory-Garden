import type { CSSProperties, RefObject } from 'react'
import { Bloom, type GrowthStage } from './Bloom'
import { pilotSpot } from '../../garden/scene'

interface Props {
  stage: GrowthStage
  playing: boolean
  ready: boolean
  selected: boolean
  flowerRef: RefObject<HTMLButtonElement | null>
  onPlant: () => void
  onExplore: () => void
}

export function GardenScene({ stage, playing, ready, selected, flowerRef, onPlant, onExplore }: Props) {
  const position = {
    '--spot-x': `${pilotSpot.desktop.x * 100}%`, '--spot-y': `${pilotSpot.desktop.y * 100}%`,
    '--spot-mobile-x': `${pilotSpot.mobile.x * 100}%`, '--spot-mobile-y': `${pilotSpot.mobile.y * 100}%`,
  } as CSSProperties
  return (
    <div className="scene-crop">
      <div className="scene-plane">
        <img className="garden-painting" src="/assets/garden/base.webp" width="1536" height="1024" alt="" fetchPriority="high" />
        <div className="motes" aria-hidden="true">{[0, 1, 2, 3].map(i => <i key={i} style={{ '--i': i } as CSSProperties} />)}</div>
        <div className={`planting-place ${selected ? 'planting-place--selected' : ''}`} style={position}>
          <span className="ground-shadow" aria-hidden="true" />
          <svg className="soil-patch" viewBox="0 0 100 36" aria-hidden="true">
            <defs><radialGradient id="soil-paint"><stop stopColor="#806443" /><stop offset=".65" stopColor="#98814f" /><stop offset="1" stopColor="#a99c5d" stopOpacity="0" /></radialGradient></defs>
            <ellipse cx="50" cy="17" rx="48" ry="14" fill="url(#soil-paint)" />
            <path d="M22 20Q34 13 48 15M59 19L66 18M38 24L43 23M70 13L74 14" stroke="#c0ab72" strokeWidth="1.5" strokeLinecap="round" opacity=".8" />
          </svg>
          <button ref={flowerRef} className={`flower-button flower-button--${stage}`} disabled={playing || !ready}
            onClick={stage === 'bloom' ? onExplore : onPlant}
            aria-label={stage === 'bloom' ? 'Explore the sunflower' : 'Plant a sunflower in this spot'}
            aria-expanded={stage === 'bloom' ? selected : undefined} aria-controls={selected ? 'pilot-panel' : undefined}>
            <Bloom stage={stage} playing={playing} />
            {stage === 'empty' && <span className="empty-spot" aria-hidden="true">+</span>}
          </button>
          <svg className="root-grass" viewBox="0 0 64 18" aria-hidden="true"><path d="M17 17L13 8L21 14L20 4L26 16M29 17L30 10L33 16L38 8L36 17M42 17L46 4L46 13L53 9L49 17" fill="#84934c" /><path d="M24 17L22 10M43 17L47 8" stroke="#bfbc71" strokeWidth="1.1" /></svg>
          {stage === 'empty' && <span className="garden-sign" aria-hidden="true">Your story<br /><em>begins here</em></span>}
        </div>
      </div>
    </div>
  )
}
