import { sunflower } from '../../garden/flowerCatalog'

export type GrowthStage = 'empty' | 'seed' | 'sprout' | 'young' | 'bloom'

function EarlyGrowth({ young }: { young: boolean }) {
  return (
    <svg className={`early-growth ${young ? 'early-growth--young' : ''}`} viewBox="0 0 240 320" aria-hidden="true">
      <defs>
        <linearGradient id="stem-paint" x1="0" x2="1">
          <stop stopColor="#879343" /><stop offset=".45" stopColor="#b5b76b" /><stop offset="1" stopColor="#596e35" />
        </linearGradient>
        <linearGradient id="leaf-paint" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#b3b77b" /><stop offset=".5" stopColor="#7c914b" /><stop offset="1" stopColor="#4c6b40" />
        </linearGradient>
      </defs>
      <g>
        <path className="growth-stem" d={young ? 'M120 320 C113 272 128 242 119 186 C115 158 119 143 122 128' : 'M120 320 C117 297 121 281 120 264'} fill="none" stroke="url(#stem-paint)" strokeWidth={young ? 6 : 4} strokeLinecap="round" />
        <g className="growth-leaf growth-leaf--left">
          <path d={young ? 'M120 232 C95 232 72 207 70 181 C97 179 119 200 120 232Z' : 'M120 284 C107 285 94 276 92 264 C106 261 119 271 120 284Z'} fill="url(#leaf-paint)" />
          <path d={young ? 'M119 230 Q93 201 76 187' : 'M119 282 L96 267'} fill="none" stroke="#c3bf81" strokeWidth="1.2" />
        </g>
        <g className="growth-leaf growth-leaf--right">
          <path d={young ? 'M120 191 C121 170 139 149 163 148 C162 172 141 193 120 191Z' : 'M120 273 C122 258 136 250 148 251 C146 265 132 274 120 273Z'} fill="url(#leaf-paint)" />
          <path d={young ? 'M122 190 Q139 166 158 152' : 'M122 271 L143 255'} fill="none" stroke="#c3bf81" strokeWidth="1.2" />
        </g>
        {young && <ellipse cx="122" cy="128" rx="7" ry="10" fill="#8c994b" transform="rotate(12 122 128)" />}
      </g>
    </svg>
  )
}

export function Bloom({ stage, playing }: { stage: GrowthStage; playing: boolean }) {
  return (
    <span className={`bloom-art bloom-art--${stage} ${playing ? 'bloom-art--playing' : ''}`} aria-hidden="true">
      {stage === 'seed' && <span className="seed"><span /></span>}
      {(stage === 'sprout' || stage === 'young') && <EarlyGrowth key={stage} young={stage === 'young'} />}
      {stage === 'bloom' && <span className="flower-sway"><img className="flower-painting" src={sunflower.src} width={sunflower.width} height={sunflower.height} alt="" draggable="false" /><span className="bloom-glow" /></span>}
    </span>
  )
}
