/* global document */
// Quick real-browser smoke run of the whole memory journey on desktop and
// phone, with screenshots for visual review (test-results/smoke/).
import { chromium } from 'playwright'
import sharp from 'sharp'
import { access, mkdir } from 'node:fs/promises'
import assert from 'node:assert/strict'

let executablePath
for (const candidate of [process.env.PILOT_BROWSER, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].filter(Boolean)) {
  try { await access(candidate); executablePath = candidate; break } catch { /* try the next browser */ }
}
const url = process.env.PILOT_URL || 'http://127.0.0.1:5173'
const out = 'test-results/smoke'
await mkdir(out, { recursive: true })
const photo = await sharp({ create: { width: 1200, height: 900, channels: 3, background: '#d9a86c' } })
  .composite([{ input: Buffer.from('<svg width="1200" height="900"><circle cx="600" cy="420" r="260" fill="#f6e3b0"/><rect y="640" width="1200" height="260" fill="#7a9a5a"/></svg>') }]).png().toBuffer()
const browser = await chromium.launch({ executablePath, headless: true })

for (const viewport of [{ width: 1366, height: 768 }, { width: 390, height: 844 }]) {
  const tag = `${viewport.width}x${viewport.height}`
  const page = await (await browser.newContext({ viewport })).newPage()
  const errors = []
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  const shot = name => page.screenshot({ path: `${out}/${tag}-${name}.png` })

  await page.goto(url); await page.locator('.open-book').click(); await page.locator('.skip-intro').click()
  await page.locator('.plant-cta').click()
  const journal = page.locator('dialog.journal')
  await journal.locator('.field--title input').fill('Together Again')
  await journal.locator('.field--feeling input').fill('Friendship and a little nostalgia')
  await journal.locator('.field--story textarea').fill('Same silly conversations, different chapter, but still us.\n\nWe stayed by the café window until the lights came on.')
  await journal.locator('.photo-add input').setInputFiles({ name: 'cafe.png', mimeType: 'image/png', buffer: photo })
  await journal.locator('.photo-slot img').waitFor()
  await page.waitForTimeout(900); await shot('1-write')
  await journal.getByRole('button', { name: 'Preview' }).click(); await page.waitForTimeout(400); await shot('2-preview')
  await journal.getByRole('button', { name: 'Plant this memory' }).click()
  await page.waitForFunction(() => !document.querySelector('dialog.journal[open]'))
  await page.waitForTimeout(2600); await shot('3-bloom')
  assert.equal(await page.locator('.flower-button').count(), 1, 'one flower after planting')

  await page.reload(); await page.waitForTimeout(800)
  assert.equal(await page.locator('.flower-button').count(), 1, 'flower survives refresh')
  await page.getByRole('button', { name: 'Open memory: Together Again' }).click(); await page.waitForTimeout(500); await shot('4-read')
  await journal.getByRole('button', { name: 'Edit page' }).click()
  await journal.locator('.field--title input').fill('Together Again, Always')
  await journal.getByRole('button', { name: 'Save changes' }).click(); await page.waitForTimeout(300)
  assert.equal(await journal.locator('.page-title').textContent(), 'Together Again, Always', 'edit saved')
  await journal.getByRole('button', { name: 'Back to garden' }).last().click()

  // Draft survives refresh.
  await page.locator('.spot-target').first().click()
  await journal.locator('.field--story textarea').fill('An unfinished thought about the first snow.')
  await page.waitForTimeout(900); await page.keyboard.press('Escape'); await page.waitForTimeout(300)
  await page.reload(); await page.waitForTimeout(800)
  await page.locator('.draft-card').waitFor(); await shot('5-draft-prompt')
  await page.getByRole('button', { name: 'Continue writing' }).click()
  assert.equal(await journal.locator('.field--story textarea').inputValue(), 'An unfinished thought about the first snow.', 'draft restored')
  await journal.getByRole('button', { name: 'Discard draft' }).click(); await journal.getByRole('button', { name: 'Discard Draft' }).click()

  // Delete with confirmation.
  await page.getByRole('button', { name: 'Open memory: Together Again, Always' }).click()
  await journal.getByRole('button', { name: 'Delete…' }).click(); await shot('6-confirm-delete')
  await journal.getByRole('button', { name: 'Delete Forever' }).click(); await page.waitForTimeout(300)
  await page.reload(); await page.waitForTimeout(800)
  assert.equal(await page.locator('.flower-button').count(), 0, 'deletion persists')
  assert.deepEqual(errors, [], `errors: ${errors.join('; ')}`)
  console.log(`✓ ${tag}: plant, preview, bloom, refresh, read, edit, draft, delete`)
}
await browser.close()
