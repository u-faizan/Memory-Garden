---
doc: checklist
status: approved
---

# MemoryGarden — Build Checklist

Build mode: fast — explicitly selected by the learner. Keep concise updates, mechanical verification, commits, and the required hands-on checkpoints. The learner additionally requested a manual-journey check immediately after slice 2. Routine implementation/fixes are authorized; major visual, product-scope, or architecture changes require input.

**Storybook revision (2026-10-21):** the learner set a new creative direction and authorized the agent to own implementation decisions. This revised order replaces the earlier seven slices; the learner approved it on 2026-10-22 and condensed it to seven slices on 2026-10-24 (see Revisions). Priorities: P0 core journey first (slices 1–4), then P1 polish (5–6), with P2 extras (car arrival cinematic) only if time remains. The core journey must work without AI.

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

- [ ] **2. Write, plant, reopen, edit and delete memories that survive refresh**
  Becomes usable: The complete manual memory journey. Tap a soil spot (or Plant a Memory) to open the botanical journal; write a title, story and date, add a photo, choose a flower; preview the single adaptive page; plant; watch it grow in place; reopen, edit or delete it; refresh and find everything still there. Unfinished writing is autosaved and offered back. The fictional sample page is removed and nothing is prefilled.
  Why now: The journal and persistence are the heart of panels 05–07. Merging the old slices 2 and 3 gets the whole usable journey working in one step, at hackathon pace.
  PRD ref: `prd.md > The Core Journey`, `Write a Memory`, `Protect One Active Draft`, `Plant and Bloom`, `Revisit, Persist, and Delete`, `Journal Page Layouts`.
  Spec ref: `spec.md > Botanical Journal`, `Draft Controller`, `IndexedDB Repository and Page Allocation`, `Data Model`, `Validation and Photo Processing`.
  Build: `idb` repository (memories, drafts, preferences; pages derived from memories); spot-first planting with auto-selected spot from Plant a Memory; journal dialog with write, preview and read modes sharing one adaptive `PageLayout` (photo left with words and flower tag right, or words left and flower right); local photo resize; flower picker showing every species whose art exists; save-before-bloom with double-click protection; growth at the saved spot; reading with Edit and confirmed Delete; debounced draft autosave and a return prompt; garden pages of ten spots; introSeen moves to preferences.
  Verify (mechanical): Typecheck, lint, build. One real-browser smoke run: plant a memory with a photo, reopen it, edit it, refresh and confirm content and position, delete with confirmation, and confirm a draft survives refresh. Inspect desktop and phone screenshots of the journal and reading page.
  Learner check: Write a real-feeling fictional memory with a photo, plant it, reopen and edit it, refresh, then delete another. Say whether writing → bloom → reading feels like one storybook.
  Commit: `Add persistent memory journal with planting, editing and deletion`

- [ ] **3. Grow all six flowers across stable garden pages**
  Becomes usable: Lavender, rose, daisy, forget-me-not and iris join the sunflower, each growing through its own painted stages; the garden continues on new pages when one fills.
  Why now: Uses the learner's generated growth sheets in the proven sunflower format; the populated garden (panel 07) becomes colourful.
  PRD ref: `prd.md > Flower Collection`, `Planting Spots and Garden Pages`.
  Spec ref: `spec.md > Visual Asset Inventory and Pilot`, `Scene Mapping, Organization, and Rights`.
  Build: Run `npm run assets` on the new sheets (slice and align to the stem base), enable each species in the flower catalog, tune per-species display scale, check page navigation with more than ten memories.
  Verify (mechanical): Typecheck, lint, build; screenshot a garden with all six species on desktop and phone; confirm each grows anchored to its soil.
  Learner check: Plant several species, including two of the same, and move between pages. Check they belong to one world.
  Commit: `Add six-flower collection and garden pages`

- [ ] **4. Add the Flow opening clip and opt-in music**
  Becomes usable: Opening My Garden plays the learner's Flow clip (book → car → gate → garden) that ends exactly on the live garden; optional soft music can be switched on and off and is remembered.
  Why now: Cinematic and atmosphere layers sit on top of a working garden (brief: panels 01–03 and 08 are optional enhancements).
  PRD ref: `prd.md > Storybook Cover and Opening`, `Open and Close the Storybook`, `Atmosphere and Motion`.
  Spec ref: `spec.md > Storybook Opening and Closing`, `Music and Sound`.
  Build: Play the desktop or phone clip inside the open-book stage, crossfade to the live garden on its matching last frame, keep Skip and reduced motion; keep the CSS opening as fallback. Gesture-gated music toggle with remembered preference.
  Verify (mechanical): Build; watch the opening on desktop and phone for a visible jump; confirm Skip and returning visits; confirm no sound before opt-in.
  Learner check: Open the book a few times on desktop and phone, toggle music, refresh. Say whether the arrival feels magical and short enough.
  Commit: `Add Flow opening clip and opt-in music`

- [ ] **5. Polish the complete storybook journey**
  Becomes usable: The finished experience, ready for the final hands-on review and demo recording.
  Why now: Refine working behavior; no new features.
  PRD ref: `prd.md > Acceptance Criteria`, `Look and Feel`.
  Spec ref: `spec.md > Look and Feel`, `Implementation and Verification Plan`.
  Build: Visual and motion refinements from review, keyboard and focus pass, reduced motion, mobile spacing, fictional demo memories kept separate from personal data, factual README.
  Verify (mechanical): Typecheck, lint, build; full journey smoke run on desktop and phone; check the bundle for secrets.
  Learner check: Explore everything freely; note anything broken, confusing or unsatisfying.
  Commit: `Polish the complete MemoryGarden journey`

- [ ] **6. Publish the approved Cloudflare Pages version**
  Becomes usable: A public working app for judges, alongside the required demo video and repository.
  Why now: Only a stable, reviewed app is published.
  PRD ref: `prd.md > What We're Building`.
  Spec ref: `spec.md > Secrets and Public Deployment`, `Shipping, Licensing, and Submission Handoff`.
  Build: With explicit approval, deploy the static build to Pages, record the real URL, then hand off to `6-ship`.
  Verify (mechanical): Open the public URL in two browser profiles; run the core journey; confirm separate gardens.
  Learner check: Open the public URL in your usual browser and a private window and try the journey.
  Commit: `Publish MemoryGarden on Cloudflare Pages`

- [ ] **7. (Optional extra) Consented AI flower suggestions**
  Becomes usable: If time remains, Find My Flower suggests a title, feeling and flower through the protected Pages Function, after consent, with manual choice always available.
  Why now: An optional extra the learner may build later or skip; the product is complete without it.
  PRD ref: `prd.md > Discover and Review a Flower`.
  Spec ref: `spec.md > AI Client and Pages Function`, `Browser to Function`, `Function to OpenAI`.
  Build: As specified in the spec, only if the learner chooses to proceed and authorizes the account and key setup.
  Verify (mechanical): Function contract and failure checks; one authorized fictional live call.
  Learner check: Request suggestions for a fictional memory, change them and plant.
  Commit: `Add consented AI flower suggestions`

## Hands-on Checkpoints

- [ ] Early visual pilot explored after slice 1 — storybook opening, layered garden and sunflower growth reviewed on desktop and mobile; feedback resolved before the journal and other five flowers are built on it.
- [ ] Integrated memory journey explored after slice 2 — writing, photo, layouts, planting, reading, editing, deletion, draft and refresh tried; feedback resolved.
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

- 2026-10-24, learner decisions from `context/brief.md`: slices 2 and 3 merge into one memory-journey slice; editing saved memories is now included; the journal uses one adaptive page instead of three layouts (learner refinement after trying two); growth runs in about 2–3 s with no visible stage captions; the opening uses a learner-generated Flow clip that ends on the garden frame; in-app AI becomes an optional final slice. Hackathon pace: one smoke run per slice instead of full assertion passes. Eight slices became seven.
- 2026-10-24, slice 1 art: the learner found the code-drawn art pass too plain and generated a calmer painted set (garden plates, foreground leaves, desk, soil beds, sunflower growth sheet, book cover and endpaper), supplied with prompts. `scripts/prepare-assets.mjs` exports optimized WebP files and aligns the sunflower stages to one stem base; provenance is copied to `artwork/provenance/`. Comparing with concept A also added growth captions, the memory title written above the bloom, a visiting butterfly, the book tilted on the desk and an "Open My Garden" card. The car-and-character arrival stays P2. `spec.md` was updated in the affected sections.
- 2026-10-21, storybook revision: the learner rejected the painted A2 pilot direction as still too dense and supplied a new creative brief and concept storyboards (kept privately in git-ignored `context/`). The product now opens from a closed storybook, art becomes a stylized code-native layered SVG world (no image-generation tool is available in this environment), growth gains a bud stage, the journal gains three layouts, and opt-in music is added; video attachments and atmosphere themes are deferred, and the car-and-character arrival is P2. `scope.md`, `prd.md` and `spec.md` (and their HTML companions) were updated in the affected sections only, marked *storybook revision*. The seven slices became eight. Repository cleanup removed the retired painted assets, review documents and pilot scripts, leaving only skill-owned documents in `devpost/`; earlier versions remain in Git history (`24cf09f`). Slice 1 and its checkpoint stay unchecked until the learner accepts the new running pilot.

- 2026-10-21: Learner approved Secret Glade A2 as the implementation direction, including precise grounding, coherent art, short-phone spacing and subtle varied soil. Resume only the revised Slice 1 pilot: clean desktop/portrait scenery, independent ten-spot map, sunflower, ground details, integrated book and controls, normal/reduced-motion growth. Direction approval does not approve the running pilot. Keep Slice 1 and its hands-on checkpoint unchecked; do not begin Slice 2 or generate the remaining five production flowers before the learner accepts the actual implementation. Baseline commit `24cf09f` preserves the previous work.

- 2026-10-19: Learner approved this seven-slice order, selected Fast Mode, and added the slice-2 manual persistence checkpoint. No scope or architecture change.
- 2026-10-19, slice 1: Generated garden output is 1536×1024, so the pilot exports native resolution rather than upscaling to the proposed 2400×1600 target. The sunflower is normalized to 768×1024; shared code-native early stages and a final-art reveal use the already approved pilot alternative. Optional SVG turbulence/raster drop-shadow filters were removed to reduce rendering work. Evidence was recorded in pilot review notes since removed in the storybook cleanup (recoverable from commit `24cf09f`).
- The learner tried the first pilot and **rejected its visual experience**. A subsequent structural layout revision improved technical layout but was also rejected: it still felt like a website surrounding a background and sunflower. Neither slice 1 nor its visual checkpoint is complete. Existing code/artwork remain intact and uncommitted as a slice; passing mechanical checks does not establish product or visual acceptance.
- 2026-10-20: Application implementation is stopped at the learner's request. Prepare two substantially different visual composition proposals, with empty/populated/journal/mobile mockups, recommendation and asset/feasibility implications. Do not redesign the application, generate the full flower collection, proceed to slice 2, tick slice 1 or make its completion commit until the learner approves a direction and later accepts the revised pilot. Scope, architecture and illustration style stay intact; proposal documents are not approved requirements.
- 2026-10-20, A2 refinement: Learner prefers Secret Glade A but explicitly withholds final approval. New design-only empty/planted desktop and mobile studies reduce scenery clutter, remove prominent background flowers/stone rings/terraces, and show all six memory-flower types in one painted family. The earlier A/B proposal and A2 review page were later removed in the storybook cleanup. One MVP environment is confirmed; future atmosphere variations must retain scene geometry and memory positions. No application/source/public-asset files are changed by this refinement, no standalone production flower assets or atmosphere themes are generated, and slice/checkpoint boxes stay unchecked.
