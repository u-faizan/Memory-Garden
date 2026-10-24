// Stable logical spot IDs. Each layout places every ID on its own painted lawn,
// clear of the path and foreground foliage; switching layout (or, later,
// atmosphere) never reassigns a memory.
export const spotIds = ['glade-01', 'glade-02', 'glade-03', 'glade-04', 'glade-05', 'glade-06', 'glade-07', 'glade-08', 'glade-09', 'glade-10'] as const
export type SpotId = typeof spotIds[number]
export type LayoutName = 'wide' | 'tall'

export interface Spot { id: SpotId; x: number; y: number; depth: number }

export interface WorldLayout {
  name: LayoutName
  width: number            // coordinate space matching the painted plate's aspect
  height: number
  plate: string
  leaves: string
  spots: readonly Spot[]
  flowerUnit: string       // flower height at depth 1, in world container units
}

const place = (coords: readonly (readonly [number, number, number])[]) =>
  coords.map(([x, y, depth], i): Spot => ({ id: spotIds[i], x, y, depth }))

export const layouts: Record<LayoutName, WorldLayout> = {
  wide: {
    name: 'wide', width: 1600, height: 900,
    plate: '/assets/garden/desktop.webp', leaves: '/assets/garden/leaves-desktop.webp',
    spots: place([[440, 440, .6], [1280, 450, .6], [270, 540, .7], [660, 522, .7], [1120, 540, .72], [440, 645, .8], [1250, 690, .86], [640, 775, .92], [1080, 780, .92], [1380, 575, .74]]),
    flowerUnit: '30cqh',
  },
  tall: {
    name: 'tall', width: 800, height: 1600,
    plate: '/assets/garden/phone.webp', leaves: '/assets/garden/leaves-phone.webp',
    spots: place([[190, 520, .6], [690, 540, .6], [250, 660, .7], [660, 690, .7], [170, 820, .8], [640, 840, .8], [250, 980, .88], [620, 1000, .9], [180, 1150, .96], [600, 1180, 1]]),
    flowerUnit: '38cqw',
  },
}

export function soilSize(layout: WorldLayout, depth: number) {
  const base = layout.name === 'wide' ? 82 : 84
  return { rx: base * depth, ry: base * depth * .3 }
}

export const soilSprites = ['/assets/soil/soil-01.webp', '/assets/soil/soil-02.webp', '/assets/soil/soil-03.webp']
