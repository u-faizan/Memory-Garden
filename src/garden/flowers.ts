// The six memory flowers. Meanings are gentle suggestions, never rules.
// `available` turns on once a species' painted growth sheet has been exported
// by `npm run assets`, so the picker never offers a flower that cannot grow.
export const flowerCatalog = [
  { id: 'sunflower', name: 'Sunflower', meaning: 'Joy and celebration', available: true },
  { id: 'lavender', name: 'Lavender', meaning: 'Peace and friendship', available: true },
  { id: 'rose', name: 'Rose', meaning: 'Love and connection', available: true },
  { id: 'daisy', name: 'Daisy', meaning: 'Small everyday moments', available: true },
  { id: 'forget-me-not', name: 'Forget-me-not', meaning: 'Remembrance', available: true },
  { id: 'iris', name: 'Iris', meaning: 'Hope and growth', available: true },
] as const

export type FlowerType = typeof flowerCatalog[number]['id']
export const availableFlowers = flowerCatalog.filter(flower => flower.available)
export const flowerInfo = (type: FlowerType) => flowerCatalog.find(flower => flower.id === type)!
export const flowerArt = (type: FlowerType, stage: string) => `/assets/flowers/${type}/${stage}.webp`
