# MemoryGarden artwork manifest

Status: source artwork is preserved, but the original and revised pilot experiences were visually rejected. Application implementation is stopped while the learner reviews `devpost/design-proposal.html`. The existing art is a reusable reference, not an approved finished scene. Do not generate the remaining flower collection yet. Concept-only boards and their prompts are saved separately under `devpost/design-exploration/`; none replaces a production asset.

## Art direction and provenance

Custom watercolor/gouache storybook garden, elevated three-quarter viewpoint, warm upper-left sunlight, natural sage/olive greens, cream paper, mature botanical detail. The sunflower was generated with the actual garden as its style/lighting reference.

Tool: environment-provided **built-in image_gen**, generated 2026-10-19. No model version was exposed by the tool; none is inferred. Exact submitted prompts are in [prompts.json](prompts.json).

Generation session: `01a15043-e43b-73c0-a08a-73f791401ccd`.

| Source file | Generation output ID | Original dimensions / format | Reference |
| --- | --- | --- | --- |
| `source/garden-v1.png` | `exec-fdb2c628-62fb-431f-8b6e-95eae3b4701f` | 1536×1024 RGB PNG | Original descriptive brief, no external artwork |
| `source/sunflower-v1.png` | `exec-3fc7a095-f189-42ca-8983-b91322fa3f5f` | 1086×1448 RGBA PNG | `source/garden-v1.png`, style and light only |

The lossless source files remain unmodified. The tool returned 1536×1024 for the garden, below the proposed 2400×1600 target; the pilot uses this native output without artificial upscaling. Inspect large-display sharpness during the learner review.

## Runtime inventory

| File | Export | Actual bytes | Use |
| --- | --- | ---: | --- |
| `public/assets/garden/base.webp` | 1536×1024, opaque WebP quality 84 | 500,076 | Garden clearing, pathway, fence, edge plants, painted light |
| `public/assets/flowers/sunflower/bloom.webp` | 768×1024, transparent WebP quality 86, alpha quality 100 | 176,992 | Separate interactive final sunflower |
| `src/components/garden/Bloom.tsx` | Inline SVG/CSS, 240×320 vector viewBox | Part of JS/CSS bundle | Shared seed, sprout and young plant; no separate generated animation frames |
| `public/favicon.svg` | Code-authored 48×48 SVG | Tiny local vector | Botanical favicon matching the live wordmark motif |

Reproduce technical exports with `node scripts/prepare-pilot-assets.mjs`. The script crops only empty canvas below the last painted source row, preserves horizontal centering, fits the image onto a bottom-aligned 768×1024 transparent canvas, then compresses it. No semantic art alteration, background-removal approximation, or generative editing is performed. Measurements live in [export-metrics.json](export-metrics.json).

The flower's soil anchor is bottom-center `(0.5, 1)`. Display heights are 245 CSS px on the tested desktop and 195 CSS px on mobile. Placement and growth/sway transforms are separate. Seed/sprout/young stages use this same ground point; the final painted flower is revealed from the base with a restrained unfurl/glow, then a slow sway. Independently generated stem/head frames are not assumed to align.

The sunflower exceeds the proposed 150 KB per-flower target by 26,992 bytes. The two runtime paintings total **677,068 bytes**, below the proposed initial-art budget of 1.5 MB. This is an explicit pilot tradeoff for painted-edge quality, pending visual review rather than a claim that every proposed budget passed.

## Collection gate and rights

Lavender, rose, daisy, forget-me-not and iris are **not generated**. After visual approval, use the accepted garden/sunflower as references and repeat alpha, silhouette, light, anchor and motion checks for each. Do not mix unrelated stock art.

Sources are internally generated from original prompts and the project's own generated reference. This records provenance, not a legal claim of exclusive copyright or a verified redistribution license. Verify the actual tool/provider/account terms before public repository/deployment, retain relevant evidence, and agree a separate artwork notice with the learner. No third-party artwork or font license is silently granted, and no blanket code license is applied to illustrations.
