/* global document, innerWidth, innerHeight, requestAnimationFrame, matchMedia */
import { chromium } from 'playwright'
import { access, mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import sharp from 'sharp'

const candidates = [process.env.PILOT_BROWSER, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].filter(Boolean)
let executablePath
for (const candidate of candidates) { try { await access(candidate); executablePath = candidate; break } catch { /* Try the next installed browser. */ } }
const directory = 'test-results/pilot-revision'
await mkdir(directory, { recursive: true })
const browser = await chromium.launch({ executablePath, headless: true })
const baseURL = process.env.PILOT_URL || 'http://127.0.0.1:5173'
const report = { browser: await browser.version(), baseURL, browserDefaultReducedMotion: null, checks: [] }
const viewports = [{ width: 1366, height: 768 }, { width: 1680, height: 900 }, { width: 390, height: 844 }, { width: 375, height: 667 }]

function overlap(a, b) {
  return Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) + .5 && Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y) + .5
}
async function box(locator) { const value = await locator.boundingBox(); assert(value); return value }
async function fitsViewport(page) {
  const geometry = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight, viewportWidth: innerWidth, viewportHeight: innerHeight }))
  assert(geometry.height <= geometry.viewportHeight, `Vertical page overflow: ${JSON.stringify(geometry)}`)
  assert(geometry.width <= geometry.viewportWidth, `Horizontal page overflow: ${JSON.stringify(geometry)}`)
  for (const button of await page.getByRole('button').all()) {
    if (!await button.isVisible()) continue
    const target = await box(button)
    assert(target.x >= 0 && target.y >= 0 && target.x + target.width <= geometry.viewportWidth + .5 && target.y + target.height <= geometry.viewportHeight + .5, `Clipped button: ${await button.getAttribute('aria-label') || await button.innerText()}`)
    assert(target.width >= 44 && target.height >= 44, 'Every control meets the 44 CSS px target')
    const reachable = await button.evaluate(el => {
      const rect = el.getBoundingClientRect()
      const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
      return hit === el || el.contains(hit)
    })
    assert(reachable, `Covered button: ${await button.getAttribute('aria-label') || await button.innerText()}`)
  }
  assert(!overlap(await box(page.locator('.wordmark')), await box(page.locator('.tools-toggle'))), 'Header controls remain separate')
  const dock = page.locator('.garden-dock')
  assert(!overlap(await box(dock.locator('.bloom-message')), await box(dock.locator('.plant-action'))))
  assert(!overlap(await box(dock.locator('.plant-action')), await box(dock.locator('.pilot-disclosure'))))
  return geometry
}
async function panelFits(page) {
  const panel = await box(page.locator('.pilot-panel'))
  const stage = await box(page.locator('.garden-stage'))
  assert(panel.y >= stage.y && panel.y + panel.height <= stage.y + stage.height, 'Panel stays in its scene area')
  assert(!overlap(panel, await box(page.locator('.flower-button'))), 'Panel does not collide with the flower')
  assert(!overlap(panel, await box(page.locator('.garden-header'))))
  assert(!overlap(panel, await box(page.locator('.garden-dock'))))
  const contentFits = await page.locator('.pilot-panel').evaluate(el => el.scrollHeight <= el.clientHeight && el.scrollWidth <= el.clientWidth)
  assert(contentFits, 'Full card content visible without internal clipping')
  assert(!overlap(await box(page.locator('.panel-heading h2')), await box(page.locator('.panel-close'))))
  await fitsViewport(page)
  return panel
}
async function screenshot(page, label) {
  const path = `${directory}/${label}.png`
  await page.screenshot({ path, fullPage: true })
  const metadata = await sharp(path).metadata()
  const viewport = page.viewportSize()
  assert.equal(metadata.width, viewport.width)
  assert.equal(metadata.height, viewport.height, 'Full-page screenshot is exactly one viewport, not a cropped tall page')
}

try {
  // No emulation: query the browser's actual default, independently of normal/reduced test contexts.
  const system = await browser.newPage()
  report.browserDefaultReducedMotion = await system.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  await system.close()
  for (const viewport of viewports) {
    const label = `${viewport.width}x${viewport.height}`
    const context = await browser.newContext({ viewport, reducedMotion: 'no-preference', hasTouch: viewport.width < 600,
      ...(process.env.PILOT_VIDEO === '1' ? { recordVideo: { dir: `${directory}/video`, size: viewport } } : {}) })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
    await page.goto(baseURL, { waitUntil: 'networkidle' })
    const action = page.getByRole('button', { name: 'Plant a sunflower', exact: true })
    await action.waitFor({ state: 'visible' })
    await page.waitForFunction(() => !document.querySelector('.plant-action').disabled)
    const geometry = await fitsViewport(page)
    await screenshot(page, `${label}-empty`)
    await action.focus()
    assert.equal(await action.evaluate(el => el.matches(':focus-visible')), true)
    const frames = page.evaluate(() => new Promise((resolve, reject) => {
      const observed = []
      const gaps = []
      const start = performance.now()
      let previous = start
      function frame(now) {
        const main = document.querySelector('main')
        const stage = main.dataset.stage
        gaps.push(now - previous)
        previous = now
        if (observed.at(-1)?.stage !== stage) observed.push({ stage, atMs: Math.round(now - start) })
        if (stage === 'bloom' && main.dataset.playing === 'false') {
          gaps.sort((a,b) => a-b)
          resolve({ observed, localHeadlessFramePacing: { medianMs: Math.round(gaps[Math.floor(gaps.length / 2)] * 10) / 10, p95Ms: Math.round(gaps[Math.floor(gaps.length * .95)] * 10) / 10, maxMs: Math.round(gaps.at(-1) * 10) / 10 } })
        } else if (now - start > 15000) reject(new Error('Bloom sequence did not complete'))
        else requestAnimationFrame(frame)
      }
      requestAnimationFrame(frame)
    }))
    await page.keyboard.press('Enter')
    await page.waitForFunction(() => document.querySelector('main').dataset.stage === 'bloom' && document.querySelector('main').dataset.playing === 'false')
    const animation = await frames
    assert.deepEqual(animation.observed.filter(item => item.stage !== 'empty').map(item => item.stage), ['seed', 'sprout', 'young', 'bloom'], 'All four stages were observed on rendering frames')
    const flower = page.getByRole('button', { name: 'Explore the sunflower' })
    const flowerBox = await box(flower)
    const sceneBox = await box(page.locator('.garden-stage'))
    assert(flowerBox.y >= sceneBox.y && flowerBox.y + flowerBox.height < sceneBox.y + sceneBox.height, 'Full flower remains inside the scene')
    await fitsViewport(page)
    await screenshot(page, `${label}-bloom`)
    if (viewport.width < 600) await flower.tap()
    else { await flower.focus(); await page.keyboard.press('Enter') }
    await page.getByRole('heading', { name: 'Sunflower', exact: true }).waitFor()
    const cardBox = await panelFits(page)
    assert.equal(await page.getByRole('button', { name: 'Close preview panel' }).evaluate(el => el === document.activeElement), true)
    await screenshot(page, `${label}-card`)
    await page.keyboard.press('Escape')
    assert.equal(await flower.evaluate(el => el === document.activeElement), true)
    await page.getByRole('button', { name: 'Preview tools', exact: true }).click()
    await panelFits(page)
    await screenshot(page, `${label}-tools`)
    const anchors = []
    const paintedHeights = {}
    for (const [name, value] of [['Seed','seed'], ['Sprout','sprout'], ['Young plant','young'], ['Bloom','bloom']]) {
      await page.getByRole('button', { name, exact: true }).click()
      const art = await box(page.locator('.bloom-art'))
      anchors.push({ stage: value, x: art.x + art.width / 2, y: art.y + art.height })
      if (value === 'sprout' || value === 'young') {
        paintedHeights[value] = await page.locator('.early-growth').evaluate(el => el.querySelector(':scope > g').getBBox().height * el.getBoundingClientRect().height / 320)
      }
      await panelFits(page)
      await screenshot(page, `${label}-stage-${value}`)
    }
    assert(anchors.every(anchor => Math.abs(anchor.x - anchors[0].x) < .5 && Math.abs(anchor.y - anchors[0].y) < .5), 'Same soil anchor for all stages')
    assert(paintedHeights.young > paintedHeights.sprout * 1.8, 'Sprout and young plant have visibly distinct silhouettes/heights')
    await page.getByRole('button', { name: 'Motion preference ⓘ' }).click()
    await panelFits(page)
    await screenshot(page, `${label}-motion-normal`)
    await page.keyboard.press('Escape')
    assert.equal(await page.getByRole('button', { name: 'Preview tools', exact: true }).evaluate(el => el === document.activeElement), true)
    await page.getByRole('button', { name: 'Replay the bloom' }).click()
    await page.waitForFunction(() => document.querySelector('main').dataset.playing === 'false')
    assert.equal(await page.locator('.flower-painting').count(), 1)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.getByRole('button', { name: 'Replay the bloom' }).click()
    assert.equal(await page.locator('main').getAttribute('data-stage'), 'bloom')
    assert.equal(await page.locator('main').getAttribute('data-playing'), 'false')
    assert.equal(await page.evaluate(() => document.getAnimations().filter(item => item.playState === 'running').length), 0)
    await page.getByRole('button', { name: 'Preview tools', exact: true }).click()
    await page.getByRole('button', { name: 'Reduced motion ⓘ' }).click()
    await panelFits(page)
    await screenshot(page, `${label}-motion-reduced`)
    await page.keyboard.press('Escape')
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.getByRole('button', { name: 'Replay the bloom' }).click()
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.waitForFunction(() => document.querySelector('main').dataset.stage === 'bloom' && document.querySelector('main').dataset.playing === 'false')
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    assert.equal(await page.locator('main').getAttribute('data-playing'), 'false')
    assert.deepEqual(errors, [])
    report.checks.push({ viewport, geometry, flowerBox, cardBox, normalMotionFrames: animation,
      stableSoilAnchors: anchors, paintedStageHeights: paintedHeights, reducedMotion: 'passed', livePreferenceChange: 'passed', keyboardFocusAndTouchTargets: 'passed', panelCollisions: 'none', errors })
    const video = page.video()
    await context.close()
    if (video) await video.saveAs(`${directory}/${label}-review.webm`)
    console.log(`${label}: viewport, controls, growth, panels, focus and motion checks passed`)
  }
  await writeFile(`${directory}/report.json`, JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report, null, 2))
} finally { await browser.close() }
