# Hero Matchup — Design Direction

## Three possible approaches

### Theme Name: Ink & Impact
**Very Brief Intro:** A neo-pulp comic archive with editorial restraint: bold red signal bars, deep ink panels, paper-toned surfaces, and oversized display type. It feels like a field guide for discovering the right hero, not a generic superhero dashboard.
**Probability:** 0.04

### Theme Name: Orbit Command
**Very Brief Intro:** A clean, midnight command deck with electric blue telemetry, crisp data readouts, and cinematic depth. It would position the app as a tactical hero intelligence console.
**Probability:** 0.08

### Theme Name: Saturday Splash
**Very Brief Intro:** A bright, playful comic-book spread with primary-color bursts, sticker-like cards, and hand-drawn energy. It would feel approachable and game-like for casual quiz takers.
**Probability:** 0.06

## Chosen direction: Ink & Impact

### Design Movement
Neo-pulp editorial meets Swiss poster design: dramatic scale, disciplined alignment, thick graphic rules, and print-inspired imperfection.

### Core Principles
1. **Make discovery feel like a cover story.** Every major action starts with a declarative headline and a strong visual anchor.
2. **Use structure as drama.** Split panes, hard rules, offset blocks, and numbered labels create momentum without relying on decorative gradients.
3. **Treat data like collectible evidence.** Stats are rendered as compact readouts, bars, and badges with clear hierarchy.
4. **Keep the interface human.** The quiz speaks in direct, witty prompts and gives users a clear sense of progress.

### Color Philosophy
The signature red is a signal color: urgent, physical, and unmistakably comic-book. Ink navy supplies authority and lets red lead without turning the page into a neon theme. Warm paper and muted stone surfaces keep the experience tactile, while a small electric-blue accent is reserved for comparison wins and active states.

Signature palette: signal red `#E52B2B`, ink navy `#101A2D`, paper `#F2EBDD`, stone `#D9D2C5`, electric blue `#3B82F6`, mustard `#E2B93B`.

### Layout Paradigm
A persistent left rail anchors the experience like the spine of a field manual. The main canvas uses an asymmetric two-column composition: large narrative copy and compact utility controls on the left, hero evidence and comparisons on the right. On mobile, the rail becomes a top strip and the split collapses into a purposeful vertical sequence.

### Signature Elements
- **Red issue bars:** angled or rectangular signal-red blocks that mark section starts and active navigation.
- **Archive stamps:** small mono labels such as `CASE 001`, `LIVE DATA`, and `MATCH INDEX` that make live API data feel collected.
- **Halftone field:** a subtle dot pattern and paper grain behind hero moments, used sparingly so it reads as print texture rather than noise.

### Interaction Philosophy
Every interaction should feel like pulling a card from a case file: tactile, obvious, and quick. Search results slide into place, selected heroes receive an inked outline, and buttons compress on press. The interface always explains what happens next instead of hiding actions behind novelty.

### Animation
Use short, high-confidence motion: 160–220ms ease-out for hover and press states, 240ms for card entrances, and 300ms for swapping comparison slots. Use transform and opacity only. Search results stagger by 40ms; quiz progress fills with a single snap; the final match card gets one restrained scale-and-settle moment. Respect `prefers-reduced-motion` by removing entrance offsets and keeping state changes instantaneous.

### Typography System
Use **Bangers** for all display headlines, section markers, and the word “MATCH” when it needs poster-scale impact. Use **Space Grotesk** for body copy, labels, and readable UI. Use **IBM Plex Mono** for stat numbers, metadata, and API provenance. Headlines are uppercase with tight line height; labels are uppercase with generous tracking; body copy stays sentence case with a 1.5 line height.

### Brand Essence
**Hero Matchup is a live hero field guide for curious fans who want to find, compare, and discover their closest super-powered match without the clutter of a fandom wiki.**

Personality: **decisive, curious, kinetic**.

### Brand Voice
Headlines are short and declarative. CTAs sound like field commands, not generic product marketing. Microcopy is witty but never distracting.

Example lines:
- “Pick a side. Then pick yourself.”
- “Your stats are talking. We’re listening.”

### Wordmark & Logo
Use a compact shield-and-lightning symbol with a split center line: one half signal red, one half ink navy, no text inside the mark. Pair it with a custom stacked wordmark where `HERO` sits above `MATCHUP` with a red issue bar cutting through the baseline. The generated icon should be the shield mark only so it stays legible as a favicon.

### Signature Brand Color
**Signal Red `#E52B2B`** — the color of a decisive choice, an issue cover, and the moment the match result locks in.
