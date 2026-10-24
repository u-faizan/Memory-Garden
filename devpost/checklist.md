---
doc: checklist
status: approved
---

# MemoryGarden — Build Checklist

Build mode: fast — explicitly selected by the learner. Keep concise updates, mechanical verification, commits, and the required hands-on checkpoints. The learner additionally requested a manual-journey check immediately after slice 2. Routine implementation/fixes are authorized; major visual, product-scope, or architecture changes require input.

**Storybook revision (2026-10-21):** the learner set a new creative direction and authorized the agent to own implementation decisions. This revised eight-slice order replaces the earlier seven slices; the learner approved it on 2026-10-22. Priorities: P0 core journey first (slices 1–4), then P1 polish (5–6), with P2 extras (car arrival cinematic) only if time remains. The core journey must work without AI.

## Slices

- [ ] **1. Open the storybook and watch a sunflower grow in a living garden**
  Becomes usable: A locally running storybook. A closed book opens into a layered, animated Secret Glade with separate desktop and portrait compositions. Choosing a soil spot grows a sunflower through seed → sprout → young plant → bud → bloom. The opening is skippable and remembered, and Close My Garden returns to the cover. This is a fictional visual pilot; nothing is saved.
  Why now: The visual kernel and the new art pipeline are the biggest risks after two rejected painted pilots. Proving them first means every later slice builds on accepted visuals.
  PRD ref: `prd.md > Storybook Cover and Opening`, `Garden`, `Look and Feel`, `Open and Close the Storybook`, `Plant and Bloom`.
  Spec ref: `spec.md > Look and Feel`, `Visual Asset Inventory and Pilot`, `Storybook Opening and Closing`, `Garden Scene and Bloom`, `Scene Mapping, Organization, and Rights`.
  Build: Layered garden from the learner's painted art (plate, soil beds, foreground leaves) plus code-drawn atmosphere for `wide` and `tall` layouts with ten stable spots; five-stage sunflower from the painted growth sheet, stages aligned to one stem base, with a drawn seed, glow, sparkles, title and visiting butterfly; storybook cover, endpaper and desk; one transformed stage for cover → opening → garden → closing; self-hosted OFL fonts; pointer parallax and restrained ambient motion; reduced-motion alternatives; dev-only stage inspection. Remove the retired painted pipeline.
  Verify (mechanical): Typecheck, lint, production build. Update `scripts/check-pilot.mjs` and run it at 1366×768, 1680×900, 390×844 and 375×667: no page scroll, no control overlap, ten visible spots with ≥44 px targets, fixed soil anchor across stages, opening/skip/close/replay, reduced motion, zero console errors. Inspect the screenshots; record bundle size and frame pacing.
  Learner check: Open the local URL and press Open My Garden (and Skip on a second try). Plant the sunflower in a couple of spots, watch it grow, try Close My Garden, then try a phone-sized window. Say whether this feels like a magical storybook world and what you would change before the journal is built on it.
  Commit: `Add storybook opening, layered garden and sunflower growth`

- [ ] **2. Write, plant, and reopen a memory that survives refresh**
  Becomes usable: The first manual end-to-end memory journey. Open the botanical journal (Classic layout), write and date a fictional memory, choose a title, theme and the sunflower, accept or change the planting spot, save, watch it bloom, reopen its original story, and refresh without losing it.
  Why now: Connects the accepted visuals to a real memory early, proving the journal, transactional storage, placement and reading together.
  PRD ref: `prd.md > The Core Journey`, `Write a Memory`, `Plant and Bloom`, `Revisit, Persist, and Delete`, `Planting Spots and Garden Pages`, `Revisited Memory`.
  Spec ref: `spec.md > The Core Journey Through the System`, `Botanical Journal`, `IndexedDB Repository and Page Allocation`, `Data Model`, `Validation and Photo Processing`.
  Build: Journal shell, editor, review and reader with a desktop two-page / mobile single-page Classic `PageLayout`; validated story, date, title and theme; `idb` repository with the four stores (including `layout`, `introSeen` and music preferences); placement with auto-selected and optional alternate spots; idempotent save-before-bloom; reading with Back to Garden and Escape. Move `introSeen` from local storage to the preferences store. Real HTML controls, no AI.
  Verify (mechanical): Typecheck, lint, focused validation/allocation/transaction tests, build. In a real browser create a memory, choose another spot, refresh, reopen, and confirm text, date, metadata and position. Test fast repeated submission, occupied/stale placement, forced storage rollback and refresh during bloom: no duplicates and no false success.
  Learner check: Write a fictional memory, plant it in a different spot, refresh, and open the flower again. Confirm the story and location remain and that writing → bloom → reading feels like one storybook.
  Commit: `Add persistent manual memory planting and reading`

- [ ] **3. Protect unfinished writing, attach a photo, and safely delete a memory**
  Becomes usable: The core manual journey is reliable. A draft resumes after refresh, an optional optimized photo stays with its story, closing the journal offers safe choices, and confirmed deletion frees the spot without moving other flowers.
  Why now: Tests the personal-data protections through real behavior before broadening the garden or calling a paid service. This is the integrated manual-journey learner checkpoint.
  PRD ref: `prd.md > Protect One Active Draft`, `Write a Memory`, `Delete With Confirmation`, `States and Boundaries`, `Acceptance Criteria`.
  Spec ref: `spec.md > Draft Controller`, `Validation and Photo Processing`, `Data Model`, `Important Failure Modes`.
  Build: One serialized debounced draft with revision checks, truthful save status, the recovery prompt, and Save for Later / Keep Writing / confirmed Discard; atomic draft-to-memory conversion; local photo validation, optimization and blob storage with friendly errors; the exact approved deletion dialog with transactional removal and a peaceful fade. Focus, keyboard and reduced motion for all dialogs. No editing of planted memories, no video.
  Verify (mechanical): Targeted tests and build. Real-browser checks cover draft fields and photo across refresh, defer/resume, close/save/continue/discard, invalid/corrupt/oversized and supported images, repeated planting and stale revisions, forced storage failures, cancel/delete/failure, deletion after refresh, and no movement of other flowers.
  Learner check: Start a story with a photo, close it safely, refresh, resume and plant it. Cancel one deletion, then confirm another and refresh. Try an invalid photo and check that the app protects the story and responds calmly.
  Commit: `Protect drafts and add local photos and safe deletion`

- [ ] **4. Choose all six flowers and grow across stable garden pages**
  Becomes usable: Users can plant any of the six flowers, including repeats, and continue on extra garden pages when the scene fills. Deletion keeps layouts stable and removes only empty trailing pages.
  Why now: Extends the working journey with the accepted flower skeleton. Visual variety and capacity arrive together without new environments.
  PRD ref: `prd.md > Flower Collection`, `Planting Spots and Garden Pages`, `Discover and Review a Flower`, `Revisit, Persist, and Delete`.
  Spec ref: `spec.md > Visual Asset Inventory and Pilot`, `Scene Mapping, Organization, and Rights`, `IndexedDB Repository and Page Allocation`, `Garden Scene and Bloom`.
  Build: Lavender, rose, daisy, forget-me-not and iris on the shared 200×400 skeleton, each with its own head, leaves and palette and all five stages; flower picker (seed packets) in the journal; small stable per-memory variation; page navigation, allocation across pages and transaction-safe trailing-page cleanup. No seasons, environments, watering or dragging.
  Verify (mechanical): Inspect every flower at every stage for distinct silhouettes, anchors and normal/reduced-motion growth. Run allocation/cleanup tests and a real-browser journey filling more than one page, refreshing, reopening repeated types and deleting internal and trailing memories; positions never shift. Check mobile framing and each flower's target.
  Learner check: Plant several flower types, including two of the same, move between pages and revisit them. Check the collection belongs to the same world and deletion does not rearrange the garden.
  Commit: `Add six-flower collection and stable garden pages`

- [ ] **5. Request optional OpenAI suggestions through the protected Pages Function**
  Becomes usable: A user explicitly requests consented title, theme and flower suggestions, edits them and plants. Failures or disabled AI preserve the draft and leave the manual journey intact.
  Why now: The product already works without AI, so the paid external boundary is verified against a reliable fallback.
  PRD ref: `prd.md > Discover and Review a Flower`, `Protect One Active Draft`, `Emotional Tone`, `States and Boundaries`.
  Spec ref: `spec.md > AI Client and Pages Function`, `Browser to Function`, `Function to OpenAI`, `Bot Protection, Throttling, and Spending`, `Secrets and Public Deployment`.
  Build: `functions/api/suggest-flower.ts` as the only route; shared contract validation; bounded native fetch to OpenAI with server-side `OPENAI_MODEL` (verify the model's availability first); explicit consent; Find My Flower beside the manual choice; Turnstile; limits, timeouts, no automatic resends, stale-result handling, throttles and a disable switch. Keys stay server-side; no account or secret changes without authorization.
  Verify (mechanical): Browser/Function type checks, strict contract/method/origin/body/error tests, frontend build and Pages emulator. Manual mode works without credentials. Test refusal, malformed output, timeout, bad bot token, throttle, missing key and quota; all preserve the story. With authorized credentials, make one small real fictional call and record its quality; otherwise record it as unfinished.
  Learner check: Ask for suggestions on a fictional mixed-emotion memory, change the suggested flower, and plant it. Try manual planting and a controlled failure; confirm AI is optional and the story is unchanged.
  Commit: `Add consented OpenAI suggestions with protected Pages proxy`

- [ ] **6. Personalize journal pages and add opt-in music**
  Becomes usable: Users pick Classic, Photo Story or Scrapbook layouts while writing, and each memory reopens in its layout. Optional soft music and quiet effects can be switched on and muted, and the choice is remembered. The closing animation is refined. The car-and-character arrival is added only if time remains.
  Why now: P1 polish that adds personality and atmosphere on top of a complete, reliable journey.
  PRD ref: `prd.md > Journal Page Layouts`, `Revisited Memory`, `Atmosphere and Motion`, `Open and Close the Storybook`.
  Spec ref: `spec.md > Botanical Journal`, `Music and Sound`, `Storybook Opening and Closing`, `Data Model`.
  Build: Photo Story and Scrapbook renderers in the shared `PageLayout`, with switching that keeps every field and graceful no-photo fallbacks; `audio.ts` with original procedural ambience or a verified-licence track, gesture-gated and opt-in, a persistent toggle, and effects for book/plant/bloom; a refined closing. Optional P2: car, character and gate segment inside the opening, kept skippable and short. No video attachments.
  Verify (mechanical): Layout switching preserves all fields in a real browser; reopened memories use their saved layout at desktop and mobile sizes. Audio: silent until opt-in, mute works, the preference survives refresh, music does not restart on navigation, and nothing breaks with audio unavailable. Record the audio licence or provenance.
  Learner check: Write one memory in each layout and reopen them. Turn music on and off, refresh, and say whether the sound and pages make the garden feel more personal.
  Commit: `Add journal page layouts and opt-in music`

- [ ] **7. Refine and verify the complete accessible storybook journey**
  Becomes usable: The full experience is ready for final hands-on review. Book, garden, journal, all flowers, manual/AI choice, drafts, photos, layouts, pages, deletion and audio work on desktop and mobile, with keyboard and reduced motion.
  Why now: Refines working behavior and accepted art rather than treating visuals as a late overlay. No new features.
  PRD ref: `prd.md > Acceptance Criteria`, `Look and Feel`, `The Core Journey`, `States and Boundaries`.
  Spec ref: `spec.md > Look and Feel`, `Important Failure Modes`, `Implementation and Verification Plan`, `Pilot Pass Criteria (Slice 1)`.
  Build: Refine priority motion, typography and contrast, mobile composition, and empty/recovery/error states; fix real test findings; prepare fictional demo memories and factual setup instructions; remove pilot-only controls from the public UI.
  Verify (mechanical): All tests, typecheck, lint, production build and Pages preview. Full real-browser journeys at the four target viewports plus 320 and 768 widths; keyboard, focus and Escape; reduced motion; refresh/draft/deletion/page behavior; controlled failures. Check that no secrets or private content reach the bundle or commit; record asset sizes and remaining limitations.
  Learner check: Explore the whole local app freely with fictional memories. Note anything broken, confusing, inconsistent or unsatisfying, including awkward input and interrupted writing; agree refinements before changing behavior.
  Commit: `Polish and verify the complete MemoryGarden journey`

- [ ] **8. Publish and verify the approved Cloudflare Pages version**
  Becomes usable: A public working app on an approved `pages.dev` hostname, with separate browser-local gardens and protected optional AI where authorized and verified.
  Why now: Only a stable, reviewed app is published. Hosting does not replace the required demo video or repository.
  PRD ref: `prd.md > What We're Building`, `States and Boundaries`, `Acceptance Criteria`.
  Spec ref: `spec.md > Secrets and Public Deployment`, `Bot Protection, Throttling, and Spending`, `Shipping, Licensing, and Submission Handoff`.
  Build: Prepare deployment and configuration; review hostname, bot controls, model access, alert amount, residual cost risk and code/font/audio licences. Get explicit approval before any account, secret, spend or publication change. Deploy with the documented Pages workflow and keep AI off if safeguards are missing. Do not publish the repository or submit without approval; hand off to `6-ship`.
  Verify (mechanical): Check the real URL, assets and Function behavior, two independent browser contexts, the full journey, keyboard/mobile/reduced motion, and manual mode when AI fails. Confirm server secrets are absent from browser code and the history is free of credentials and private material. Report live limitations honestly.
  Learner check: Open the public URL in your usual browser and a private window, create fictional memories in each, and confirm the gardens stay separate and the journey is ready to share.
  Commit: `Verify Cloudflare Pages release and document setup`

## Hands-on Checkpoints

- [ ] Early visual pilot explored after slice 1 — storybook opening, layered garden and sunflower growth reviewed on desktop and mobile; feedback resolved before the journal and other five flowers are built on it.
- [ ] Manual memory journey explored after slice 2 — learner plants/reopens a fictional memory and tests persistence after refresh before subsequent slices.
- [ ] Integrated manual journey explored after slice 3 — real writing, photo, protected draft, planting, reading, refresh and deletion tried; feedback resolved.
- [ ] Final kick-the-tires exploration and feedback completed after the working release — no claim of completion until the learner reports back.

Learn mode also uses each slice's Learner check before its commit. Fast mode retains the planned checkpoints and any useful additional feedback, with concise explanations. External publication/account approval is a separate action gate, not implied by checklist approval.

## Final Review

- [ ] Final review complete — learner observations clarified; agreed refinements verified, committed and retried; learner confirms ready to ship.

Record actual findings and any agreed revision tasks here when review occurs. No feedback or readiness is assumed in advance.

## Code Tour and App Map

- [ ] Learning activity complete — guided route or focused alternative connecting the learner's frontend/animation/integration goals to actual finished code and evidence.
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate.
- [ ] `devpost/app-map.html` generated from finished code, checked and shown, with a project-grounded practice to reuse.

Activity and evidence: not performed yet; do not claim mastery or completion.
Route and stops: derive real paths/symbols from the finished implementation; no invented tour.
Edit outcome: not offered yet.
Reflection: not offered yet; personal answers belong only in the ignored learner profile.
Activity mode: not selected; keep the learning activity proportionate and avoid duplicate exercises.

## Revisions

- 2026-10-24, slice 1 art: the learner found the code-drawn art pass too plain and generated a calmer painted set (garden plates, foreground leaves, desk, soil beds, sunflower growth sheet, book cover and endpaper), supplied with prompts. `scripts/prepare-assets.mjs` exports optimized WebP files and aligns the sunflower stages to one stem base; provenance is copied to `artwork/provenance/`. Comparing with concept A also added growth captions, the memory title written above the bloom, a visiting butterfly, the book tilted on the desk and an "Open My Garden" card. The car-and-character arrival stays P2. `spec.md` was updated in the affected sections.
- 2026-10-21, storybook revision: the learner rejected the painted A2 pilot direction as still too dense and supplied a new creative brief and concept storyboards (kept privately in git-ignored `context/`). The product now opens from a closed storybook, art becomes a stylized code-native layered SVG world (no image-generation tool is available in this environment), growth gains a bud stage, the journal gains three layouts, and opt-in music is added; video attachments and atmosphere themes are deferred, and the car-and-character arrival is P2. `scope.md`, `prd.md` and `spec.md` (and their HTML companions) were updated in the affected sections only, marked *storybook revision*. The seven slices became eight. Repository cleanup removed the retired painted assets, review documents and pilot scripts, leaving only skill-owned documents in `devpost/`; earlier versions remain in Git history (`24cf09f`). Slice 1 and its checkpoint stay unchecked until the learner accepts the new running pilot.

- 2026-10-21: Learner approved Secret Glade A2 as the implementation direction, including precise grounding, coherent art, short-phone spacing and subtle varied soil. Resume only the revised Slice 1 pilot: clean desktop/portrait scenery, independent ten-spot map, sunflower, ground details, integrated book and controls, normal/reduced-motion growth. Direction approval does not approve the running pilot. Keep Slice 1 and its hands-on checkpoint unchecked; do not begin Slice 2 or generate the remaining five production flowers before the learner accepts the actual implementation. Baseline commit `24cf09f` preserves the previous work.

- 2026-10-19: Learner approved this seven-slice order, selected Fast Mode, and added the slice-2 manual persistence checkpoint. No scope or architecture change.
- 2026-10-19, slice 1: Generated garden output is 1536×1024, so the pilot exports native resolution rather than upscaling to the proposed 2400×1600 target. The sunflower is normalized to 768×1024; shared code-native early stages and a final-art reveal use the already approved pilot alternative. Optional SVG turbulence/raster drop-shadow filters were removed to reduce rendering work. Evidence was recorded in pilot review notes since removed in the storybook cleanup (recoverable from commit `24cf09f`).
- The learner tried the first pilot and **rejected its visual experience**. A subsequent structural layout revision improved technical layout but was also rejected: it still felt like a website surrounding a background and sunflower. Neither slice 1 nor its visual checkpoint is complete. Existing code/artwork remain intact and uncommitted as a slice; passing mechanical checks does not establish product or visual acceptance.
- 2026-10-20: Application implementation is stopped at the learner's request. Prepare two substantially different visual composition proposals, with empty/populated/journal/mobile mockups, recommendation and asset/feasibility implications. Do not redesign the application, generate the full flower collection, proceed to slice 2, tick slice 1 or make its completion commit until the learner approves a direction and later accepts the revised pilot. Scope, architecture and illustration style stay intact; proposal documents are not approved requirements.
- 2026-10-20, A2 refinement: Learner prefers Secret Glade A but explicitly withholds final approval. New design-only empty/planted desktop and mobile studies reduce scenery clutter, remove prominent background flowers/stone rings/terraces, and show all six memory-flower types in one painted family. The earlier A/B proposal and A2 review page were later removed in the storybook cleanup. One MVP environment is confirmed; future atmosphere variations must retain scene geometry and memory positions. No application/source/public-asset files are changed by this refinement, no standalone production flower assets or atmosphere themes are generated, and slice/checkpoint boxes stay unchecked.
