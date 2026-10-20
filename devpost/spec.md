---
doc: spec
status: approved
---

# MemoryGarden — Technical Spec

**Approved technical specification.** The learner approved this blueprint and authorized entry into `5-build`, preserving its build-order review, verification, commits, learner checkpoints, and learning activities. Scope and PRD remain approved and unchanged. This is a plan, not evidence of an installed, built, generated, or deployed application. Markdown is canonical; `spec.html` is the offline visual companion.

## How This Works, In Plain Language

React displays the illustrated garden and a real HTML botanical journal. Flowers are separate interactive elements placed over the scenery. Code controls planting spots, growth stages, journal transitions, and accessible interaction. Vite builds static files; Cloudflare Pages serves them.

Each visitor's browser keeps its own memories, optimized photos, stable flower positions, preferences, and one unfinished draft in IndexedDB. There are no accounts or remote memory database. Planting saves the memory and clears its associated draft in one transaction, then shows the bloom. Refresh restores the saved flower even if its animation was interrupted.

Only an explicit, consented request for suggestions sends the current memory text to one Cloudflare Pages Function. It checks the request and bot token, calls OpenAI using a server secret, validates the answer, and returns an editable title, theme, and flower type. Photos and the rest of the garden stay local. Manual planting does not depend on AI.

Implements `prd.md > The Core Journey`; detailed PRD mappings appear under Components.

## Reconciliation With Approved Documents

| Previous direction | Consolidated decision |
| --- | --- |
| Draft proposed Next.js/Vercel and Vercel WAF | Superseded by React/Vite/TypeScript, Cloudflare Pages, and one Pages Function. Do not install the superseded stack. |
| Scope/PRD call deployment optional for the curriculum | Public deployment is now a learner-requested project deliverable after local stability. It complements the required demo video/repository. External changes still require approval. |
| PRD permits an agreed four-flower fallback | This handoff commits six flowers. No silent reduction; discuss any production difficulty. |
| Flower layers were provisional | Pilot one scene and sunflower before selecting the final asset pipeline or generating the other five. |
| Optional welcome/display name | Not an added required screen or auth system. Start directly in the inviting garden; omit the name for simplicity. |
| Draft message includes a small wording variation | Retain PRD wording “Your story is still waiting to bloom 🌱” with Continue Writing / Not Now. |
| Curriculum targets 2–4 active hours | A target, not a delivery promise. Custom artwork, draft protection, pages, safeguards, testing, and deployment add real work. Surface tradeoffs instead of silently cutting requirements. |

No product conflict requires discarding approved behavior. Preserve original stories, emotional nuance, the desktop/mobile journal, consent/manual choice, deletion confirmation, local recovery, and reduced motion. Future seasons, environments, import/export, and cloud features remain deferred. The new hosting/stack decisions are explicit supersessions, not changes hidden in the approved documents.

## Stack and Compatibility

| Piece | Choice and rationale | Official / upstream reference |
| --- | --- | --- |
| UI | React + React DOM, TypeScript; one screen with dialog modes, no router or global state library | [React versions](https://react.dev/versions), [TypeScript](https://www.typescriptlang.org/docs/) |
| Build | Vite React/TypeScript template with official React plugin, static `dist` output | [Vite guide](https://vite.dev/guide/), [React on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/) |
| Styling | Custom CSS, transforms/keyframes, simple SVG motifs; Motion only for a demonstrated interaction that benefits | [Motion React](https://motion.dev/docs/react) |
| Persistence | `idb` promise wrapper, owned by a small local repository module; no database server | [idb upstream](https://github.com/jakearchibald/idb), [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) |
| Backend | One typed Pages Function using native Request/Response, fetch and Web Crypto; no OpenAI SDK required | [Pages TypeScript](https://developers.cloudflare.com/pages/functions/typescript/), [bindings/secrets](https://developers.cloudflare.com/pages/functions/bindings/) |
| Runtime tooling | Wrangler and Cloudflare Function types; compatibility date `2026-10-19` | [Local development](https://developers.cloudflare.com/pages/functions/local-development/), [Wrangler Pages](https://developers.cloudflare.com/workers/wrangler/commands/pages/) |
| AI | OpenAI Responses API, initial testing model `gpt-6-luna`, reasoning effort `none`, strict structured response; configurable with server-side `OPENAI_MODEL` | [Model](https://developers.openai.com/api/docs/models/gpt-6-luna), [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) |
| Public bot protection | Turnstile, only on explicitly requested AI actions; not an account or analytics feature | [Server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) |
| Verification | Vitest for contracts/domain logic, fake-indexeddb for isolated storage checks, Playwright for real-browser journeys | [Vitest](https://vitest.dev/guide/), [fake-indexeddb](https://github.com/dumbmatter/fakeIndexedDB), [Playwright](https://playwright.dev/docs/intro) |

**Verified locally:** Node 22.14.0, npm 10.9.2. Vite documents Node 20.19+ or 22.12+. Cloudflare documents React builds with `npm run build` and `dist`, plus Pages TypeScript Functions. Keep browser and Function compilation separate and use browser-standard APIs in the Function; no Node compatibility flag is needed by this design.

**Slice 1 frontend evidence:** React/React DOM 19.3.1, Vite 8.3.4, React plugin 6.1.2 and TypeScript 5.9.3 are installed and locked. Node 22.14.0 satisfies the installed Vite/plugin engine requirements; the real frontend typecheck, lint and production build pass. Playwright 1.64.0 and Sharp 0.35.5 support the pilot checks/exports. IndexedDB/idb, Wrangler/Function types and later domain-test packages are not installed or verified yet; add them in their dependent slices. No public deployment or live model access is implied. Pin the same supported Node version locally and in Pages build configuration.

**Handoff recheck:** read-only web retrieval reached some published registry metadata, but Vite, Wrangler, idb, React DOM, and plugin metadata were not all retrievable. A package's `latest` metadata alone is not evidence of a compatible dependency set. Preserve the selected architecture, then choose and lock the mutually compatible versions in Slice A rather than installing unrelated latest releases blindly. The Cloudflare React/Pages workflow and proposed OpenAI model documentation were rechecked; no installed-package or live-account verification is claimed.

Cloudflare currently recommends Workers for new applications but still documents React on Pages. Honor the selected Pages/`pages.dev` plan; do not silently substitute the Workers Vite plugin or `workers.dev`. [Cloudflare framework guidance](https://developers.cloudflare.com/pages/framework-guides/).

## The Core Journey Through the System

1. **Enter:** load the shell and scene, open IndexedDB, restore memories/pages/preferences, and offer the saved draft if present. If storage fails, explain calmly without claiming data is saved.
2. **Write:** open the journal; input updates the in-memory draft immediately and queues a 500 ms debounced local save. Validate and optimize photos in-browser before storing blobs.
3. **Discover or choose:** manual choice opens editable title/theme/flower controls. AI choice shows first-use consent; only after explicit action obtain a fresh bot token and send the current story, consent version, and token. Never upload a photo or automatically send typing/stored memories.
4. **Review:** change title/theme/flower freely, including mixed emotions and any of the six flowers. The original `story` is not rewritten. Ignore stale AI responses for an older draft revision.
5. **Place:** automatically select an empty spot. Proposed concrete layout: Choose another spot temporarily closes the book into garden selection mode with a small Confirm / Back strip. Highlight available positions, protect occupied positions, and retain the draft when returning to review. No drag editor or additional route.
6. **Save:** flush the draft; one transaction checks the current revision and placement, inserts the idempotently identified memory, updates pages, and deletes only the matching draft. Failure retains the journal/input and offers retry.
7. **Bloom:** after transaction success, close the book and run seed → sprout → young plant → chosen bloom. Under reduced motion, show the final flower immediately/minimally. Refresh restores the saved final flower without duplicate creation or dependence on replay.
8. **Read:** selecting a flower opens the shared book with original text/date/title/theme/photo and no AI request. Back to Garden / Escape return to the same page/context and focus.
9. **Delete:** use the exact PRD confirmation; transactionally delete/free the original spot and clean only empty trailing pages. On success, close and fade/remove the flower peacefully. Failure keeps the memory visible. Other flowers never move.

## Where It Runs and How Someone Tries It

### Local Commands and Origins

Frontend `dev`, `typecheck`, `lint`, `build` and `preview` scripts now run, with a `check:pilot` real-browser harness. Function/domain-test scripts below remain planned for their slices. The full memory journey is not implemented in the visual pilot.

| Task | Planned command | Result |
| --- | --- | --- |
| Reproduce dependencies | `npm ci` after the initial lock is created | First scaffold resolves versions, subsequent installs use the lock. |
| Frontend development | `npm run dev` | Vite on fixed `http://localhost:5173` with strictPort; `/api` proxies to localhost 8788. |
| Function emulator | `npm run dev:functions` → `wrangler pages dev dist --port 8788` | Run a build once first; keep emulator alongside Vite for real local AI integration. |
| Production-shaped preview | `npm run preview:pages` → build, then `wrangler pages dev dist --port 8788` | Static assets and the Function at `http://localhost:8788`. Vite preview alone does not prove the API works. |
| Checks | `npm run typecheck`, `npm run lint`, `npm run test`, `npm run test:e2e`, `npm run build` | Browser + Function type checks, focused contracts, browser journeys, production bundle. |

Set Vite proxy `changeOrigin: false`; allow exact documented local origins only in local configuration. Changing localhost port, browser profile, preview URL, or production hostname creates a separate IndexedDB garden. No automatic transfer/sync is implied. Use one stable production hostname; clearing site data or browser eviction can lose content. Do not claim encryption or guaranteed recovery.

### Secrets and Public Deployment

Local Function secrets belong in a git-ignored `.dev.vars`; production secrets in Pages encrypted secret settings: `OPENAI_API_KEY`, `TURNSTILE_SECRET_KEY`. Browser public configuration may include `VITE_TURNSTILE_SITE_KEY`; secrets never use `VITE_`. Nonsecret Function config: `AI_ENABLED`, `OPENAI_MODEL`, `ALLOWED_ORIGINS`, expected Turnstile hostname/action. AI stays off until integration checks and account configuration succeed. Commit placeholder examples only; ignore `.dev.vars*`, `.wrangler/`, credentials, and the already-excluded learner profile during Slice A, with `!.dev.vars.example` explicitly allowing the secret-free template.

After local stability and explicit public/account approval: choose a Pages project name, configure bot protection and server secrets, then run `npx wrangler pages deploy dist --project-name <chosen-name>` from the repository root with `functions/` present. Dashboard drag-and-drop alone does not compile the Functions directory. After public-repository approval, Git-connected Pages may use `npm ci && npm run build`, output `dist`. [Deployment](https://developers.cloudflare.com/pages/get-started/direct-upload/), [secrets](https://developers.cloudflare.com/pages/functions/bindings/).

Put `_routes.json` in `public` to invoke Functions only for `/api/*`; static garden assets do not need a Function. The endpoint returns JSON for API failures, not a SPA document. Set API `Cache-Control: no-store`. Never put stories in URLs or logs. `functions/`, `.dev.vars`, source art not approved for redistribution, and private files must not be copied into `dist`. Verify bundle/served paths before publication.

Name availability, account setup, actual hostname controls, and live model access are deployment checks, not presumed current facts. Pages static requests and Function quotas differ; documented Free Functions usage shares the Workers 100,000 daily request allowance, which does not limit OpenAI spending. [Pages pricing](https://developers.cloudflare.com/pages/functions/pricing/). Account changes, spending settings, public publication, and submission remain subject to approval.

## Look and Feel

Implements `prd.md > Look and Feel`, `Screens and Layout`, and `scope.md > Inspiration & Identity`.

Carry one master art direction through the scene, flowers, journal, controls, typography, and motion: soft hand-painted edges, three-quarter perspective, upper-left light, natural greens, warm pastels, cream paper, mature whimsy. Proposed pilot tokens: parchment `#faf2de`, ink `#293d34`, moss `#62765a`, lavender `#9b86b5`, muted gold `#d9b56c`. Test text/control contrast; pastel styling does not justify unreadable content. Begin with Georgia/serif display text and a readable system body stack; optional locally hosted licensed fonts need a concrete visual benefit, not external font requests.

The garden fills most of the screen; logo, planting, and page controls stay minimal. Desktop book uses two pages; mobile uses one comfortable scrollable page. Text/inputs/buttons are HTML; paper and botanical accents are decoration. No image-flattened form, generic dashboard, mismatched art pack, or art postponed to a final decoration pass.

Prioritize bloom, book opening/closing, flower feedback, and journal-to-garden transition; ambient sway/particles/butterflies follow. Nest placement/growth/sway transforms separately. Use CSS first; add Motion only when it clearly simplifies a specific behavior. System reduced motion disables growth movement, book transforms, parallax if any, and decorative motion while retaining the final states and every action. Nothing depends solely on hover.

## Visual Asset Inventory and Pilot

### Asset Inventory

These are production targets; the garden and sunflower now have pilot exports, while the remaining collection/journal art is not generated. Keep common canvases and soil anchors when optimizing. Only learner-approved artwork proceeds beyond the pilot.

| File(s) under `public/assets/` | Format / approximate source dimensions | Intended use / production |
| --- | --- | --- |
| `garden/base.webp` | Opaque WebP; pilot native output 1536×1024, versus proposed 2400×1600 target | One custom clearing/path/fence/edge-plant/light painting. Pilot uses the native resolution without upscaling; large-screen sharpness remains part of visual review. No UI text, memory flowers, or baked planting indicators. |
| `garden/foreground.webp` | Optional transparent WebP, aligned 2400×1600 | Matching sparse foliage depth only if helpful; cannot obscure flower targets. |
| `flowers/<type>/bloom.webp` | Transparent WebP, normalized 768×1024 source canvas | All six types, bottom-center soil anchor, distinct silhouettes, common light/detail/scale. Only sunflower during pilot. |
| `flowers/<type>/{stem,head}.webp` | Optional aligned transparent 768×1024 layers | Use if pilot proves reliable matching preparation; do not independently generate and assume registration. |
| `growth/{seed,sprout,young-plant}.svg` | Code-authored SVG, e.g. 256×256 viewBox | Shared early stages matching the painted palette; adapt stem/leaf character when needed for a type. |
| `journal/paper.webp` | Light seamless 512×512 texture | One subtle cream texture beneath real HTML content. |
| `journal/botanical-corner.webp` | Up to two transparent 512×512 accents | Reuse accepted botanical art or generate with its reference; not unrelated stock. |
| Controls, spot rings, sign text, glows, particles | HTML/CSS/simple SVG | Accessible real interactions; one small SVG butterfly if needed. No generated button text. |

Keep lossless source PNGs, prompts/reference IDs and export notes in `artwork/source/` and `artwork/manifest.md`, separate from runtime assets. WebP is for painted raster art; genuine SVG for vectors. The available image-generation tool produces raster output, not promised editable SVG. Request true transparent backgrounds for flowers; verify alpha rather than trusting appearance. The learner can supply art if generation fails.

### Concrete Pilot Proposal

1. Prepare one art brief: palette, painted edges, perspective, upper-left light, mature storybook mood, and ground anchor. Generate one clean garden, inspect it, then one transparent sunflower using the accepted visual reference. Do not generate the other five yet.
2. Normalize the sunflower canvas/anchor and make an alpha-preserving WebP export. Inspect native/display size on white, dark, and checkerboard backgrounds for opaque corners, halos, clipping, and mismatched painted shadows.
3. Prepare shared seed/sprout/young-plant SVG stages. Test a controlled final-flower reveal first; also try clean stem/head layers if available. Do not equate stretching one flat bloom image with a satisfying growth sequence.
4. After project foundation, build a small fictional visual pilot with one spot, one sunflower, replay and reduced-motion views. It tests art/animation feasibility, not persistence or AI. Keep its review controls out of the final public UI.
5. Show the static scene and actual motion on desktop/mobile; record evidence and learner feedback. Agree the workflow before creating the other five flowers or detailed final composition.

### Pilot Pass Criteria

**Slice 1 visual decision:** the learner rejected the original pilot and a subsequent layout revision. The latter passed technical checks at 1366×768, 1680×900, 390×844 and 375×667, but still failed the intended immersive experience. Application implementation is stopped pending a composition choice; see the unapproved `devpost/design-proposal.md` / `.html`. Keep code and artwork intact for reuse. The background/flower exports remain 500,076 + 176,992 bytes; the full flower collection is not generated. This technical specification and its architecture remain approved; neither proposal nor Slice 1 is visually approved. A chosen direction must still pass an actual live pilot review before Slice 2.

| Check | Required evidence |
| --- | --- |
| Style | Scene and sunflower share palette, painted edge/detail, light and scale. Learner reviews them together; no silent stock substitution. |
| Transparency | True alpha around the flower; inspect light/dark/checkerboard composites and edge halos, source versus optimized export. |
| Alignment | Pause seed/sprout/young/bloom stages: the same soil point holds throughout with no visible jump. |
| Growth | Distinct four-stage sequence ending in the selected sunflower, restrained unfurl/glow, assessed in replay. Proposed 2.4–3.0 s total, adjusted from feedback. |
| Integration | Natural grounding/depth, no scenery occlusion of essential targets; separate keyboard/touch-accessible button. |
| Responsive | Inspect at 390×844 and 1440×900; later add 320/768 widths. No planting spot can be cropped away by a blind mobile cover transform. |
| Reduced motion | Immediate/minimal final-state change, no decorative continuous movement, complete functionality. |
| Loading | Record actual export bytes/cold requests/frame pacing. Proposed art budgets: base ≤700 KB, bloom ≤150 KB each, foreground ≤200 KB if used, texture ≤60 KB, initial scene art roughly ≤1.5 MB. These are targets, not measured results; discuss compression/quality tradeoffs. |

If registered layers fail, use shared code-driven early stages plus an art-directed reveal of each accepted final flower. If the pilot still looks poor, refine or request learner-provided/edited layers before producing the full set. Do not force poor results, fake the kernel, or silently reduce the six types. This pilot addresses the learner's actual uncertainty about coherent generated art and convincing code-driven animation.

### Scene Mapping, Organization, and Rights

`flowerCatalog.ts` maps type IDs to paths, dimensions, soil/layer anchors and display scale. `scene.ts` maps ten stable spot IDs (within approved 8–12) to normalized desktop/mobile positions and depth. Use separate non-interactive background/foreground layers. Mobile has deliberate framing and a spot map for the same logical IDs, not cropping that loses flowers. Variations are small, stable per memory, and bounded inside the spot's hit area.

**Latest visual planning constraint:** one Secret Glade environment for the MVP, repeated across garden pages. The learner prefers A but has not approved its final A2 composition; current previews are at `devpost/design-proposal.html`. Any future morning/golden-hour/evening atmosphere must preserve registered scene geometry and existing `pageId`/`spotId` placements. Keep scenery/lighting separate from the fixed spot map; changing atmosphere must not move memories. This records future compatibility only—no atmosphere assets, selector, theme infrastructure or application code is implemented now.

Keep a provenance manifest: provider/tool/date, prompt/reference identifiers, ownership/license evidence, and export transformations. Verify the actual generation-service/account terms and any supplied reference/art licenses before publishing. Do not promise exclusive copyright in AI output. Recommend MIT for learner-owned code if permissive reuse is desired, with third-party notices retained; artwork needs its own explicit notice and learner-approved redistribution terms. A public repository alone does not grant a chosen license. No license is applied now; unclear rights block publication, not technical planning.

## Components

### App and Dialog Flow

`src/app/App.tsx` and `useGardenController.ts`: modes garden, write, review, choose-spot, read, confirmation; current page, selection, save/AI status. Use accessible dialog semantics, focus trapping/return, visible controls, and appropriate Escape behavior. Escape in writing follows safe draft-close rules; Escape in reading returns to the garden. No router needed. Implements `prd.md > Screens and Layout`, `The Core Journey`.

### Garden Scene and Bloom

`GardenScene.tsx`, `FlowerButton.tsx`, `Bloom.tsx`, `GardenPager.tsx`: illustrated layers, fixed positions, selectable flowers, available/occupied states, page controls, growth states. Decorations use `pointer-events:none`; flower buttons have labels, visible focus and roughly 44 CSS px targets. IDs stay stable across breakpoints; coordinates are fixed from the pilot before real content is stored. Implements `prd.md > Arrive and Explore`, `Planting Spots and Garden Pages`, `Plant and Bloom`.

### Botanical Journal

One `MemoryJournal.tsx` shell with editor/review/reader children. Desktop reader left: title/date/full original text; right: selected flower, subtle theme, optional framed photo. Mobile: one scrollable page. Escape user text, preserve line breaks, never use saved content as HTML. Existing memories are view/delete only and require no AI. Implements `prd.md > Writing and Review Journal`, `Revisited Memory`, `Write a Memory`, `Revisit, Persist, and Delete`.

### Validation and Photo Processing

Pure shared validation counts 10–2,000 Unicode code points after trimming for length only; store original story exactly, including whitespace/line breaks. Proposed metadata bounds: title 1–100 and free-text theme 1–120 code points; theme supports mixed feelings. Valid `YYYY-MM-DD` date defaults to local today and stays a date string, not UTC; no unrequested past-only restriction.

One JPEG/PNG/WebP, original ≤5,000,000 bytes (decimal 5 MB). Check type/signature and actual decoding; reject corrupt/unsupported files without losing writing or the previous valid attachment. Process locally: orientation-aware decode, longest side at most 1600 px without upscaling, WebP quality around 0.82 with JPEG fallback if necessary. Store output blob/MIME/dimensions, not unnecessary source filename/metadata. Proposed extreme-dimension guard: 24 MP with friendly feedback to resize. Verify portrait/transparency/large fixtures; no image is sent to the API. These numerical processing defaults are recommendations included in this review. Implements `prd.md > Write a Memory`, `Protect One Active Draft`.

### Draft Controller

`useDraft.ts` serializes 500 ms debounced writes with revision/save status so stale async results cannot overwrite newer typing. Persist story/date/title/theme/flower/photo. A new Plant action resumes the existing draft rather than replacing it. Save for Later flushes and closes only on success; Keep Writing returns; Discard Draft explicitly confirms. Returning users see the approved recovery message; Not Now retains it.

There is a real debounce limit: async browser storage cannot guarantee the last unsaved keystrokes survive immediate crash/forced reload. Flush on controlled exits and best-effort visibility changes; show Saving until completion and Draft saved only after success. Do not claim recovery after site-data loss. A revision conflict from another tab retains local input and asks to reload/resume rather than silently overwrite. Implements `prd.md > Protect One Active Draft`.

### IndexedDB Repository and Page Allocation

`db.ts` owns upgrades; `repository.ts` owns transactions; `placement.ts` owns allocation. Await transaction completion before success/bloom. Stable memory ID from draft, unique spot index, and one operation lock prevent duplicate planting. Never clear the draft in an earlier transaction. A repeated submission for the same ID returns the existing memory instead of inserting another.

Auto-allocation: empty spot on current page, then earliest existing page with space, then a new page. User choice wins if still free. Reject stale occupied choices while preserving draft. A full page offers another copy of the scene; materialize on use rather than infinitely creating empty pages. Deletion retains internal gaps and removes only completely empty trailing pages, preserving the initial clearing and every populated page/spot. If the viewed trailing page disappears, return to the nearest retained page. Implements `prd.md > Planting Spots and Garden Pages`, `Plant and Bloom`, `Revisit, Persist, and Delete`.

### AI Client and Pages Function

`ai.ts` performs explicit cancellable requests, validates answers again and ignores stale-draft results. `functions/api/suggest-flower.ts` is the only application backend endpoint; its pure types/validation live in `shared/`. No IndexedDB access, filesystem, Node process APIs, job queue, conversation state, database, or SDK is necessary. Implements `prd.md > Discover and Review a Flower`, `States and Boundaries`.

## Data Model

IndexedDB database `memorygarden`, version 1; four stores, local only:

| Store | Key and fields | Lifecycle |
| --- | --- | --- |
| `memories` | `id`; original `story`; `title`; `emotionalTheme`; enum `flowerType`; `memoryDate`; `createdAt`; `pageId`; `spotId`; optional `photo` {blob, mime, width, height, bytes}; `variationSeed` | Create once, read, explicitly delete. Unique index `[pageId,spotId]`. |
| `drafts` | key `active`; `draftId` (eventual memory ID); `revision`; unfinished fields/selections/photo; `updatedAt` | One active draft; incomplete values allowed; resume/defer, atomic planting conversion, or confirmed discard. |
| `pages` | stable `pageId`; monotonic `order`; `createdAt` | Initial clearing retained; new pages reuse scene; delete only empty trailing records, never renumber populated layouts. |
| `preferences` | singleton; consent version/acknowledgment; last viewed page; relevant local UI preferences | No analytics or required name. A consent acknowledgment never triggers a request. |

Embed photo blobs in their owning draft/memory record to avoid a separate media system/orphans. Plant transaction spans memories/drafts/pages: read revision, check placement, insert once, update pages, remove matching draft; any failure rolls back. Delete/page cleanup is also transactional. Close old DB connections on version change; blocked upgrades ask to close other tabs. Recreate and revoke blob URLs as views mount/unmount. Browser clearing/eviction or unavailable storage remains a disclosed limitation.

## External Services and API Contracts

### Browser to Function

`POST /api/suggest-flower`, same-origin JSON. Strict object with no extra keys; bounded body of 12 KiB, enforced while reading as well as checking any declared size. Do not trust Content-Length alone. Consent must be acknowledged in UI; a matching version field is not proof that a hostile client consented.

```json
{"memoryText":"Fictional memory, 10–2,000 characters","consentVersion":"2026-10-19","turnstileToken":"fresh-token"}
```

Token is nonempty and ≤2048 characters. Public use requires configured validation; local use uses documented test keys, no production bypass. Success:

```json
{"title":"An Evening to Remember","emotionalTheme":"Friendship, joy, and nostalgia","flowerType":"lavender"}
```

Strict response schema: object; `additionalProperties:false`; required `title`, `emotionalTheme`, `flowerType`; nonempty strings bounded at 100/120 code points; flower enum exactly `sunflower`, `lavender`, `rose`, `daisy`, `forget-me-not`, `iris`. Validate on server and browser. No story rewriting or returned HTML.

The exact schema supplied as `text.format.schema` is:

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "title": { "type": "string", "minLength": 1, "maxLength": 100 },
    "emotionalTheme": { "type": "string", "minLength": 1, "maxLength": 120 },
    "flowerType": {
      "type": "string",
      "enum": ["sunflower", "lavender", "rose", "daisy", "forget-me-not", "iris"]
    }
  },
  "required": ["title", "emotionalTheme", "flowerType"]
}
```

Errors use JSON `{code,message}` without echoed story/upstream body/secrets: 400 validation, 403 origin/consent/bot, 405 method, 413 oversized body, 429 throttling/quota, 503 disabled/unconfigured AI, 502 refused/incomplete/invalid output, 504 timeout. No automatic retry; preserve draft and show Try Again / Choose My Own Flower. Add Retry-After when known; API responses are no-store.

### Function to OpenAI

`POST https://api.openai.com/v1/responses`, Bearer server secret, JSON. Initial testing model `gpt-6-luna`, configurable only through server-side `OPENAI_MODEL`; `reasoning:{effort:"none"}`, `max_output_tokens:320`, `store:false`; no streaming, tools, conversation state, or automatic retries. About 15 s OpenAI timeout and 22 s overall browser timeout including the bounded bot check. Keep manual choice available while waiting.

Use fixed instructions to suggest a concise title, respectful mixed/difficult emotional theme and symbolic allowed flower; treat the memory as data, not instructions. Send only current text as user input. `text.format` uses `type:"json_schema"`, `name:"memory_flower"`, `strict:true`, and the bounded schema. Parse completed message/output-text items from the raw API response rather than assuming an SDK helper; reject refusals, truncation, malformed JSON, extra keys and invalid fields. Do not fabricate a successful AI result.

Official documentation lists Responses/Structured Outputs and reasoning none for this model, with standard text prices $0.10/million input tokens and $0.50/million output tokens plus separate cache charges. Approximately 1,000 input + 200 output tokens is $0.0002 before cache-related charges; characters are not tokens. No free API access or account eligibility is promised. Verify one fictional live quality/access check in Slice F. Current deprecated GPT-4.1/5.4-nano models are not the starting recommendation. [Model](https://developers.openai.com/api/docs/models/gpt-6-luna), [deprecations](https://developers.openai.com/api/docs/deprecations).

Proposed consent: “AI suggestions send this memory's text through our secure service to OpenAI. Your photo stays in this browser. You can choose your own flower instead.” Explain the security bot check before loading it. Disable response storage and content logging, but do not call `store:false` zero retention: abuse monitoring and prompt caching have separate provider policies. Browser-local storage is not encryption or backup. [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data).

### Bot Protection, Throttling, and Spending

Validate each public AI token with `POST https://challenges.cloudflare.com/turnstile/v0/siteverify`, server secret and token; require success and matching configured hostname/action (`memory-suggestion`). Tokens are single-use and short-lived; every explicit retry obtains a fresh one. No memory/photo goes to Turnstile. Load only after the AI request/consent, never for manual planting. If the bot check fails, manual mode continues. [Turnstile validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

Baseline: strict input/origin/output limits, fresh verified challenge, one in-flight request per browser, proposed 20 s browser cooldown, bounded per-isolate burst counter (three attempts/minute per transient hashed IP, 60 s TTL), timeouts, no retries, and `AI_ENABLED` switch. No raw IP/story persistence or logs. Browser cooldown and isolate counters are bypassable best-effort checks, not durable per-person quotas.

Pages supports only a subset of Workers bindings; its binding list does not include the Workers Rate Limiting API. Do not assume it works by copying a Workers config. Zone WAF controls are not presumed available on a free `pages.dev` hostname. If actual supported endpoint controls exist in the selected project, configure/test a proposed three requests/minute rule. Do not silently add Redis, KV, another Worker or Durable Object. [Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/), [Workers rate limiter](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).

Before public AI, configure a learner-approved project alert (suggested small demo amount: $1) and available account request/token controls. Alerts do not stop requests or guarantee a cap. If an enforceable cap exists for the actual account, configure only with approval and verify; otherwise document exposure and disable AI manually if needed. [OpenAI spend alerts](https://developers.openai.com/api/docs/guides/terraform/rate-limits-and-spend).

Residual risk: solved challenges, humans, fresh distributed requests and counter resets can still consume tokens. Key secrecy, Origin checks and alerts do not make an anonymous endpoint abuse-proof. No hard global spending cap is claimed. Actual public AI enablement is a deployment gate after the learner reviews this risk; manual public functionality remains usable if AI is disabled.

## File Structure

Planned tree; no application files are generated during this stage:

```text
src/
  main.tsx
  app/{App.tsx,useGardenController.ts}              # mode/dialog transitions
  garden/{GardenScene,FlowerButton,Bloom,GardenPager}.tsx
  garden/{scene.ts,flowerCatalog.ts}                # stable coordinates/asset anchors
  journal/{MemoryJournal,MemoryEditor,SuggestionReview,MemoryReader}.tsx
  components/{ConfirmDialog,DraftRecovery,AIConsent}.tsx
  hooks/useDraft.ts                                # serialized autosave/recovery
  storage/{db.ts,repository.ts,placement.ts}          # browser transactions
  lib/{photos.ts,ai.ts,turnstile.ts}
  styles/{tokens.css,garden.css,journal.css,motion.css}
shared/{contracts.ts,validation.ts}                 # pure browser/Function contracts
functions/
  api/suggest-flower.ts                            # only backend route
server/{openai.ts,turnstile.ts,guards.ts}            # helpers outside Pages route directory
public/
  assets/garden/{base,foreground}.webp              # foreground optional
  assets/flowers/<type>/{bloom,stem,head}.webp        # layers pilot-dependent
  assets/growth/{seed,sprout,young-plant}.svg
  assets/journal/{paper,botanical-corner}.webp
  _routes.json                                     # Function only for /api/*
  _headers                                         # static security headers
artwork/{source/,manifest.md}                       # approved source/provenance
tests/{unit/,e2e/,fixtures/}                        # fictional fixtures
devpost/                                           # planning and review companions
index.html / package.json / package-lock.json
vite.config.ts / tsconfig*.json / wrangler.jsonc
.dev.vars.example / .gitignore / .node-version
README.md / LICENSE / ARTWORK-LICENSE.md            # license choices pending publication
```

Derive actual files from working slices; do not create empty files for symmetry. Use separate browser/Function TypeScript compilation and a narrow checked Env type. Shared validation cannot import DOM/storage code. Keep helper modules outside the file-routed `functions/` directory so they do not become unintended routes. Server code/secret bindings must not enter the Vite browser dependency graph. The actual completed tree will be reflected in the learning app map.

## Important Failure Modes

| Failure | Required response |
| --- | --- |
| Storage unavailable/quota/rollback | Retain current in-memory input, calm feedback/retry, no false Draft saved or bloom. Only completed transactions survive reload. |
| AI disabled/unconfigured/refused/malformed/timeout/quota | Preserve draft, explicit retry with fresh token or manual choice. Never resend automatically. |
| Bad/large/corrupt photo | Friendly validation, preserve story/selections/previous valid photo, allow continuing without it. |
| Close/refresh/concurrent draft changes | Controlled exit flush; restore last committed revision; reject stale revision and duplicate/occupied insertion without destroying input. Disclose debounce/storage limits. |
| Delete fails / trailing page removed | No false success; preserve existing data on failure. On success free original spot, keep other positions, return to retained context. |
| Pilot artwork/growth fails quality check | Pause full collection; show evidence, refine or agree supplied/edited art. No mismatched final placeholders. |

## Implementation and Verification Plan

After spec approval invoke `5-build`, create/review the canonical `devpost/checklist.md`, and choose learn/fast pacing under that skill. Do not create an HTML build checklist. Each meaningful slice records verification, commits only intended safe files, and shows the learner the working result. Learner checkpoints, final review/revision, and the learning wrap-up/app map remain required; no slice is complete because files merely exist.

| Slice | Deliverable | Verification / learner evidence |
| --- | --- | --- |
| A — Foundation | React/Vite/TS, styling entry, actual dependency lock, Function typing/scripts/ignore rules | Engine/peer compatibility; typecheck/lint/build/local start; record versions. Check credential/profile tracking before commit. |
| B — Visual foundation | Garden/sunflower pilot, palette/anchors, responsive composition, basic bloom | Alpha, alignment, style, actual replay/reduced motion, byte/load checks, learner visual review before other five flowers. |
| C — Memory foundation | Repository, journal editor, photo handling, protected draft | Isolated transactions plus real-browser reload/resume/defer/discard; storage failure; text/date/photo boundaries; mobile writing. |
| D — Garden interactions | Stable spots, six coherent flowers, auto/optional placement, save-before-bloom | Rapid double submit, stale occupied spot, rollback, refresh mid-bloom, deterministic restoration, keyboard/touch targets. |
| E — Revisit and pages | Reading journal, exact delete flow, page navigation/cleanup | Same context on close; no AI reading; cancel/delete/failure; middle gaps versus empty tails; photo/deletion refresh. |
| F — AI integration | One Pages Function, consent/manual route, structured OpenAI, Turnstile/safeguards | Method/body/schema/origin checks; controlled refusal/403/429/503/timeout; emulator check; one real fictional request with authorized account access and no text logs. |
| G — Polish and test | Coherent final visuals, priority motion, accessibility | Browser journeys 390×844/1440×900 plus 320/768 widths; focus/Escape/keyboard, contrast, reduced motion; production bundle through Wrangler. Label isolated vs browser/live evidence. |
| H — Approved deployment | Pages hostname, verified server secrets, public working app | Approval before external changes; manual + consented AI; independent browser gardens; draft/reload/deletion; bundle/Git secret/profile/privacy checks. Verify failure still permits manual planting. |

Unit checks focus on allocation, idempotency, validation and rollback; Playwright checks real IndexedDB, navigation and accessible interaction. Mock success does not prove live AI or illustration quality. Avoid tests that merely mirror CSS. Keep source data fictional. Verify one polished scene before pagination enhancements, but do not mark the final journey complete without its committed capacity behavior.

## What Was Simplified and Why

One static frontend and one proxy replace a full-stack framework; IndexedDB replaces a remote memory database; one draft replaces history/sync; one repeated scene replaces multiple environments; shared early stages replace dozens of painted frames; CSS precedes optional Motion. These preserve the kernel, journal, privacy, and reliable journey.

No auth/password recovery, social/community, analytics dashboard, runtime image generation, watering/death/streaks, cloud backup, or open world. Export/import, surprise memories, seasons/themes/environments, more flowers and optional accounts remain future work with no MVP criteria.

## Shipping, Licensing, and Submission Handoff

Prepare the requested public site, public repository, technical README/screenshots/architecture/setup, fictional demo, and short video plan after build completion. Current skills require video and repository; check the actual form for exact duration/constraints during `6-ship`. The one-minute product scenario is not an invented submission-duration limit or a guarantee of judging scores.

Review intended files and Git history for secrets/private content before public publication. The ignored learner profile and earlier planning passages about personal learning require care; ignore rules do not remove history. Agree remediation if sensitive material is tracked, without silent history rewriting. Public deployment/repository/account changes and submission require approval. URLs are recorded only after real access checks.

Code license and artwork redistribution terms are separate reviewed choices. Verify generator/account and reference rights before publishing art; no automatic blanket open-source claim. The installed `6-ship` skill has the learner write Devpost answers/reflections; the agent can help identify gaps, verify technical evidence, and correct spelling/grammar without fabricating learner-authored submission copy. No external submission is sent in this stage.

## Decisions and Open Issues

**Learner-selected:** React/Vite/TypeScript/custom CSS, IndexedDB, Pages/one Function, OpenAI text suggestions, no auth/cloud database, local-first then `pages.dev`, six flowers, hybrid illustration/code, pilot before full artwork, verified slices A–H, and first-class visual quality.

**Implementation defaults accepted through specification approval:** idb; native fetch; `gpt-6-luna`/reasoning none; Turnstile only for AI actions; 500 ms serialized draft saves; ten stable spots; temporary selection strip; image optimization/counting/metadata defaults; concrete asset targets; best-effort non-global endpoint throttles. These were explicitly identified recommendations rather than invented earlier learner choices. The learner additionally confirmed GPT-6 Luna for initial testing with server-side model configuration. Artwork and motion are still subject to the planned visual pilot review.

**Genuine uncertainty:** the learner explicitly questions generated-art consistency and animation alignment. Slice B tests one garden + transparent sunflower + early stages + actual composite/bloom before producing the rest. Record real findings and feedback; do not claim the question is already resolved.

Evidence gates still required:

- Frontend foundation: installed/locked and built in slice 1; later storage/Function/test dependencies still require their own resolution and verification. Registry metadata lookup failures during planning did not prevent the actual frontend install.
- Before full artwork: pilot quality/alpha/alignment/loading evidence and learner review.
- Slice F: real selected-model availability/quality, API behavior, actual pricing/account limits, fictional live call.
- Before public AI: learner-approved account/Turnstile setup, alert amount, residual cost risk and available hostname controls; missing configuration leaves AI off and manual usable.
- Before publishing: actual licenses, profile/private-content/history review, explicit public approval and submission-rule/video verification.

These are build/deployment checks, not unresolved product redesign or completed work. Specification approval is recorded. The canonical `5-build` checklist carries the reviewed working order and progress; no external account changes, public publication, or deployment are authorized merely by entering the build stage.
