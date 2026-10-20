# MemoryGarden — Where Memories Bloom

A little illustrated world where personal memories become flowers.

**Current milestone: Slice 1 visually rejected; application implementation stopped pending a design decision.** Review [the garden composition proposals](devpost/design-proposal.html) or [the written proposal](devpost/design-proposal.md). The existing garden, sunflower and growth code are preserved for reuse; passing technical checks did not establish visual acceptance. Writing, storage, photos and AI remain later work. This preview does not save memories.

## Try it locally

Use Node 22.14.0 (or a compatible Node version ≥22.12) and npm.

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:5173/** for the preserved, unapproved pilot, or **http://127.0.0.1:5173/devpost/design-proposal.html** for the design decision. In Windows PowerShell, use `npm.cmd` if local execution policy blocks `npm.ps1`.

1. Click **Plant a sunflower** and watch seed → sprout → young plant → bloom.
2. Click the sunflower to explore its botanical note. Escape closes the note.
3. Replay the bloom. The preserved revision's **Preview tools** contain individual stages and Clear spot. These tools are not part of the proposed product layout.
4. Try a narrow viewport and your system/browser's reduced-motion preference. Reduced motion reveals the final flower immediately.

The stage inspector is temporary pilot UI. It will leave the product interface after review.

## Verify

```sh
npm run typecheck
npm run lint
npm run build
npm run check:pilot
```

Keep the development server running for `check:pilot`. It uses installed Chrome/Edge when available, or Playwright's installed Chromium. Set `PILOT_BROWSER` to another Chromium executable if needed. The revised harness checks 1366×768, 1680×900, 390×844 and 375×667; screenshots/report go into ignored `test-results/pilot-revision/`. Those checks passed, but the learner rejected the visual experience. They are not design acceptance.

For the production build, run `npm run preview`, then set `PILOT_URL=http://127.0.0.1:4173` before running the browser check. Set `PILOT_VIDEO=1` to record the desktop/mobile interactions as WebM; frame measurements during recording include that overhead.

## Visual foundation

- React + Vite + TypeScript with custom CSS; no animation framework is needed for this pilot.
- One custom painted environment and one separate alpha-preserving WebP flower. SVG/CSS provide reusable early growth stages.
- Scene and interactive flower share one coordinate plane, with a deliberate mobile position.
- The preserved revision holds each growth stage for about 3.2 seconds in total, plus rendering frames. Reduced motion removes growth and ambient movement. The revised direction and live pilot require learner approval before further work.
- All assets and fonts load locally. No accounts, AI requests, tracking, or remote memory storage exist in this slice.

See [the art manifest](artwork/manifest.md) for exact exports and provenance, [the pilot evidence](devpost/pilot-evidence.md) for verification, and [the approved build checklist](devpost/checklist.md) for subsequent work. Markdown scope/PRD/spec documents under `devpost/` remain canonical.

## Artwork and publication

Original generated PNGs and prompts are retained separately from runtime exports. No stock-art pack or third-party visual reference was used. The remaining five flowers await learner approval of this pilot. Code-license selection and verification of artwork redistribution terms remain explicit publication gates; no open-source license is applied yet.
