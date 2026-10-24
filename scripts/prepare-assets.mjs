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

// Set 03 sheets are JPEGs with a painted checkerboard instead of real alpha.
// Flood-fill the checker greys from the border to make them transparent, slice
// the four plants by their column gaps, then scale each species (one factor per
// sheet) and anchor every stage's stem base at the shared soil point.
async function checkerSheet(file, flower, bloomHeight) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const at = i => [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]]
  const lum = ([r, g, b]) => (r + g + b) / 3
  const neutral = ([r, g, b]) => Math.max(r, g, b) - Math.min(r, g, b) <= 14
  // The two checker tones, sampled along the border.
  const tones = []
  for (let x = 0; x < w; x += 7) for (const y of [0, h - 1]) { const p = at(y * w + x); if (neutral(p)) tones.push(lum(p)) }
  tones.sort((a, b) => a - b)
  const low = tones[Math.floor(tones.length * .25)], high = tones[Math.floor(tones.length * .75)]
  const isChecker = p => neutral(p) && (Math.abs(lum(p) - low) < 22 || Math.abs(lum(p) - high) < 22 || lum(p) < 45)
  const background = new Uint8Array(w * h), queue = new Int32Array(w * h)
  let head = 0, tail = 0
  const push = i => { if (!background[i] && isChecker(at(i))) { background[i] = 1; queue[tail++] = i } }
  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x) }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1) }
  while (head < tail) {
    const i = queue[head++], x = i % w
    if (x > 0) push(i - 1); if (x < w - 1) push(i + 1); if (i >= w) push(i - w); if (i < w * (h - 1)) push(i + w)
  }
  // Checker pockets enclosed by leaves: tight tone match surrounded by more checker.
  const tight = p => Math.max(...p) - Math.min(...p) <= 9 && (Math.abs(lum(p) - low) < 13 || Math.abs(lum(p) - high) < 13)
  const pocket = new Uint8Array(w * h)
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x
    if (background[i] || !tight(at(i))) continue
    let near = 0
    for (const d of [-w - 1, -w, -w + 1, -1, 1, w - 1, w, w + 1]) if (background[i + d] || isChecker(at(i + d))) near++
    if (near >= 7) pocket[i] = 1
  }
  for (let i = 0; i < w * h; i++) if (pocket[i]) background[i] = 1
  // Tiny stray specks, and shapes that are almost all grey, are not plants.
  const seen = new Uint8Array(w * h)
  for (let start = 0; start < w * h; start++) {
    if (background[start] || seen[start]) continue
    const members = [start]; seen[start] = 1
    for (let k = 0; k < members.length; k++) {
      const i = members[k], x = i % w
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) if (j >= 0 && j < w * h && !background[j] && !seen[j]) { seen[j] = 1; members.push(j) }
    }
    const grey = members.filter(i => neutral(at(i))).length / members.length
    if (members.length <= 400 || grey > .8) for (const i of members) background[i] = 1 // specks and leftover checker squares
  }
  // Drop the greyish antialiased fringe next to the removed background.
  const alpha = Buffer.alloc(w * h, 255)
  for (let i = 0; i < w * h; i++) {
    if (background[i]) { alpha[i] = 0; continue }
    const x = i % w, edge = (x > 0 && background[i - 1]) || (x < w - 1 && background[i + 1]) || background[i - w] || background[i + w]
    if (edge && neutral(at(i))) alpha[i] = 0
  }
  const rgba = await sharp(data, { raw: { width: w, height: h, channels: 3 } })
    .joinChannel(await sharp(alpha, { raw: { width: w, height: h, channels: 1 } }).blur(.6).extractChannel(0).raw().toBuffer(), { raw: { width: w, height: h, channels: 1 } })
    .png().toBuffer()
  // Four plants, separated by empty columns.
  const filled = Array.from({ length: w }, (_, x) => { let n = 0; for (let y = 0; y < h; y++) if (alpha[y * w + x] > 128) n++; return n })
  const groups = []
  for (let x = 0; x < w; x++) {
    if (filled[x] <= 10) continue // thin painted ground lines are not plants
    const last = groups[groups.length - 1]
    if (last && x - last[1] < 40) { last[1] = x; last[2] += filled[x] } else groups.push([x, x, filled[x]])
  }
  const plants = groups.sort((a, b) => b[2] - a[2]).slice(0, 4).sort((a, b) => a[0] - b[0])
  if (plants.length !== 4) throw new Error(`${flower}: expected 4 plants, found ${plants.length}`)
  const boxes = plants.map(([x0, x1]) => {
    let y0 = h, y1 = 0
    for (let y = 0; y < h; y++) { let n = 0; for (let x = x0; x <= x1; x++) if (alpha[y * w + x] > 128) n++; if (n > 2 && n < (x1 - x0) * .97) { y0 = Math.min(y0, y); y1 = Math.max(y1, y) } }
    return { x0, x1, y0, y1 }
  })
  const bloom = boxes[3]
  const scale = Math.min(bloomHeight / (bloom.y1 - bloom.y0 + 1), 1000 / (bloom.x1 - bloom.x0 + 1))
  const dir = `${out}/flowers/${flower}`
  await mkdir(dir, { recursive: true })
  for (const [index, stage] of ['sprout', 'young', 'bud', 'bloom'].entries()) {
    const { x0, x1, y0, y1 } = boxes[index]
    const crop = await sharp(rgba).extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }).png().toBuffer()
    const base = await stemBase(crop)
    const width = Math.max(1, Math.round((x1 - x0 + 1) * scale)), height = Math.max(1, Math.round((y1 - y0 + 1) * scale))
    let sized = await sharp(crop).resize(width, height).png().toBuffer()
    let left = Math.round(anchor.x - base.x * scale), top = Math.round(anchor.y - base.y * scale)
    // Keep the plant inside the frame; trim any overhang rather than fail.
    const cut = { left: Math.max(0, -left), top: Math.max(0, -top) }
    const keepW = Math.min(width - cut.left, panel.width - Math.max(0, left)), keepH = Math.min(height - cut.top, panel.height - Math.max(0, top))
    if (cut.left || cut.top || keepW < width || keepH < height) sized = await sharp(sized).extract({ left: cut.left, top: cut.top, width: keepW, height: keepH }).png().toBuffer()
    left = Math.max(0, left); top = Math.max(0, top)
    const framed = await sharp({ create: { ...panel, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite([{ input: sized, left, top }]).png().toBuffer()
    await webp(framed, `${dir}/${stage}.webp`, { quality: 86, alpha: true })
  }
  console.log(`  ${flower}: scale ${scale.toFixed(3)}`)
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
const set3 = `${source}/set-03`
await checkerSheet(`${set3}/Lavender.jfif`, 'lavender', 1300)
await checkerSheet(`${set3}/Rose.jfif`, 'rose', 1380)
await checkerSheet(`${set3}/Daisy.jfif`, 'daisy', 900)
await checkerSheet(`${set3}/Forget-Me.jfif`, 'forget-me-not', 1050)
await checkerSheet(`${set3}/Iris.jfif`, 'iris', 1500)

await mkdir('artwork/provenance', { recursive: true })
await copyFile(`${set2}/prompts-and-provenance.json`, 'artwork/provenance/set-02-prompts.json')
await copyFile(`${set1}/README.txt`, 'artwork/provenance/set-01-readme.txt')
await copyFile(`${set2}/README.txt`, 'artwork/provenance/set-02-readme.txt')
