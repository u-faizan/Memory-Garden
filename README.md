# MemoryGarden — Where Memories Bloom

A magical storybook that contains your own little world: write a memory, plant it, and watch it bloom into a flower you can return to.

**Status: storybook rebuild in progress (Slice 1 of 8).** The visual direction changed on 2026-10-21. The app opens from a closed botanical book into a layered, animated garden, where a sunflower grows from seed to bloom. Memory writing, saving, photos, the other five flowers, AI suggestions, journal layouts and music follow in later slices. See the [build checklist](devpost/checklist.md).

## Try it locally

Use Node 22.14.0 or a compatible Node version ≥22.12.

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:5173/**. In Windows PowerShell use `npm.cmd` if execution policy blocks `npm.ps1`.

## Verify

```sh
npm run typecheck
npm run lint
npm run build
npm run check:pilot   # real-browser review harness; keep the dev server running
```

The harness drives installed Chrome/Edge (or `PILOT_BROWSER`) at 1366×768, 1680×900, 390×844 and 375×667 and writes screenshots to the ignored `test-results/` folder. Automated checks support visual review; they do not approve the experience.

## How it is built

- **React + Vite + TypeScript**, custom CSS, no game engine.
- **Code-native art:** the garden is drawn as separate seeded SVG layers (sky, hills, trees and gate, ground, foreground, atmosphere), with one composition for landscape and one for portrait screens. Flowers are staged SVGs whose stems, leaves and petals actually grow.
- **Planned:** IndexedDB for memories, drafts and photos (browser-local, no accounts); one Cloudflare Pages Function for optional, consented OpenAI suggestions.

## Planning documents

Created through the Devpost *Build With AI: Basics* skills: [scope](devpost/scope.md), [product requirements](devpost/prd.md), [technical spec](devpost/spec.md) and the [build checklist](devpost/checklist.md). Each `.md` has an `.html` companion for review.

Fonts are self-hosted under the SIL Open Font License 1.1 (Cormorant Garamond, Lora, Caveat). The code licence is chosen before publication.
