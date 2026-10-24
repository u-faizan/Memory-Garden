import { useEffect, useState, type CSSProperties } from 'react'
import type { LayoutName } from '../../garden/layouts'

// The live garden is always viewport-sized; the book is drawn around it with
// page margins, then the whole stage is scaled down onto the desk. Portrait
// screens widen their margins so the page keeps a book-like proportion and the
// painted cover is not squashed.
function measure(layout: LayoutName) {
  const vw = innerWidth, vh = innerHeight
  if (layout === 'wide') {
    const my = vh * .07, mx = vw * .045, lip = vw * .008, s = .6
    return { mx, my, lip, s, shift: -s * (vw * .25 + mx / 2), tilt: 14 }
  }
  const my = vh * .05, lip = vw * .02
  const mx = Math.max(vw * .12, (.74 * (vh + 2 * my) - vw) / 2)
  const s = Math.min(.68, .9 * vw / (vw + 2 * mx + 2 * lip), .74 * vh / (vh + 2 * my + 2 * lip))
  return { mx, my, lip, s, shift: 0, tilt: 10 }
}

export function useBookGeometry(layout: LayoutName): CSSProperties {
  const [geometry, setGeometry] = useState(() => measure(layout))
  useEffect(() => {
    const update = () => setGeometry(measure(layout))
    update()
    addEventListener('resize', update)
    return () => removeEventListener('resize', update)
  }, [layout])
  const { mx, my, lip, s, shift, tilt } = geometry
  return { '--mx': `${mx}px`, '--my': `${my}px`, '--lip': `${lip}px`, '--s': s, '--shift': `${shift}px`, '--tilt': `${tilt}deg` } as CSSProperties
}
