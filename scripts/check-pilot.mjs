/* global document, innerWidth, innerHeight, requestAnimationFrame */
// Real-browser review harness for the storybook pilot (slice 1). It drives the
// cover, opening, skip, garden, every planting spot, live growth, the journal
// sample, closing and reduced motion at four viewports. Screenshots support the
// learner's visual review; they do not approve the experience.
import { chromium } from 'playwright'
import { access, mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

let executablePath
for (const candidate of [process.env.PILOT_BROWSER, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].filter(Boolean)) {
  try { await access(candidate); executablePath = candidate; break } catch { /* Try next installed browser. */ }
}
const production = process.env.PILOT_PRODUCTION === '1'
const directory = production ? 'test-results/pilot-production' : 'test-results/pilot'
await mkdir(directory, { recursive: true })
const browser = await chromium.launch({ executablePath, headless: true })
const baseURL = process.env.PILOT_URL || 'http://127.0.0.1:5173'
const report = { browser: await browser.version(), baseURL, production, viewports: [] }
const viewports = [{ width: 1366, height: 768 }, { width: 1680, height: 900 }, { width: 390, height: 844 }, { width: 375, height: 667 }]
const stages = ['seed', 'sprout', 'young', 'bud', 'bloom']

function overlap(a, b) {
  return Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) + .5 && Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y) + .5
}
async function box(locator) { const value = await locator.boundingBox(); assert(value, 'Element has no box'); return value }
function inside(target, viewport, label) {
  assert(target.x >= -.5 && target.y >= -.5 && target.x + target.width <= viewport.width + .5 && target.y + target.height <= viewport.height + .5, `Clipped ${label}: ${JSON.stringify(target)}`)
}
function target44(target, label) { assert(target.width >= 44 && target.height >= 44, `${label} smaller than 44×44: ${target.width}×${target.height}`) }
async function noScroll(page) {
  const g = await page.evaluate(() => ({ w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight, vw: innerWidth, vh: innerHeight }))
  assert(g.w <= g.vw && g.h <= g.vh, `Page overflow: ${JSON.stringify(g)}`)
}
async function hits(page, locator, label) {
  const b = await box(locator)
  const ok = await locator.evaluate((element, [x, y]) => { const top = document.elementFromPoint(x, y); return top === element || element.contains(top) }, [b.x + b.width / 2, b.y + b.height / 2])
  assert(ok, `${label} is covered at its centre`)
}
const phase = page => page.locator('.storybook').getAttribute('data-phase')
async function waitPhase(page, value, timeout = 7000) {
  await page.waitForFunction(v => document.querySelector('.storybook')?.dataset.phase === v, value, { timeout })
}
function watch(page, errors) {
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`))
  page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`) })
  page.on('response', r => { if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`) })
  page.on('requestfailed', r => errors.push(`failed: ${r.url()}`))
}
// Frame intervals while a sequence plays, measured on real rendering frames.
async function frames(page, ms) {
  return page.evaluate(duration => new Promise(resolve => {
    const gaps = []; let last = performance.now(); const end = last + duration
    const tick = now => { gaps.push(now - last); last = now; if (now < end) requestAnimationFrame(tick); else resolve(gaps) }
    requestAnimationFrame(tick)
  }), ms).then(gaps => {
    const sorted = gaps.slice(1).sort((a, b) => a - b), at = q => +sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))].toFixed(1)
    return { frames: sorted.length, median: at(.5), p95: at(.95), max: +sorted[sorted.length - 1].toFixed(1) }
  })
}
// Records every growth stage rendered on screen, in order.
async function observeGrowth(page) {
  return page.evaluate(() => new Promise(resolve => {
    const seen = []; const start = performance.now()
    const tick = () => {
      const button = document.querySelector('.flower-button')
      const stage = button?.dataset.stage
      if (stage && seen[seen.length - 1]?.stage !== stage) seen.push({ stage, at: Math.round(performance.now() - start) })
      if (button && !button.classList.contains('flower-button--growing') && stage === 'bloom') resolve(seen)
      else if (performance.now() - start > 9000) resolve(seen)
      else requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }))
}

for (const viewport of viewports) {
  const tag = `${viewport.width}x${viewport.height}`
  const result = { viewport: tag, checks: [] }
  const pass = name => result.checks.push(name)

  // First visit: cover, opening, garden.
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()
  const errors = []; watch(page, errors)
  await page.goto(baseURL); await page.locator('.open-book').waitFor(); await page.waitForTimeout(1100) // card entrance
  assert.equal(await phase(page), 'cover'); await noScroll(page)
  const open = page.locator('.open-book'); const openBox = await box(open)
  inside(openBox, viewport, 'Open My Garden'); target44(openBox, 'Open My Garden'); await hits(page, open, 'Open My Garden')
  inside(await box(page.locator('.cover-front')), viewport, 'closed book')
  await page.screenshot({ path: `${directory}/${tag}-1-cover.png` }); pass('cover: book and Open My Garden visible, no scroll')

  await open.click()
  assert.equal(await phase(page), 'opening')
  assert(await page.locator('.skip-intro').isVisible(), 'Skip not visible from the first frame')
  const openingFrames = frames(page, 4200)
  await page.waitForTimeout(2400); await page.screenshot({ path: `${directory}/${tag}-2-opening.png` })
  result.openingFrames = await openingFrames
  await waitPhase(page, 'garden'); await page.waitForTimeout(700)
  assert.equal(await page.evaluate(() => document.activeElement?.className), 'plant-cta', 'Focus did not move to Plant a Memory')
  assert.equal(await page.evaluate(() => localStorage.getItem('memorygarden.introSeen')), '1')
  await noScroll(page)
  await page.screenshot({ path: `${directory}/${tag}-3-garden.png` }); pass('opening: plays, Skip visible, ends in garden with focus, remembered')

  // Garden controls: inside the viewport, large enough, never overlapping.
  const plant = page.locator('.plant-cta'), close = page.locator('.close-book')
  const plantBox = await box(plant), closeBox = await box(close)
  for (const [b, label] of [[plantBox, 'Plant a Memory'], [closeBox, 'Close my garden']]) { inside(b, viewport, label); target44(b, label) }
  assert(!overlap(plantBox, closeBox), 'Garden controls overlap')
  await hits(page, plant, 'Plant a Memory'); await hits(page, close, 'Close my garden')
  pass('controls: visible, ≥44 px, not overlapping, hittable')

  // Spot selection: all ten spots visible, hittable, and keyboard reachable.
  await plant.click()
  const spots = page.locator('.spot-target')
  assert.equal(await spots.count(), 10, 'Expected ten planting spots')
  assert.equal(await page.evaluate(() => document.activeElement?.classList.contains('spot-target')), true, 'Focus did not move to a spot')
  const ids = []
  for (let i = 0; i < 10; i++) {
    const spot = spots.nth(i); const b = await box(spot)
    inside(b, viewport, `spot ${i + 1}`); target44(b, `spot ${i + 1}`); await hits(page, spot, `spot ${i + 1}`)
    assert(!overlap(b, await box(page.locator('.planting-guide'))), `spot ${i + 1} overlaps the planting guide`)
    ids.push(await spot.getAttribute('data-spot-id'))
  }
  result.spotIds = ids
  await page.screenshot({ path: `${directory}/${tag}-4-selection.png` }); pass('selection: ten stable spots visible, ≥44 px, hittable, focus moves')
  await page.keyboard.press('Escape')
  assert(await plant.isVisible(), 'Escape did not cancel selection')

  // Live growth: every stage is rendered in order on real frames.
  await plant.click(); await page.locator('.spot-target[data-spot-id="glade-04"]').click()
  const growthFrames = frames(page, 3000)
  result.growth = await observeGrowth(page)
  result.growthFrames = await growthFrames
  assert.deepEqual(result.growth.map(s => s.stage), stages, `Growth stages seen: ${JSON.stringify(result.growth)}`)
  await page.waitForTimeout(400)
  const flower = page.locator('.flower-button'); const flowerBox = await box(flower)
  inside(flowerBox, viewport, 'sunflower'); target44(flowerBox, 'sunflower'); await hits(page, flower, 'sunflower')
  await page.screenshot({ path: `${directory}/${tag}-5-bloom.png` }); pass('growth: seed → sprout → young → bud → bloom observed live')

  // Journal sample: opens with focus inside, Escape returns focus to the flower.
  await flower.click(); await page.locator('.journal-book').waitFor(); await page.waitForTimeout(800)
  assert.equal(await page.evaluate(() => document.querySelector('dialog.journal')?.contains(document.activeElement)), true, 'Focus is not inside the journal')
  await page.screenshot({ path: `${directory}/${tag}-6-journal.png` })
  await page.keyboard.press('Escape'); await page.waitForTimeout(200)
  assert.equal(await page.evaluate(() => document.activeElement?.classList.contains('flower-button')), true, 'Focus did not return to the flower')
  pass('journal: opens, traps focus, Escape returns to the flower')

  // Fixed soil anchor across paused stages (development inspector only).
  if (!production) {
    await page.goto(`${baseURL}/?pilot=1`); await waitPhase(page, 'garden')
    await page.locator('.plant-cta').click(); await page.locator('.spot-target[data-spot-id="glade-07"]').click()
    const anchors = []
    for (const stage of stages) {
      await page.locator('.stage-inspector button', { hasText: new RegExp(`^${stage}$`) }).click(); await page.waitForTimeout(150)
      // Stem base relative to its soil spot, so pointer parallax cannot skew it.
      // Painted stages share one frame whose stem base is at (50%, 99.4%).
      anchors.push(await page.locator('.flower-button').evaluate((button, seed) => {
        const art = button.querySelector(seed ? '.seed-grain' : '.flower-stage[data-state="current"]')
        const sway = button.querySelector('.flower-sway'); sway.style.animation = 'none' // the sway pivots on the base but tilts the box
        const r = art.getBoundingClientRect(), soil = button.closest('.spot').getBoundingClientRect()
        sway.style.animation = ''
        return [+(r.x + r.width / 2 - soil.x).toFixed(2), +(r.y + r.height * (seed ? 1 : .994) - soil.y).toFixed(2)]
      }, stage === 'seed'))
      const fb = await box(page.locator('.flower-button'))
      await page.screenshot({ path: `${directory}/${tag}-stage-${stage}.png`, clip: { x: Math.max(0, fb.x - 40), y: Math.max(0, fb.y - 20), width: fb.width + 80, height: fb.height + 50 } })
    }
    result.anchors = anchors
    const [, ...painted] = anchors // the drawn seed sits on the soil, just above the stem base
    assert(painted.every(([x, y]) => Math.abs(x - painted[0][0]) < .5 && Math.abs(y - painted[0][1]) < .5), `Soil anchor moved: ${JSON.stringify(anchors)}`)
    assert(Math.abs(anchors[0][0] - painted[0][0]) < 1 && Math.abs(anchors[0][1] - painted[0][1]) < 4, `Seed is off the stem base: ${JSON.stringify(anchors)}`)
    pass('anchor: stem base fixed across all paused stages')
  } else {
    await page.goto(`${baseURL}/?pilot=1`); await waitPhase(page, 'garden')
    assert.equal(await page.locator('.stage-inspector').count(), 0, 'Stage inspector visible in production')
    pass('production: stage inspector absent even with ?pilot=1')
  }

  // Returning visit goes straight to the garden; closing returns to the cover.
  await page.goto(baseURL); await page.waitForTimeout(300)
  assert.equal(await phase(page), 'garden', 'Returning visit did not enter the garden directly')
  await page.locator('.close-book').click()
  assert.equal(await phase(page), 'closing')
  await page.waitForTimeout(1500); await page.screenshot({ path: `${directory}/${tag}-7-closing.png` })
  await waitPhase(page, 'cover')
  await page.waitForTimeout(100)
  assert.equal(await page.evaluate(() => document.activeElement?.className), 'open-book', 'Focus did not return to Open My Garden')
  await page.locator('.open-book').click(); await page.locator('.skip-intro').click()
  assert.equal(await phase(page), 'garden', 'Skip did not go straight to the garden')
  pass('return: direct entry, Close my garden → cover, replay, Skip')
  await noScroll(page)
  result.errors = errors
  assert.deepEqual(errors, [], `Runtime errors: ${errors.join('; ')}`)
  pass('runtime: no console, page or HTTP errors')
  await context.close()

  // Reduced motion: instant transitions, instant bloom, every spot plantable.
  const calm = await browser.newContext({ viewport, reducedMotion: 'reduce' })
  const quiet = await calm.newPage(); const quietErrors = []; watch(quiet, quietErrors)
  await quiet.goto(baseURL); await quiet.locator('.open-book').click()
  assert.equal(await phase(quiet), 'garden', 'Reduced motion did not skip the opening')
  for (const id of ids) {
    await quiet.locator('.plant-cta').click(); await quiet.locator(`.spot-target[data-spot-id="${id}"]`).click()
    const flowerNow = quiet.locator(`.flower-button[data-spot-id="${id}"]`)
    assert.equal(await flowerNow.getAttribute('data-stage'), 'bloom', `Reduced motion did not bloom immediately at ${id}`)
    const b = await box(flowerNow); inside(b, viewport, `flower at ${id}`); target44(b, `flower at ${id}`)
  }
  const running = await quiet.evaluate(() => document.getAnimations().filter(a => a.playState === 'running' && a.effect?.target?.closest?.('.world')).length)
  assert.equal(running, 0, `Reduced motion still runs ${running} world animations`)
  await quiet.screenshot({ path: `${directory}/${tag}-8-reduced.png` })
  await quiet.locator('.close-book').click()
  assert.equal(await phase(quiet), 'cover', 'Reduced motion did not close instantly')
  assert.deepEqual(quietErrors, [], `Reduced-motion errors: ${quietErrors.join('; ')}`)
  pass('reduced motion: instant open/close and bloom at all ten spots, no world animation')
  await calm.close()

  report.viewports.push(result)
  console.log(`✓ ${tag}: ${result.checks.length} checks · opening frames median ${result.openingFrames.median} ms, p95 ${result.openingFrames.p95} ms`)
}

await writeFile(`${directory}/report.json`, JSON.stringify(report, null, 2))
await browser.close()
console.log(`Report: ${directory}/report.json`)
