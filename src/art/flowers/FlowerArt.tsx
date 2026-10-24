import { memo } from 'react'
import { growthStages, type GrowthStage } from './stages'

// Painted growth stages (sliced and aligned by scripts/prepare-assets.mjs) on a
// shared 1024×2048 frame whose stem base is at (512, 2036). Each new stage
// rises from the soil while the previous one settles away; the seed is drawn.
const painted = ['sprout', 'young', 'bud', 'bloom'] as const
const flowers = {
  sunflower: { name: 'Sunflower', art: (stage: string) => `/assets/flowers/sunflower/${stage}.webp` },
} as const
export type FlowerType = keyof typeof flowers

interface Props { type: FlowerType; stage: GrowthStage; animate: boolean }
export const FlowerArt = memo(function FlowerArt({ type, stage, animate }: Props) {
  const reached = stage === 'empty' ? -1 : growthStages.indexOf(stage)
  return <span className={`flower-art ${animate ? '' : 'flower-art--still'}`} data-stage={stage} aria-hidden="true">
    <span className="flower-contact" />
    <svg className="seed-grain" viewBox="-10 -12 20 24" focusable="false">
      <ellipse rx="5.5" ry="8.5" transform="rotate(24)" fill="#6a4529" />
      <path d="M-1.5,-6Q1,0 -0.5,6" stroke="#b08a63" strokeWidth="1.2" fill="none" transform="rotate(24)" />
    </svg>
    <span className="bloom-glow" />
    {painted.map(name => {
      const index = growthStages.indexOf(name)
      const state = index === reached ? 'current' : index < reached ? 'past' : 'future'
      return <img key={name} className={`flower-stage flower-stage--${name}`} data-state={state} src={flowers[type].art(name)} alt="" draggable="false" />
    })}
    <span className="sparkles">{[0, 1, 2, 3].map(i => <i key={i} />)}</span>
  </span>
})
