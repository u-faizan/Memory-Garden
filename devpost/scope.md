---
doc: scope
status: approved
---

# MemoryGarden — Where Memories Bloom

A personal, illustrated garden where people turn meaningful memories into flowers and enjoy rediscovering their stories.

## The Unique Kernel

A memory becomes a flower through a satisfying seed-to-bloom animation, then remains part of a garden the user can explore. The garden itself is the main experience: an inviting visual collection of a person's journey, with each flower opening its original story.

## Who It's For

A university student who wants to preserve an evening with friends, their first day at university, or a personal achievement. Today these moments get buried in phone galleries, scattered across notes, or posted on platforms oriented toward sharing. MemoryGarden gives them an enjoyable place to save and revisit memories for themselves.

## The Core Loop

Enter the garden → choose “Plant a Memory” → write a story, optionally attaching a photo → explicitly request AI suggestions or choose details manually → review and change the title, emotional theme, and flower → plant → watch it bloom → click the flower to revisit the story.

Return to add another moment or explore the flowers already growing. Original memory text stays intact unless the user edits it; AI suggestions never override the user's choices.

## Inspiration & Identity

A cozy, magical, peaceful miniature world with the feeling of a beautifully illustrated storybook garden. Soft pastels, warm sunlight, consistent flower illustrations, gently swaying plants, subtle butterflies, thoughtful typography, and restrained micro-interactions create a welcoming atmosphere. The journal should feel personal and inviting.

Happy, bittersweet, and difficult memories all belong here; the experience must not force a positive interpretation. Visual cohesion, the bloom animation, and a beautiful reading experience are core quality requirements. Desktop and mobile should both feel considered. No specific reference products or URLs have been supplied.

The interactive garden and seed-to-flower animation are required product experiences. The garden, flowers, journal, typography, animations, and interface elements must belong to the same illustrated storybook world. Prioritize a polished, reliable journey over adding features.

## Why This Matters to the Learner

Personal learning goals are maintained in the private, Git-ignored learner profile. A small architecture should support an exceptionally polished core experience.

## What “Working” Looks Like

The primary success scenario is a roughly one-minute demonstration:

1. **0–10 seconds:** Open a cohesive, gently animated garden with a clear “Plant a Memory” action.
2. **10–25 seconds:** Enter a fictional story about an evening with university friends in the journal; a photo is optional.
3. **25–35 seconds:** Request AI suggestions, then review an editable title, emotional theme, and flower. “An Evening to Remember,” friendship and joy, and lavender illustrate the intended result; exact wording is not fixed.
4. **35–45 seconds:** Plant the memory. The journal closes gently, attention returns to the garden, and a seed settles, sprouts, and blossoms into the chosen flower. This is the signature moment.
5. **45–60 seconds:** Click the flower to read its title, original story, date, emotional theme, and optional photo. Close the card and see it remain alongside other memories.

The saved garden survives refresh and reopening in the same browser while the site's data remains available. Manual planting and individual deletion also work. A short demo video and public GitHub repository are required for the hackathon; deployment is optional. Use fictional memories and secret-free configuration in public materials.

## The POC Boundary

- One complete journey for an individual user, with a simple illustrated 2D garden and a small, carefully designed flower library. No image generation per memory.
- Journal-style capture and reading, optional photo attachment, editable planting details, a satisfying bloom animation, and individual memory deletion.
- Browser-local persistence, including storage appropriate for photos, such as IndexedDB. Clearing site data removes the saved garden; accounts and cross-device recovery are outside this version.
- External AI suggestions only after an explicit request and a brief, understandable consent explanation before the first analysis. Never send memory text automatically while typing. Manual title, emotional theme, and flower selection must be available without AI.
- AI access must keep credentials out of frontend code. The technical specification will choose the simplest secure integration and explain the external service's role without claiming all processing stays on-device.
- Responsive desktop and mobile layouts, consistent assets, gentle ambient movement, and reliable save/revisit behavior. Keep feature breadth small to protect these qualities.

The curriculum targets 2–4 hours of active work. Asset preparation and visual refinement are the main schedule risks; the technical plan must assess feasibility against this quality bar before implementation.

## Later

- Surprise rediscovery of an older memory, if the core experience is complete and polished. Revisit memories by clicking flowers in the MVP.

## Explicitly Cut

- **Accounts, authentication, cloud memory storage, and cross-device sync:** same-browser persistence proves the core idea with less infrastructure.
- **Public profiles, social sharing, followers, and community features:** the first experience is personal reflection in a private garden.
- **Analytics tracking and unnecessary data collection:** they do not support the memory-to-flower journey.
- **3D environments and per-memory image generation:** curated 2D assets keep the visual style coherent and the build manageable.
- **Complex encryption or additional backend infrastructure beyond secure AI access:** outside this browser-local proof of concept; make its privacy boundaries clear.
