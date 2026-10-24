---
doc: prd
status: approved
---

# MemoryGarden — Product Requirements

A personal, illustrated garden where a university student or other young adult preserves meaningful moments as flowers and revisits their stories.

Source: `scope.md > Who It's For` and `scope.md > The Unique Kernel`.

**Approved product definition:** the learner finalized the feature scope and the remaining navigation, input, photo, page-management, and reduced-motion decisions. `prd.html` is the visual companion; Markdown remains canonical. Technical planning is next. The illustrated world, botanical journal, and planting experience are first-class requirements that must guide architecture and build sequencing.

**Revision, 2026-10-24 (learner decisions):** saved memories can now be edited from the reading journal; the journal uses one adaptive page instead of selectable layouts (with a photo: title, date and photo on the left, words, feeling note and pressed-flower tag on the right; without one: words on the left, flower on the right), replacing the three layouts listed below; growth runs in about 2–3 seconds without visible stage captions; the opening may be a learner-generated video clip ending on the garden frame; AI suggestions become an optional extra. `context/brief.md` (private) is the learner's full story.

**Storybook revision, 2026-10-21 (learner-authorized):** the experience now opens from a closed botanical storybook, the art direction becomes a stylized animated 2D storybook world, flowers grow through five stages including a bud, the journal offers three page layouts, and music is opt-in. These additions are marked *(storybook revision)* below. Every earlier functional requirement still applies.

## The Core Journey

Source: `scope.md > The Core Loop` and `scope.md > What “Working” Looks Like`.

0. *(storybook revision)* On a first visit, see a closed botanical storybook titled “MemoryGarden — Where Memories Bloom” with one clear action, **Open My Garden**. The cover lifts, the garden rises from the pages, and the view moves into the garden until the book's edges disappear. The opening is skippable from its first frame. Returning visitors enter the garden directly.
1. Enter a peaceful, living garden. On first use, see an inviting clearing, naturally integrated planting spots, and a small illustrated sign such as “Your story begins here.”
2. Choose “Plant a Memory.” The garden gently softens or dims and an illustrated journal opens in the center.
3. Write a story beneath “What moment would you like to remember?”, optionally attach a photo, and select or adjust the memory date. Automatically preserve one active local draft and quietly indicate when it has been saved.
4. Explicitly request AI suggestions through “Find My Flower,” with understandable consent before the first analysis, or use a clear manual option without external AI processing.
5. Review and edit the title, emotional theme, and flower illustration. The original story is unchanged unless the user edits it. An available planting spot is selected automatically; optionally choose another highlighted empty spot before confirming.
6. Choose “Plant This Memory.” Save the memory successfully before clearing its associated draft, closing the journal, or starting the bloom. Prevent duplicate planting from repeated clicks. After a successful save, a seed drops into the chosen spot, sprouts, grows a stem, and blooms into the selected flower, followed by a subtle sparkle or glow.
7. Click a planted flower. It gently glows or sways, the garden dims, and the same illustrated journal opens for reading without any AI request. “Back to Garden” or Escape closes it and returns to the same garden page and flower position.
8. Return later in the same browser to find the saved garden. If a draft exists, offer “Continue Writing” or “Not Now” beneath “Your story is still waiting to bloom 🌱”. Navigate garden pages when the collection grows. Optionally delete a memory through a secondary action and explicit custom confirmation; its flower peacefully fades, freeing the spot without changing other memories.

## Screens and Layout

Source: `scope.md > Inspiration & Identity` and `scope.md > The POC Boundary`.

### Storybook Cover and Opening *(storybook revision)*

A clothbound storybook rests on a softly lit desk. Its cover carries the title, the tagline, gilded botanical ornament and the small butterfly motif. Gentle ambient movement (light on the gilt, steam from a cup) keeps it alive. **Open My Garden** is the only action. The opening is short and coherent: the same garden art is used inside the book and in the live garden, so there is no jump between unrelated scenes. A small “Close My Garden” control in the garden reverses the sequence back to the cover, and opening the book again replays the introduction. Neither transition is ever required for ordinary navigation.

### Garden

The garden occupies most of the screen. Use a slightly elevated, three-quarter 2D viewpoint that shows the ground, flower beds, a winding stone pathway, and surrounding scenery. Compose a small clearing with soft grass, tiny edge wildflowers, a small wooden fence, decorative plants, golden sunlight, and subtle shadows.

*(storybook revision)* The clearing is a Secret Glade: soft sky with drifting clouds and occasional birds, distant hills, restrained trees, a wooden fence with a vine-arched gate, a short winding stone path, calm grass, framing foliage at the edges, and a butterfly. Planting areas stay visually quiet. Decorative blossoms appear only at the gate and outer edges, never as large memory-flower species in the scenery. Desktop and mobile have separately composed layouts with the same logical planting spots.

Integrate approximately 8–12 predefined planting positions naturally along the pathways and flower beds, with no visible grid. Empty spots use subtle soil patches or tiny glowing indicators. A welcoming central spot and small illustrated sign invite the first memory. Keep “Plant a Memory” easy to discover without overpowering the landscape.

When the current page fills, automatically make another garden page available. Each page reuses the same scene, assets, and fixed-position layout with its own planted memories. Provide simple, storybook-integrated page navigation; exact control placement is an implementation detail. This is a repeated scene, not an expanding or explorable world.

Place a small, elegant MemoryGarden logo at the upper left, the primary “Plant a Memory” action, and a simple way to navigate garden pages or access saved memories. Selecting flowers provides direct access to their journals; a separate saved-memory library is not required. Keep navigation minimal and integrated into the world. Avoid sidebars, complicated menus, analytics, and unnecessary controls. No additional settings surface is required by the MVP.

Desktop shows a wider landscape. Mobile adapts the composition to keep the planting area visible and interactive, with comfortably sized controls rather than a shrunken desktop view.

### Writing and Review Journal

An illustrated journal opens centrally over the gently softened or dimmed garden. On desktop, it resembles an open two-page book. Mobile uses a comfortable single-page journal rather than two compressed pages.

Writing is spacious and distraction-free. Review shows the title, emotional theme, and chosen flower illustration with editable choices. A gentle glow or botanical illustration on the opposite page is a possible transition treatment, not a required additional feature. Exact control arrangement is a technical-planning and layout detail within these agreed surfaces.

### Revisited Memory

Clicking a flower opens the same physical-book design used for creation, with a gentle page-opening transition over the softly dimmed but visible garden.

On desktop, use a two-page botanical journal:

- **Left page:** title in elegant typography, original memory date, and full original text with comfortable reading spacing and subtle handwritten or storybook-inspired character.
- **Right page:** the selected flower's botanical illustration, an optional beautifully framed photo, a subtle emotional theme, and small botanical decorations.

*(storybook revision)* A memory is shown in the page layout chosen when it was written: **Classic** (story on one page, flower illustration and optional photo on the other, as above), **Photo Story** (a large framed photograph with a shorter writing area and botanical decoration), or **Scrapbook** (title, date, story, photo and flower combined with tape, a pressed-flower note and looser composition). Without a photo, Photo Story and Scrapbook fall back gracefully to their text-and-flower arrangement.

On mobile, use a single-page vertically scrollable journal. Warm paper textures, soft shadows, delicate floral decoration, and smooth transitions maintain the shared art direction. Keep reading comfortable and provide an obvious, elegant “Back to Garden” control. Deletion is visually secondary; a small options menu is a possible treatment rather than an additional feature requirement.

## Look and Feel

Source: `scope.md > Inspiration & Identity`.

### Shared Art Direction

Hand-painted, soft, cozy, whimsical, and mature enough for young adults. Draw inspiration from illustrated children's storybooks and peaceful indie games without making the result overly childish or cartoonish. Use warm pastel colors, natural greens, soft sunlight, and delicate flowers. No specific reference products or URLs have been supplied.

The garden, flower library, journal, typography, animations, and interface elements must belong to the same world. The interactive garden and seed-to-flower animation are core experiences. Exclude pixel art, realistic 3D, corporate styling, SaaS sidebars, tables, analytics cards, and unnecessary navigation.

Controls use natural colors, soft rounded shapes, and gentle responses. The journal has warm cream-colored pages, delicate botanical decoration, elegant typography, and subtle paper textures. Exact font choices remain open. The flower collection and its art requirements are defined below; final asset artwork has not been selected.

*(storybook revision)* The look is a stylized, animated 2D storybook world rather than a dense painted landscape: soft expressive shapes, cooler sage and moss greens, selective warm golden light, soft layered depth, and refined cozy-game charm that adults also enjoy. Avoid photorealism, pixel art, generic icon packs and harsh neon. One style bible (palette, typography, shapes, light, layer order, motion timing) governs the book, garden, flowers and journal. A small butterfly recurs as the shared motif. Decoration stays restrained so text and memory flowers always read first.

### Flower Collection

Target six reusable, beautifully illustrated flowers in a consistent hand-painted storybook style:

| Flower | Symbolic associations |
| --- | --- |
| Sunflower | Joy, achievement, celebration |
| Lavender | Peace, comfort, friendship |
| Rose | Love, affection, meaningful relationships |
| Daisy | Simple happiness, everyday moments |
| Forget-me-not | Nostalgia, remembrance, bittersweet memories |
| Iris | Hope, resilience, personal growth |

Each flower has its own recognizable silhouette, palette, and personality. Distinguish flower types by shape as well as color. Use consistent prepared illustrations rather than generating images for each memory. Gentle swaying and slight size variation make the garden feel organic, while every planted flower remains individually selectable. Multiple memories can use the same flower type. Composition must avoid overcrowding.

Six types are preferred. If producing six coherent, high-quality assets becomes difficult, the learner permits starting with four and expanding later. Quality and consistency take priority over quantity; no four-flower subset has been chosen. Resolve the subset with the learner if this fallback becomes necessary.

### Atmosphere and Motion

The empty garden already feels alive: leaves and flowers sway slowly, butterflies appear occasionally, and small particles float through sunlight. Ambient motion and hover responses are subtle, calm, and non-distracting. Transitions feel smooth and natural.

Respect the user's system reduced-motion preference throughout the garden, journal, and planting experience. Replace seed-growing, journal-opening, parallax if present, and decorative animations with immediate or minimal transitions. Keep the garden beautiful, accessible, and fully functional without animation; the selected flower must still appear after a successful save. Parallax is not a new requirement. No game engine or explorable world is required.

*(storybook revision)* Scenery is composed in separate layers (sky, hills, trees/fence/gate, ground, foreground foliage, atmosphere), so clouds, birds, butterflies and foliage can move independently and a subtle pointer parallax adds depth on desktop. Reduced motion also skips or replaces the book opening and closing with a short fade.

**Music and sound** *(storybook revision)*: soft instrumental ambience (gentle piano or acoustic texture, no vocals or drums) and quiet effects for opening the book, planting and blooming. Audio is always opt-in: nothing plays before the user turns it on. A visible, integrated control toggles it, and the preference is remembered locally. Music loops gracefully and does not restart during ordinary navigation. Only original or properly licensed audio is used.

### Emotional Tone

Comforting, magical, playful, and emotionally meaningful. Happy, bittersweet, and difficult memories all belong. AI and interface copy must not force cheerful interpretations or overwrite a person's meaning. Flower associations are symbolic suggestions, never restrictions: users can choose any flower for any memory. Do not label emotions good or bad or assume a memory has only one emotion. The emotional theme may acknowledge mixed feelings; its exact editing control remains open.

## Features and Behavior

### Arrive and Explore

Source: `scope.md > The Unique Kernel` and `scope.md > What “Working” Looks Like`.

The first-use garden is an intentional, inviting scene, not a lifeless empty container. Existing flowers represent saved memories and open their stories when selected. Use the agreed flower collection and fixed positions. Preserve individually selectable flowers, subtle hover responses, and accessible click targets. Avoid overcrowding, including when several memories share the same flower type.

### Open and Close the Storybook *(storybook revision)*

Source: `scope.md > Inspiration & Identity`, storybook revision.

First visits start on the closed book. **Open My Garden** plays a short opening (cover lifts → garden rises from the pages → view moves into the garden) and ends in the live, interactive garden with focus on its primary action. **Skip** is visible from the first frame and goes straight to the garden. Remember locally that the introduction was seen; returning visitors start in the garden. **Close My Garden** reverses the sequence back to the cover, where opening again replays the introduction. Reduced motion replaces both sequences with a short fade. The transitions never block planting, reading or deletion and are never required to reach them.

### Journal Page Layouts *(storybook revision)*

Source: `scope.md > The POC Boundary`, storybook revision.

While writing or reviewing, users choose one of three predefined layouts (Classic, Photo Story, Scrapbook). Switching layouts never changes or loses the story, title, date, theme, flower or photo, and all fields remain editable. The chosen layout is saved with the memory and used when it is reopened. There is no free-form drag-and-drop page editor. If practical, Photo Story may offer a photo-left / photo-right choice within its fixed boundaries.

### Planting Spots and Garden Pages

Source: `scope.md > The POC Boundary`; capacity and placement are refined by the learner's PRD decisions.

Each garden page has approximately 8–12 naturally composed planting spots. After memory review, automatically select an available spot and let the user optionally choose a different empty spot. Available spots gently highlight during selection; occupied positions cannot be overwritten. No drag-and-drop interaction is required. The precise presentation of optional spot selection alongside the journal is a layout detail for technical planning.

A full garden must not block another memory. Automatically make a new garden page available when all spots are occupied, reusing the existing scene and layout. Allow users to move between pages with lightweight controls. Preserve each memory's association with its flower, page, and spot across visits. Deleting a memory frees its spot.

Build and verify one beautiful scene with reliable planting first, then add the repeated-page capacity mechanism. Do not introduce distinct environments, scene customization, or an infinite world. Deletion frees original spots without moving any other flowers. Remove trailing garden pages only when completely empty; retain pages containing memories and do not unexpectedly rearrange the garden. Stable placement is a requirement. The routine order for choosing an available spot can be specified technically without relocating existing memories.

### Write a Memory

Source: `scope.md > The Core Loop` and `scope.md > The POC Boundary`.

Open the journal from “Plant a Memory.” Provide the welcoming writing prompt, a spacious story area, one optional photo attachment, and a selectable memory date. The user controls edits to the original story. Memory text must contain 10–2,000 characters. Accept one JPEG, PNG, or WebP photo with a maximum original upload size of 5 MB, and optimize it before saving locally. Show friendly validation messages without losing the draft. Date defaults, photo-optimization settings, and other routine input details belong in the technical plan without adding product features.

### Protect One Active Draft

Source: `scope.md > The POC Boundary`; refined by the learner's explicit protection requirements during the PRD interview.

Automatically save one unfinished memory locally as the user writes, using a short debounce. Preserve story text, selected date, title, flower, and emotional theme, including changes made during review. Preserve the attached photo using suitable browser storage such as IndexedDB when supported. Display a subtle “Draft saved” indicator after saving without interrupting writing. Debounce timing is an implementation detail; no exact interval is fixed here.

When closing a writing journal with unfinished changes, offer:

- **Save for Later:** preserve the draft and close the journal.
- **Keep Writing:** return to the journal without losing changes.
- **Discard Draft:** require explicit confirmation before permanently removing the draft.

On refresh or reopening, when a draft exists, display:

> Your story is still waiting to bloom 🌱

Offer **Continue Writing** and **Not Now**. “Not Now” leaves the draft intact. Retain the draft until successfully planted or deliberately discarded. Do not silently replace it with another unfinished memory; the MVP supports one active draft per browser, without draft history or cloud recovery.

Automatic protection is subject to browser storage availability and uncleared site data, like the saved garden. It must not imply cloud backup or guaranteed recovery when storage is unavailable. Draft-save, photo-validation, and photo-storage failures must use friendly messages and preserve current writing and valid selections; do not falsely indicate that unsaved writing is saved. Exact recovery messaging and browser-support handling are technical details within these safety requirements.

### Discover and Review a Flower

Source: `scope.md > The Core Loop` and `scope.md > The POC Boundary`.

“Find My Flower” requests a meaningful title, emotional theme, and matching flower only through an explicit action and with informed consent before the first analysis. Do not send memory text while typing. A clear manual route permits title, theme, and flower selection without AI.

Users can change all suggested planting details before confirming. Display the flower illustration during review. All available flower types remain selectable regardless of the suggested emotional theme, including types already used by other memories. Suggestions remain optional, and the story is not rewritten.

If AI suggestions fail, retain everything already entered and show a friendly error with **Try Again** and **Choose My Own Flower**. Retrying requires the user's action; never automatically resend personal text. Manual planting remains available regardless of AI availability. Exact loading presentation and consent-decline wording are review details; neither may make AI mandatory or discard the draft.

### Plant and Bloom

Source: `scope.md > The Unique Kernel` and `scope.md > What “Working” Looks Like`.

“Plant This Memory” first saves the memory. Prevent repeated clicks from creating duplicates. If saving fails, keep the journal open, preserve the draft, provide a clear retry action, and do not display a completed bloom. Only after a successful save clear the associated draft, close the journal gently, and focus attention on the selected garden spot. A refresh after saving must not lose the memory even if its animation was interrupted; the animation is a presentation of a saved memory.

Use the consistent sequence **seed dropping into soil → small sprout → growing stem → flower blooming**, with a subtle sparkle or gentle glow celebrating the new memory. *(storybook revision)* The sequence is seed → sprout → young plant → bud → bloom, about five seconds: the seed settles, the stem genuinely grows, leaves unfold from their joints, the bud forms and the petals open ring by ring, then the plant settles into a gentle sway. It must never be a full flower image simply scaled from zero. The final bloom matches the reviewed flower choice, remains associated with that memory, and is individually available to revisit. Exact pacing and the optional spot-selection layout belong to technical planning. With system reduced motion enabled, use immediate or minimal transitions to show the successfully planted flower without the full growth sequence or decorative animation.

### Revisit, Persist, and Delete

Source: `scope.md > The Core Loop` and `scope.md > The POC Boundary`.

Opening a flower gently glows or sways the selected flower and opens the illustrated reading journal over the softly dimmed garden. Show the title, original memory date, full original story exactly as written, subtle emotional theme, selected flower illustration, and photo when supplied. Do not request AI to reopen saved memories. This is a view-and-delete experience; editing existing memories is outside the MVP.

“Back to Garden” and Escape close the journal gently, returning to the same garden page and flower position. Opening, reading, and closing do not modify planted flowers or saved content. Support keyboard navigation, accessible control labels, and proper focus management when opening and closing the journal. Respect reduced-motion preferences for the flower response and journal transitions.

Memories and their page/spot associations survive refresh and reopening in the same browser while site data remains available.

#### Delete With Confirmation

Keep deletion visually secondary. Selecting it opens a custom confirmation dialog:

> **Let this memory go?**
>
> This will remove the memory and its flower from your garden. This action cannot be undone.

- **Keep My Memory:** the primary, safe option; retains the memory and flower.
- **Delete Forever:** clearly identified as destructive; only this explicit confirmation authorizes deletion.

After deletion succeeds, the journal closes and the flower peacefully fades away, or disappears with an immediate/minimal transition under reduced motion. Its planting spot becomes available again, other flowers remain unchanged, and the deletion persists after refresh. Remove only completely empty trailing pages, never pages containing memories or internal gaps by rearranging other flowers. Do not show dramatic withering or a dying-flower animation. A failed deletion must not be represented as successful removal; technical planning will specify clear failure feedback while preserving the saved memory.

## States and Boundaries

Source: `scope.md > The POC Boundary`.

- **First visit** *(storybook revision)*: show the closed storybook with **Open My Garden**; the opening is skippable and remembered locally.
- **Returning visit** *(storybook revision)*: enter the garden directly; Close My Garden returns to the cover, from which the introduction can be replayed.
- **Audio** *(storybook revision)*: silent until the user turns music on; the choice is remembered locally; muting is always one action away.
- **First use:** show the complete illustrated clearing, ambient life, inviting sign, planting spots, and discoverable planting action.
- **AI consent:** explain external processing before the first analysis; permit manual planting without external AI use. Never imply all processing is on-device.
- **Writing:** debounce local autosave of one active draft, including the selected date, title, flower, emotional theme, and supported photo. Quietly show “Draft saved” after saving.
- **Leaving unfinished writing:** offer “Save for Later,” “Keep Writing,” and “Discard Draft”; require explicit confirmation for permanent discard.
- **Returning with a draft:** show “Your story is still waiting to bloom 🌱” with “Continue Writing” and “Not Now.” Either retains the draft until planting or deliberate discard.
- **AI failure:** keep all writing and selections, show a friendly message, and offer “Try Again” or “Choose My Own Flower.” Never retry or resend text automatically.
- **Final save failure:** keep the journal open and draft intact, show retry, and do not show a completed bloom. Repeated planting clicks do not create duplicate memories.
- **Final save success:** retain the planted memory, clear only its associated draft, then close the journal and begin the bloom.
- **Reduced motion:** honor the system preference; use immediate/minimal transitions instead of seed-growing, journal-opening, parallax if present, and decorative animation. All functionality and the final planted flower remain available.
- **Returning user:** restore saved memories in the same browser while site data remains intact. Clearing site data removes the garden; no accounts, cloud recovery, or cross-device synchronization.
- **Full garden page:** automatically make another copy of the same composed scene available so users can continue planting. Garden-page navigation remains minimal.
- **Occupied spot:** cannot be overwritten by a new planting. Deleting its memory makes it available again.
- **Reading:** show the saved original text without an AI request. Return to the same garden page and flower position through “Back to Garden” or Escape; do not alter other flowers.
- **Deletion confirmation:** custom “Let this memory go?” dialog offers primary “Keep My Memory” and destructive “Delete Forever.” Never delete without explicit confirmation.
- **Deletion success:** close the journal, peacefully fade the flower, free its spot, preserve other memories, and retain deletion after refresh.
- **Demonstration:** use fictional memories and secret-free configuration in public materials.
- **Validation:** require 10–2,000 characters of memory text; accept one optional JPEG/PNG/WebP photo of at most 5 MB original upload size, optimized before local storage. Friendly errors preserve the draft.
- **Page cleanup:** free deleted memories' original spots without moving others. Only completely empty trailing pages may be removed.
- **Storage failure:** preserve available writing, do not misreport saving or deletion as successful, and give understandable feedback. Exact messages and retry handling are technical details.

## Acceptance Criteria

Source: `scope.md > What “Working” Looks Like`.

- First use shows a living, illustrated garden with a clear planting action and naturally integrated empty spots.
- Each page provides approximately 8–12 naturally arranged spots. An empty spot is selected automatically, the user can select another highlighted available spot, and occupied spots cannot be overwritten.
- Filling a page makes another page of the same scene available without preventing further memories. Users can navigate between pages and reopen the correct memory from each flower.
- Desktop and mobile retain an interactive planting area and legible controls; the journal uses two pages on desktop and one on mobile.
- Opening the journal gently reduces the background's prominence and presents writing, optional photo, and date controls.
- After draft autosave, refresh/reopen restores story, date, title, flower, theme, and the attached photo where supported. “Draft saved” is unobtrusive and reflects an actual successful save.
- Closing unfinished writing offers “Save for Later,” “Keep Writing,” and explicitly confirmed “Discard Draft.” No exit action silently removes the draft.
- A returning draft shows the agreed message with “Continue Writing” and “Not Now”; deferring it preserves it. Only one active draft exists per browser.
- AI analysis occurs only on explicit request after consent. Manual planting is available without sending the story for AI processing.
- Suggested title, emotional theme, and flower can all be changed; requesting suggestions does not rewrite the original memory.
- Every available flower type can be chosen regardless of emotional theme, and multiple memories can share a flower type without losing individual selection.
- Flower types have distinct silhouettes as well as colors and share a coherent illustrated style. The preferred collection is sunflower, lavender, rose, daisy, forget-me-not, and iris; a four-type fallback requires agreement on the subset if needed.
- An AI failure preserves all draft contents and offers “Try Again” and “Choose My Own Flower.” No analysis or retry occurs without the user's action.
- A failed final save keeps the journal open and draft intact, exposes retry, and triggers no completed bloom. Repeated clicks do not create duplicate memories.
- A successful final save retains the planted memory and clears its associated draft before starting the journal-close/bloom transition. Refresh after success restores the memory even if the animation was interrupted.
- Planting closes the journal, directs attention to the selected spot, and shows a seed drop, small sprout, growing stem, and bloom ending in the selected flower with a subtle sparkle or glow; the flower opens the saved memory.
- Desktop reading shows title/date/full original story on the left page, and flower illustration/theme/optional framed photo on the right; mobile presents a comfortable single-page scrollable version of the same journal.
- Reopening a memory preserves its original text exactly and requires no AI request.
- “Back to Garden” and Escape close the reading journal and restore the same garden page and flower position without modifying existing flowers. Keyboard navigation, accessible labels, and focus management support opening and closing.
- Refreshing or reopening in the same browser retains planted memories and their page/spot associations while site data remains available.
- Selecting deletion first opens the custom confirmation dialog with the agreed copy and safe primary action. “Keep My Memory” preserves the memory; only “Delete Forever” confirms removal.
- Successful deletion closes the journal, peacefully removes the corresponding flower, frees its original spot, leaves other flowers unchanged, and remains effective after refresh. Failed deletion is not displayed as successful removal.
- Only completely empty trailing pages are removed after deletion. Populated pages and all remaining flower positions are preserved.
- The system reduced-motion preference replaces seed-growing, journal-opening, parallax if present, and decorative movement with immediate or minimal transitions. Planting, reading, deletion, navigation, and draft recovery remain fully usable.
- Validate memory text at 10–2,000 characters and accept at most one JPEG, PNG, or WebP image of up to 5 MB original size. Optimize accepted photos before local saving; invalid input shows friendly feedback without losing the draft.
- *(storybook revision)* A first visit shows the closed book; Open My Garden leads into the live garden through a short, coherent transition with no visible jump; Skip works from the first frame; a returning visit enters the garden directly; Close My Garden returns to the cover and the introduction can be replayed.
- *(storybook revision)* Planting shows seed → sprout → young plant → bud → bloom with real stem growth, unfolding leaves and opening petals, ending in the selected flower type.
- *(storybook revision)* Switching among Classic, Photo Story and Scrapbook layouts preserves every field; the reopened memory uses its saved layout.
- *(storybook revision)* No sound plays before the user opts in; music can be muted at any time and the preference survives refresh.
- *(storybook revision)* The empty garden is beautiful and calm; a planted garden is visibly more colorful, and memory flowers stand out more than any scenery decoration.

## Product Decisions

- A slightly elevated three-quarter 2D garden with fixed planting spots achieves the miniature-world feeling without an explorable game world.
- A beautiful first-use clearing remains inviting before any memory exists.
- Minimal controls let the garden dominate the screen.
- Shared hand-painted art direction keeps the garden, journal, flowers, and controls visually coherent.
- Desktop uses a two-page journal; mobile uses one page for comfortable reading and writing.
- AI is optional, explicitly requested, and subject to consent; users retain authorship and can plant manually.
- A memory date can be selected or adjusted, and a photo is optional.
- One active local draft autosaves writing and planting details. Closing unfinished writing prompts save/continue/discard, and returning users can resume or defer the draft without losing it.
- Explicit confirmation protects draft discard. Planting successfully clears the associated draft; no draft history, cloud synchronization, or complex recovery is required.
- AI failures preserve the draft and offer explicit retry or manual selection without automatic resending.
- Final save success precedes the bloom. Save failures keep the journal open and draft intact, with retry and no duplicate memories from repeated clicks.
- Six distinct flower types provide symbolic variety; four are an acceptable fallback if necessary to preserve coherent asset quality, with the subset still to be agreed if that fallback is used.
- Emotional associations guide AI suggestions without restricting flower choice, labeling emotions good or bad, or assuming a single feeling per memory.
- Repeated flower types are allowed, with each planted memory individually selectable. Avoid overcrowding.
- Every flower uses the same four-stage growth sequence, ending in the chosen type. *(storybook revision: five stages, adding a bud before the bloom.)*
- *(storybook revision)* The product opens as a storybook; the opening and closing are short, skippable and remembered, never a barrier to the garden.
- *(storybook revision)* Three predefined journal layouts give personal expression without a page editor.
- *(storybook revision)* Music and sound are opt-in atmosphere, never required and never autoplayed.
- Approximately 8–12 fixed spots per scene maintain natural spacing. Automatic placement with an optional empty-spot choice keeps planting effortless; no drag-and-drop editor.
- Repeated garden pages provide room for more memories without an expanding world or additional environments. Establish reliable planting in one scene first.
- Deletion frees the memory's spot; occupied spots cannot be overwritten accidentally.
- Reading reuses the creation journal's physical-book design, with a two-page desktop layout and single-page mobile layout, to make revisiting feel intimate and nostalgic.
- Reopening a memory never requires AI and never changes its original story. “Back to Garden” and Escape return to the same garden page and flower position.
- Deletion is secondary and requires explicit custom confirmation with a safe primary option. A peaceful fade respects the memory without dramatizing its removal.
- Existing memories are viewable and deletable; editing, sharing, exporting, and advanced organization are outside the first version.
- No watering, flower death, daily maintenance, or complicated gardening mechanics.
- Visual polish and reliability take priority over additional features.
- Navigation remains minimal: logo, primary planting action, and simple page navigation or saved-memory access, without a required separate library or complicated menus.
- Text limits are 10–2,000 characters; one optional JPEG/PNG/WebP photo may be uploaded, up to 5 MB original size, with local optimization before saving.
- Only empty trailing pages are removed; deletion never rearranges other flowers.
- Reduced motion uses immediate/minimal transitions and retains the complete, beautiful, accessible experience without animation.
- The learner explicitly finalized the feature scope and approved moving to technical planning. Visuals and animation must inform the architecture and early build steps, not be postponed as decoration.

## What We're Building

The approved scope's one complete journey: create a memory, choose details manually or with AI, review, save, plant, watch it bloom, revisit, retain it locally, and delete it individually. Protect one active draft automatically and offer safe recovery from interrupted writing and AI/final-save failures. Include consistent illustrated assets, responsive layouts, respectful emotional tone, and reduced-motion support. The learner's capacity refinement uses lightweight copies of the same garden scene when its fixed spots fill; this must preserve the priority of a polished, reliable first scene.

## Deferred From the POC

Source: `scope.md > Later`.

Surprise rediscovery of an older memory waits until the core journey is complete and polished. Clicking flowers provides rediscovery in this version.

Editing existing memories, exporting, and advanced organization are also deferred by the learner during the PRD interview. Sharing remains outside this personal MVP, as established in scope.

*(storybook revision)* Also deferred: short video attachments (browser-local quota and recovery risk; photos only, with no placeholder video control); the full car-and-character arrival cinematic unless time remains after all core and P1 work; and atmosphere variations such as golden hour or evening.

## Non-Goals

Source: `scope.md > Explicitly Cut`.

No accounts, authentication, cloud memory database, cross-device sync, public profiles, social sharing, followers, community, analytics tracking, unnecessary collection, realistic 3D, or per-memory image generation. No complex encryption or infrastructure beyond what secure AI access requires. These do not serve the agreed small, personal garden experience. Deployment remains optional.

No drag-and-drop placement, watering requirements, flower death, daily maintenance, complicated gardening mechanics, infinitely expanding world, or additional garden environments. Garden pages reuse one scene.

No draft history, multiple simultaneous drafts, cloud synchronization, accounts, or complicated draft recovery mechanisms. One local active draft is sufficient for this version.

## Open Questions

### Product Decisions Finalized

No outstanding feature-scope approval is required. The learner finalized minimal navigation, memory/photo limits, stable page cleanup, and the system reduced-motion alternative. Carry these decisions into technical planning rather than reopening the product interview. A separate saved-memory library is not required to satisfy the agreed access requirement.

### Details for Technical Planning and Visual Refinement

- Exact font choices, final illustrated artwork, scene coordinates within the agreed 8–12 spots, debounce interval, and animation timings can be refined in `4-spec` without changing established product behavior.
- Six flower types remain the target. If asset feasibility requires the permitted four-type fallback, agree the subset with the learner at that point; it is not an automatic reduction.
- The journal's exact control arrangement, title/theme input presentation, loading indicators, and consent explanation should be made concrete while preserving the agreed interactions and optional AI processing.
- Specify date defaults, required planting metadata, validation counting and exact upload-size units, image resizing/compression, browser-storage failure handling, and deletion failure feedback consistently with the approved input and reliability requirements.
- Specify the lightweight page controls, spot-selection layout, automatic empty-spot selection order, and stable page identifiers. Only completely empty trailing pages may be removed; no existing flowers may be moved to close gaps.
- Exact implementation tools, browser storage design, secure AI integration, and asset-production approach belong to `4-spec`. No technical stack is chosen here.

## Review Focus and Feasibility

The scope's sketch is now a specific journey: the selected flower has a stable place, draft writing is protected, saving precedes the bloom, reading preserves the story, and deletion requires confirmation. These outcomes are observable and can guide implementation checks.

The first scene remains the priority. Garden pagination and active-draft protection add real work beyond illustration and animation polish. The curriculum's 2–4-hour target is a schedule risk, not a reason to silently cut agreed behavior or declare the experience complete without it. `4-spec` must assess the smallest feasible implementation and surface any necessary tradeoff before building.

The learner approved this product definition and requested `4-spec`. Markdown is canonical and the HTML is a planning companion, not a finalized application mockup. Technical planning must place the visual experience alongside persistence, draft protection, AI integration, and accessibility from the outset.
