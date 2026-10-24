import { leafPath } from '../../art/geometry'

// Gilded botanical ornament shared by the cover, endpaper and journal.
// The small butterfly is MemoryGarden's recurring motif.
export function Butterfly({ className, fill = '#d9b96e' }: { className?: string; fill?: string }) {
  return <svg className={className} viewBox="-20 -14 40 28" aria-hidden="true" focusable="false">
    <path d="M0,0C-6,-12 -18,-13 -17,-4C-18,3 -9,7 0,1Z" fill={fill} />
    <path d="M0,0C6,-12 18,-13 17,-4C18,3 9,7 0,1Z" fill={fill} />
    <path d="M0,1C-4,6 -11,11 -8,13C-4,13 -1,7 0,2ZM0,1C4,6 11,11 8,13C4,13 1,7 0,2Z" fill={fill} opacity=".8" />
    <path d="M0,-6L0,7M0,-6L-4,-12M0,-6L4,-12" stroke={fill} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
}

function Blossom({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  return <g transform={`translate(${x} ${y})`}>
    {[0, 72, 144, 216, 288].map(a => <ellipse key={a} cx="0" cy={-r * .62} rx={r * .42} ry={r * .62} transform={`rotate(${a})`} fill={fill} />)}
    <circle r={r * .3} fill="#f3e2a6" />
  </g>
}

export function Sprig({ className, gold = true }: { className?: string; gold?: boolean }) {
  const leaf = gold ? '#d6b56a' : '#7d9a62', soft = gold ? '#ead08e' : '#a5bd88', stem = gold ? '#c9a659' : '#6f8d57'
  const along = [[22, 92, -130], [34, 74, -40], [40, 60, -140], [56, 44, -30], [60, 32, -150], [80, 22, -40]] as const
  return <svg className={className} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
    <path d="M8,116C20,88 40,52 96,10" stroke={stem} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    {along.map(([x, y, a], i) => <path key={i} d={leafPath(22 - i, 7)} transform={`translate(${x} ${y}) rotate(${a})`} fill={i % 2 ? soft : leaf} />)}
    {gold && <Blossom x={98} y={12} r={9} fill={soft} />}
    {gold && <Blossom x={30} y={100} r={6} fill={leaf} />}
  </svg>
}

// The painted cover and endpaper come from the learner's art; the title stays
// real text so it is always spelled correctly and readable by assistive tech.
export function CoverFace() {
  return <div className="cover-face">
    <p className="cover-title" aria-hidden="true">MemoryGarden</p>
    <p className="cover-subtitle" aria-hidden="true">Where Memories Bloom</p>
  </div>
}

export function Endpaper() {
  return <div className="endpaper">
    <p className="endpaper-label">This book holds a garden.<br /><em>Each flower keeps a memory.</em></p>
  </div>
}

export function Desk() {
  return <div className="desk" aria-hidden="true" />
}
