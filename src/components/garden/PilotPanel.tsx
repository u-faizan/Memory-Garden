import { useEffect, useRef } from 'react'
import type { GrowthStage } from './Bloom'

export type Panel = 'tools' | 'flower' | 'motion' | null
interface Props {
  panel: Panel
  stage: GrowthStage
  reducedMotion: boolean
  onClose: () => void
  onMotion: () => void
  onInspect: (stage: GrowthStage) => void
}

export function PilotPanel({ panel, stage, reducedMotion, onClose, onMotion, onInspect }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => { if (panel) closeRef.current?.focus() }, [panel])
  if (!panel) return null
  return (
    <aside id="pilot-panel" className={`pilot-panel pilot-panel--${panel}`} aria-labelledby="panel-title">
      <div className="panel-heading">
        <h2 id="panel-title">{panel === 'tools' ? 'Growth preview' : panel === 'flower' ? 'Sunflower' : 'Motion preference'}</h2>
        <button ref={closeRef} className="panel-close" onClick={onClose} aria-label="Close preview panel">×</button>
      </div>
      {panel === 'flower' && <div className="flower-note">
        <p className="flower-theme">JOY · ACHIEVEMENT</p>
        <p>A symbol of joy and small victories. Its meaning is always yours to choose.</p>
        <small>Botanical preview · Not a saved memory</small>
      </div>}
      {panel === 'tools' && <>
        <div className="stage-controls" role="group" aria-label="Inspect a growth stage">
          {(['seed', 'sprout', 'young', 'bloom'] as const).map(value => (
            <button key={value} aria-label={value === 'young' ? 'Young plant' : value[0].toUpperCase() + value.slice(1)}
              aria-pressed={stage === value} onClick={() => onInspect(value)}>
              {value === 'young' ? 'Young plant' : value[0].toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
        <div className="tools-footer">
          <button onClick={() => onInspect('empty')}>Clear spot</button>
          <button onClick={onMotion}>{reducedMotion ? 'Reduced motion ⓘ' : 'Motion preference ⓘ'}</button>
        </div>
      </>}
      {panel === 'motion' && <div className="motion-note">
        <p>{reducedMotion ? 'Your browser requests reduced motion. Planting reveals the flower immediately.' : 'Your browser requests normal motion. Planting plays all four growth stages.'}</p>
        <p>{reducedMotion ? 'Use the stage buttons to inspect each step without animation.' : 'Motion follows your device preference. This app never changes it.'}</p>
      </div>}
    </aside>
  )
}
