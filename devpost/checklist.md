---
doc: checklist
status: approved
---

# MemoryGarden — Build Checklist

Build mode: fast — explicitly selected by the learner. Keep concise updates, mechanical verification, commits, and the required hands-on checkpoints. The learner additionally requested a manual-journey check immediately after slice 2. Routine implementation/fixes are authorized; major visual, product-scope, or architecture changes require input.

Scope, PRD, technical specification, and this seven-slice order are approved. Project setup is folded into the first visual pilot. Build slice 1 now, then stop for the learner to approve the actual garden, transparent sunflower and growth animation before generating the other five flower assets.

## Slices

- [ ] **1. Explore the illustrated garden and watch a sunflower grow**
  Becomes usable: A locally running, responsive illustrated garden with one separate transparent sunflower and a replayable seed-to-sprout-to-young-plant-to-bloom interaction. This is an explicitly fictional visual pilot, not yet a saved-memory or AI demonstration.
  Why now: Proves the defining visual experience and the uncertain asset pipeline first. Bootstrapping is included so the first increment is something the learner can actually open and judge.
  PRD ref: `prd.md > Look and Feel`, `Arrive and Explore`, `Plant and Bloom`, `Screens and Layout`.
  Spec ref: `spec.md > Stack and Compatibility`, `Visual Asset Inventory and Pilot`, `Garden Scene and Bloom`, `Look and Feel`, `Where It Runs and How Someone Tries It`.
  Build: Preserve existing project/curriculum files while creating React/Vite/TypeScript/custom CSS, exact compatible dependencies and lockfile, planned scripts and typing. Use the built-in image-generation tool for one garden and one transparent sunflower, inspect/save selected outputs into the workspace, record prompts/provenance, and prepare reusable code-native early growth stages. Compose a real flower button over scenery with stable anchors and deliberate mobile framing. Add normal/reduced-motion pilot replay. No other five flowers before the visual checkpoint; no runtime image generation.
  Verify (mechanical): Resolve engine/peer requirements; run typecheck, lint, production build, and local server. Inspect the actual rendered garden at 390×844 and 1440×900 and the replay under normal/reduced motion. Verify image alpha/edges and native/display-size composites, stage alignment, actual asset bytes/cold requests, no console/runtime errors, keyboard focus and touch target. Distinguish measured results from the proposed budgets. Capture useful screenshots and motion evidence for the learner; keep the review harness out of the final UI.
  Learner check: Open the local URL, inspect the desktop/mobile scene, replay the bloom, and try the sunflower using keyboard or touch. Say what feels cohesive or mismatched, whether the sunflower sits naturally in the garden, and what you would change before producing the other flowers.
  Commit: `Add illustrated garden and sunflower bloom pilot`

- [ ] **2. Write, plant, and reopen a memory that survives refresh**
  Becomes usable: The first manual end-to-end memory journey: open the botanical journal, write/date a fictional memory, choose a title/theme and the pilot flower, select an empty spot, save, watch it bloom, reopen its original story, and refresh without losing it.
  Why now: Connects the approved visual kernel to a real memory early, proving the journal, transactional storage, placement, and reading together rather than building isolated plumbing. This slice temporarily uses the accepted pilot flower; the full collection follows after visual approval.
  PRD ref: `prd.md > The Core Journey`, `Write a Memory`, `Plant and Bloom`, `Revisit, Persist, and Delete`, `Planting Spots and Garden Pages`.
  Spec ref: `spec.md > The Core Journey Through the System`, `Botanical Journal`, `IndexedDB Repository and Page Allocation`, `Data Model`, `Validation and Photo Processing`.
  Build: Implement shared journal shell/editor/review/reader with desktop two-page and mobile single-page layout, validated original text/date/title/theme, local repository/schema, stable logical spots and optional alternate-spot selection, and idempotent atomic save-before-bloom. Real HTML controls; preserve original story exactly and return to the same page/focus. Keep incomplete photo/AI controls out of the UI until those behaviors work. Reuse the accepted art and motion rather than replacing them with generic form styling.
  Verify (mechanical): Run typecheck, lint, focused validation/allocation/transaction tests, and build. In a real browser create a memory manually, choose another spot, refresh, reopen, and confirm original text/date/metadata and position. Test fast repeated submission, occupied/stale placement, forced storage rollback, and refresh during bloom: no duplicate or false saved result. Verify reading uses no AI/network analysis and Back/Escape return correctly.
  Learner check: Write a fictional memory, plant it in an alternate empty spot, refresh, and open the flower again. Confirm the story and location remain intact and that writing-to-bloom-to-reading feels like one storybook experience.
  Commit: `Add persistent manual memory planting and reading`

- [ ] **3. Protect unfinished writing, attach a photo, and safely delete a memory**
  Becomes usable: The core manual journey is reliable: a draft resumes after refresh, optional optimized photos remain with stories, journal closing offers safe choices, and confirmed deletion frees the original spot without changing other memories.
  Why now: Tests the personal-data protection requirements through actual user behavior before broadening the garden or calling a paid service. This is the integrated manual-journey learner checkpoint.
  PRD ref: `prd.md > Protect One Active Draft`, `Write a Memory`, `Delete With Confirmation`, `States and Boundaries`, `Acceptance Criteria`.
  Spec ref: `spec.md > Draft Controller`, `Validation and Photo Processing`, `Data Model`, `Important Failure Modes`.
  Build: Add one serialized debounced draft with revision checks, truthful save status, recovery prompt, Save for Later/Keep Writing/confirmed Discard, and atomic draft-to-memory conversion. Add local image validation/optimization/blob storage and friendly errors preserving valid input. Implement exact approved deletion confirmation and transaction-first peaceful removal, including failure feedback. Support focus/keyboard/reduced motion for all dialogs; do not introduce planted-memory editing or backup/export.
  Verify (mechanical): Run targeted tests and production build. Real-browser checks cover draft fields/photo across refresh, defer/resume, close/save/continue/discard, invalid/corrupt/oversized and supported image formats, repeated planting and stale draft revisions, forced storage failures, cancel/delete/failure, deletion after refresh, and no movement of other flowers. Distinguish the last committed draft from the unavoidable unsaved debounce/crash window; do not claim mock storage results prove browser persistence.
  Learner check: Start a story with a photo, close it safely, refresh, resume and plant it. Cancel a deletion, then explicitly confirm another deletion and refresh. Try an invalid photo and note whether the application protects the story and communicates calmly.
  Commit: `Protect drafts and add local photos and safe deletion`

- [ ] **4. Choose all six flowers and grow across stable garden pages**
  Becomes usable: Users can plant any of the six visually coherent flowers, including repeated types, and continue planting on lightweight pages when the scene fills. Deletion preserves existing layouts and cleans only empty trailing pages.
  Why now: Extends the already working journey using the pilot-approved production method. Capacity and visual variety are added together without creating new environments or an object editor.
  PRD ref: `prd.md > Flower Collection`, `Planting Spots and Garden Pages`, `Discover and Review a Flower`, `Revisit, Persist, and Delete`.
  Spec ref: `spec.md > Visual Asset Inventory and Pilot`, `Scene Mapping, Organization, and Rights`, `IndexedDB Repository and Page Allocation`, `Garden Scene and Bloom`.
  Build: Generate/prepare lavender, rose, daisy, forget-me-not and iris using the accepted art reference and verified stage workflow. Record all production prompts/source/rights notes; wire the flower catalog, stable bounded variations and type-specific final blooms. Complete simple page navigation, allocation across current/existing/new pages, stable IDs, and transaction-safe trailing-empty cleanup. Do not add seasons, environments, watering, streaks or layout dragging.
  Verify (mechanical): Inspect every flower for consistent palette/light/silhouette, real alpha, anchor stability and normal/reduced-motion growth. Run allocation/cleanup tests and a real browser journey filling more than one page, refreshing, reopening repeated types, deleting internal and trailing memories, and confirming populated page positions never shift. Check mobile framing and every flower's keyboard/click target; measure final art sizes rather than assuming the pilot budgets hold.
  Learner check: Plant different flower types, including two of the same type, navigate pages, and revisit them. Check the collection belongs to the same world and that deletion does not rearrange the garden.
  Commit: `Add coherent six-flower collection and stable garden pages`

- [ ] **5. Request optional OpenAI suggestions through the protected Pages Function**
  Becomes usable: A user explicitly requests consented title/theme/flower suggestions, edits them, and plants; failures or disabled AI preserve the draft and allow the complete manual journey.
  Why now: The product already works without AI. The small paid/external boundary can now be verified against a reliable manual fallback, with browser-local privacy intact.
  PRD ref: `prd.md > Discover and Review a Flower`, `Protect One Active Draft`, `Emotional Tone`, `States and Boundaries`.
  Spec ref: `spec.md > AI Client and Pages Function`, `Browser to Function`, `Function to OpenAI`, `Bot Protection, Throttling, and Spending`, `Secrets and Public Deployment`.
  Build: Add only `functions/api/suggest-flower.ts` as a route, pure shared contract validation and helpers outside the route directory, bounded native fetch to OpenAI, and server-configurable `OPENAI_MODEL` defaulting to `gpt-6-luna` for initial tests. Add explicit consent, manual choice, fresh server-verified Turnstile token, input/output/timeouts, no automatic resends, stale-result handling, best-effort throttles and disable switch. Keep keys outside browser code and stories/photos out of logs. Use local documented test keys; do not change external accounts or secrets without authorization.
  Verify (mechanical): Run browser/Function type checks, strict request/response/method/origin/body/error tests, frontend build and Pages emulator. Verify manual mode works without credentials. Test refusal, malformed/truncated output, timeout, rejected/expired/replayed bot token, throttle, unavailable key and quota; all preserve original text and draft. With authorized locally configured credentials, make a small real fictional-memory call using GPT-6 Luna, recording validity and emotional quality without private content or keys. Label simulated versus live evidence; if live access is unavailable, record it as unfinished rather than faking success.
  Learner check: Request suggestions for a fictional mixed-emotion memory, change the suggested flower, and plant it. Try manual planting and a controlled failure; confirm AI is optional and the original story is unchanged.
  Commit: `Add consented OpenAI suggestions with protected Pages proxy`

- [ ] **6. Refine and verify the complete accessible storybook journey**
  Becomes usable: The cohesive full experience is ready for final hands-on review: garden, journal, all flowers, manual/AI choice, drafts, local photos, pages and deletion work on desktop/mobile and with keyboard/reduced motion.
  Why now: Refines working behavior and accepted artwork rather than treating visuals as a late overlay. Concentrate on integration, graceful failure states and the final learner feedback round without adding features.
  PRD ref: `prd.md > Acceptance Criteria`, `Look and Feel`, `The Core Journey`, `States and Boundaries`.
  Spec ref: `spec.md > Look and Feel`, `Important Failure Modes`, `Implementation and Verification Plan`, `Pilot Pass Criteria`.
  Build: Refine priority bloom/book/selection/transitions, readable typography/contrast, deliberate mobile composition, empty/recovery/error states and only useful ambient polish. Resolve actual test findings; keep UI styling coherent and hover nonessential. Prepare fictional demo fixtures and factual setup instructions. Remove the pilot-only harness from public UI while retaining review evidence where appropriate.
  Verify (mechanical): Run all relevant focused tests, typecheck, lint, production build, and production-shaped Pages preview. Check real-browser complete journeys at 390×844 and 1440×900 plus 320/768 widths, keyboard/focus/Escape, reduced motion, photos, refresh/draft/deletion/page behavior and controlled failures. Check no secrets/private content entered the bundle or intended commit; record actual loading/asset sizes and remaining limitations. Do not claim automated checks establish artistic quality or live verification where none happened.
  Learner check: Explore the whole local application freely using fictional memories. Note anything broken, confusing, visually inconsistent or unsatisfying, including awkward input and interrupted writing; agree refinements before changing product behavior.
  Commit: `Polish and verify the complete MemoryGarden journey`

- [ ] **7. Publish and verify the approved Cloudflare Pages version**
  Becomes usable: A publicly accessible working application on a chosen available `pages.dev` hostname, with independent browser-local gardens and protected optional AI where authorized and verified.
  Why now: Only a stable, reviewed application is published. Hosting cannot substitute for the working product, required demo video, repository preparation or learner review.
  PRD ref: `prd.md > What We're Building`, `States and Boundaries`, `Acceptance Criteria`.
  Spec ref: `spec.md > Secrets and Public Deployment`, `Bot Protection, Throttling, and Spending`, `Shipping, Licensing, and Submission Handoff`.
  Build: Prepare deployment/configuration and review actual hostname, bot controls, model access, alert amount, residual abuse/cost risk and separate code/art rights. Obtain explicit approval before external account/secret/spend/publication changes. Deploy through the documented Pages workflow, document real URL and environment setup, and keep AI off if required safeguards/configuration are unavailable. Do not publish the repository or submit a Devpost entry without approval; coordinate required repo/video work with `6-ship` after build completion.
  Verify (mechanical): Check the real public URL, assets and Function response behavior, two independent browser contexts, draft/refresh/plant/read/delete/page journeys, keyboard/mobile/reduced motion, and manual mode when AI fails. Verify server secrets are absent from browser code/served paths and review intended files/Git history for credentials, learner profile and private material. Confirm actual asset redistribution rights and account limits. Report deployment/live limitations honestly; do not mark public functionality verified solely from local checks.
  Learner check: Open the real public URL in your usual browser and a separate private window, create fictional memories in each, and confirm gardens remain separate. Try the core journey and confirm the final result is ready to share.
  Commit: `Verify Cloudflare Pages release and document setup`

## Hands-on Checkpoints

- [ ] Early visual pilot explored after slice 1 — scene, transparency/integration and actual bloom reviewed; feedback resolved before producing the other five flowers.
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

- 2026-10-19: Learner approved this seven-slice order, selected Fast Mode, and added the slice-2 manual persistence checkpoint. No scope or architecture change.
- 2026-10-19, slice 1: Generated garden output is 1536×1024, so the pilot exports native resolution rather than upscaling to the proposed 2400×1600 target. The sunflower is normalized to 768×1024; shared code-native early stages and a final-art reveal use the already approved pilot alternative. Optional SVG turbulence/raster drop-shadow filters were removed to reduce rendering work. Exact evidence and the 176,992-byte bloom budget variance are recorded in `pilot-evidence.md` and `artwork/manifest.md`.
- The learner tried the first pilot and **rejected its visual experience**. A subsequent structural layout revision improved technical layout but was also rejected: it still felt like a website surrounding a background and sunflower. Neither slice 1 nor its visual checkpoint is complete. Existing code/artwork remain intact and uncommitted as a slice; passing mechanical checks does not establish product or visual acceptance.
- 2026-10-20: Application implementation is stopped at the learner's request. Prepare two substantially different visual composition proposals, with empty/populated/journal/mobile mockups, recommendation and asset/feasibility implications. Do not redesign the application, generate the full flower collection, proceed to slice 2, tick slice 1 or make its completion commit until the learner approves a direction and later accepts the revised pilot. Scope, architecture and illustration style stay intact; proposal documents are not approved requirements.
- 2026-10-20, A2 refinement: Learner prefers Secret Glade A but explicitly withholds final approval. New design-only empty/planted desktop and mobile studies reduce scenery clutter, remove prominent background flowers/stone rings/terraces, and show all six memory-flower types in one painted family. The earlier A/B proposal is archived; current review remains `design-proposal.html`. One MVP environment is confirmed; future atmosphere variations must retain scene geometry and memory positions. No application/source/public-asset files are changed by this refinement, no standalone production flower assets or atmosphere themes are generated, and slice/checkpoint boxes stay unchecked.
