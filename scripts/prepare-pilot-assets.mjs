import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'

// Export only: the generated paintings remain unmodified in artwork/source.
const flowerSource = 'artwork/source/sunflower-v1.png'
const { data, info } = await sharp(flowerSource).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
let lastPaintedRow = 0
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 16) lastPaintedRow = y
  }
}
await mkdir('public/assets/flowers/sunflower', { recursive: true })
await mkdir('public/assets/garden', { recursive: true })
const garden = await sharp('artwork/source/garden-v1.png')
  .webp({ quality: 84, effort: 6 }).toFile('public/assets/garden/base.webp')
const flower = await sharp(flowerSource)
  .extract({ left: 0, top: 0, width: info.width, height: lastPaintedRow + 1 })
  .resize(768, 1024, { fit: 'contain', position: 'bottom', background: '#00000000' })
  .webp({ quality: 86, alphaQuality: 100, effort: 6 })
  .toFile('public/assets/flowers/sunflower/bloom.webp')
const { data: alphaData, info: alphaInfo } = await sharp('public/assets/flowers/sunflower/bloom.webp')
  .ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const alpha = { transparent: 0, translucent: 0, opaque: 0 }
for (let i = 3; i < alphaData.length; i += 4) {
  if (alphaData[i] === 0) alpha.transparent++
  else if (alphaData[i] === 255) alpha.opaque++
  else alpha.translucent++
}
const report = {
  garden: { width: garden.width, height: garden.height, bytes: garden.size },
  sunflower: { width: flower.width, height: flower.height, bytes: flower.size, hasAlpha: true,
    alphaPixels: alpha, totalPixels: alphaInfo.width * alphaInfo.height, soilAnchor: [0.5, 1],
    sourceLastPaintedRow: lastPaintedRow },
}
await writeFile('artwork/export-metrics.json', JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify(report, null, 2))
