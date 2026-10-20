import { useEffect, useState } from 'react'
import type { GrowthStage } from '../components/garden/Bloom'

const sequence: GrowthStage[] = ['seed', 'sprout', 'young', 'bloom']
const duration = { seed: 650, sprout: 750, young: 800, bloom: 1000 }

export function useBloomPreview(reducedMotion: boolean) {
  const [stage, setStage] = useState<GrowthStage>('empty')
  const [playing, setPlaying] = useState(false)
  // Each committed stage gets a frame and its own hold time. Delayed rendering
  // cannot flush four independent timers and skip straight to the final flower.
  useEffect(() => {
    if (!playing || reducedMotion || stage === 'empty') return
    let timer: ReturnType<typeof setTimeout>
    const frame = requestAnimationFrame(() => {
      timer = setTimeout(() => {
        if (stage === 'bloom') setPlaying(false)
        else setStage(sequence[sequence.indexOf(stage) + 1])
      }, duration[stage])
    })
    return () => { cancelAnimationFrame(frame); clearTimeout(timer) }
  }, [playing, stage, reducedMotion])
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finish = () => {
      if (!media.matches) return
      setStage(current => current === 'empty' ? 'empty' : 'bloom')
      setPlaying(false)
    }
    media.addEventListener('change', finish)
    return () => media.removeEventListener('change', finish)
  }, [])
  return {
    stage: reducedMotion && playing ? 'bloom' : stage,
    playing: playing && !reducedMotion,
    plant() { setStage(reducedMotion ? 'bloom' : 'seed'); setPlaying(!reducedMotion) },
    inspect(next: GrowthStage) { setPlaying(false); setStage(next) },
  }
}
