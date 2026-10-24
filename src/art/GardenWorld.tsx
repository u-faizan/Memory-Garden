import { memo, type ReactNode } from 'react'
import { soilSize, soilSprites, type WorldLayout } from '../garden/layouts'

// The Secret Glade as composited storybook layers: the learner's painted plate,
// painted soil beds and interactive flowers on the ground, painted foreground
// leaves in front, and small code-drawn atmosphere (birds, butterfly, motes).

function Soil({ layout }: { layout: WorldLayout }) {
  return <>{layout.spots.map((spot, i) => {
    const { rx } = soilSize(layout, spot.depth)
    const width = rx * 2 / .87 // the painted bed fills ~87% of its sprite
    return <img key={spot.id} className="soil" src={soilSprites[i % soilSprites.length]} alt="" draggable="false"
      style={{ left: `${spot.x / layout.width * 100}%`, top: `${spot.y / layout.height * 100}%`, width: `${width / layout.width * 100}%`, scale: i % 2 ? '-1 1' : undefined }} />
  })}</>
}

function Air({ layout }: { layout: WorldLayout }) {
  const { width: w, height: h } = layout
  const wing = 'M-9,0Q-4,-6 0,0Q4,-6 9,0'
  const lawn = layout.name === 'wide' ? .48 : .36
  return <div className="wl wl--air">
    <svg viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
      <g className="birds" style={{ ['--fly' as string]: `${w + 260}px` }}>
        <g transform={`translate(-120 ${h * .12})`}>
          <path className="bird" d={wing} stroke="#3f5146" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <g transform="translate(26 -12) scale(.8)"><path className="bird bird--late" d={wing} stroke="#3f5146" strokeWidth="2.2" fill="none" strokeLinecap="round" /></g>
        </g>
      </g>
      <g transform={`translate(${w * .26} ${h * (lawn + .08)})`}>
        <g className="butterfly-path">
          <g className="butterfly">
            <path className="wing" d="M0,0C-10,-14 -20,-12 -16,-2C-20,6 -10,10 0,2Z" fill="#f7e3a0" />
            <path className="wing wing--right" d="M0,0C10,-14 20,-12 16,-2C20,6 10,10 0,2Z" fill="#f0d27f" />
            <path d="M0,-6L0,6" stroke="#5d5040" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        </g>
      </g>
      {Array.from({ length: 7 }, (_, i) => <circle key={i} className="mote" cx={w * (.15 + i * .11)} cy={h * (lawn + (i % 3) * .1)} r={2.2}
        fill="#fff7d6" style={{ animationDelay: `${-i * 1.7}s` }} />)}
    </svg>
  </div>
}

interface Props { layout: WorldLayout; children?: ReactNode }
export const GardenWorld = memo(function GardenWorld({ layout, children }: Props) {
  return <div className={`world world--${layout.name}`}>
    <div className="wl wl--plate"><img src={layout.plate} alt="" draggable="false" fetchPriority="high" /></div>
    <div className="wl wl--ground"><Soil layout={layout} />{children}</div>
    <div className="wl wl--front"><img src={layout.leaves} alt="" draggable="false" /></div>
    <Air layout={layout} />
  </div>
})
