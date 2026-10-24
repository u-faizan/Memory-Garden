// Converts the learner-generated source art (kept privately in context/art-source)
// into optimized runtime WebP files under public/assets. Flower growth sheets are
// sliced and every stage is shifted so its stem base sits on one soil anchor.
import sharp from 'sharp'
import { mkdir, stat, copyFile } from 'node:fs/promises'

const source = process.env.ASSET_SOURCE || 'context/art-source'
const set1 = `${source}/set-01`, set2 = `${source}/set-02`
const out = 'public/assets'
const panel = { width: 1024, height: 2048 }
export const anchor = { x: 512, y: 2036 } // stem base inside every stage frame

async function webp(input, output, { width, quality = 82, alpha = false } = {}) {
  await mkdir(output.slice(0, output.lastIndexOf('/')), { recursive: true })
  let image = sharp(input)
  if (width) image = image.resize({ width })
  await image.webp({ quality, alphaQuality: alpha ? 90 : undefined, effort: 6, smartSubsample: true }).toFile(output)
  console.log(`${output}  ${((await stat(output)).size / 1024).toFixed(0)} KB`)
}

// Finds the stem base: the centre of the lowest opaque run of pixels in a panel.
async function stemBase(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let y = info.height - 1; y >= 0; y--) {
    const xs = []
    for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 160) xs.push(x)
    if (xs.length >= 3) return { x: (xs[0] + xs[xs.length - 1]) / 2, y }
  }
  throw new Error('Empty panel')
}

async function growthSheet(file, flower, stages) {
  const dir = `${out}/flowers/${flower}`
  await mkdir(dir, { recursive: true })
  for (const [index, stage] of stages.entries()) {
    const crop = await sharp(file).extract({ left: index * panel.width, top: 0, ...panel }).png().toBuffer()
    const base = await stemBase(crop)
    const dx = Math.round(anchor.x - base.x), dy = Math.round(anchor.y - base.y)
    const aligned = await sharp({ create: { ...panel, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: crop, left: dx, top: dy }]).png().toBuffer()
    await webp(aligned, `${dir}/${stage}.webp`, { quality: 86, alpha: true })
    console.log(`  ${stage}: stem base (${base.x.toFixed(0)}, ${base.y}) shifted by (${dx}, ${dy})`)
  }
}

await webp(`${set1}/garden-desktop.png`, `${out}/garden/desktop.webp`, { quality: 80 })
await webp(`${set1}/garden-phone.png`, `${out}/garden/phone.webp`, { quality: 80 })
await webp(`${set1}/foreground-leaves-desktop.png`, `${out}/garden/leaves-desktop.webp`, { quality: 84, alpha: true })
await webp(`${set1}/foreground-leaves-phone.png`, `${out}/garden/leaves-phone.webp`, { quality: 84, alpha: true })
await webp(`${set1}/desk-scene.png`, `${out}/book/desk.webp`, { quality: 78 })
await webp(`${set2}/book-cover-front.png`, `${out}/book/cover.webp`, { quality: 84, alpha: true })
await webp(`${set2}/book-endpaper.png`, `${out}/book/endpaper.webp`, { quality: 80, alpha: true })
for (const n of ['01', '02', '03']) await webp(`${set2}/soil-patch-${n}.png`, `${out}/soil/soil-${n}.webp`, { quality: 84, alpha: true })
await growthSheet(`${set2}/sunflower-growth-sheet.png`, 'sunflower', ['sprout', 'young', 'bud', 'bloom'])

await mkdir('artwork/provenance', { recursive: true })
await copyFile(`${set2}/prompts-and-provenance.json`, 'artwork/provenance/set-02-prompts.json')
await copyFile(`${set1}/README.txt`, 'artwork/provenance/set-01-readme.txt')
await copyFile(`${set2}/README.txt`, 'artwork/provenance/set-02-readme.txt')
