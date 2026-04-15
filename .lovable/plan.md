

# Single-Brand Today View — Two-Column Layout with AI Assistant

## Summary

Replace the current `SingleBrandToday` component with a hero section + two-column layout featuring metric cards with sparklines, per-brand action items, and a functional AI chat panel.

## Changes

### 1. `src/routes/_app.index.tsx` — Full rewrite of `SingleBrandToday`

Replace the existing component (lines 24–188) with:

**Hero section** (dark band, same pattern as other pages):
- Two decorative accent circles using brand color at 18% and 9% opacity
- Eyebrow: `"{brand.name} — {brand.stage}"`
- Heading: `"Good morning."` (44px, 900 weight)
- 3 glassmorphic stat chips: content count, campaigns (hardcoded 0), stage badge pill

**Two-column grid** below hero: `grid-template-columns: 1fr 300px`

**Left column** contains:
- 4 metric cards in a `repeat(4, 1fr)` grid with inline SVG sparklines
  - Content (activity count, green sparkline)
  - Campaigns (0, amber sparkline)
  - SEO signals (intel count, green sparkline)
  - Stage (PRE/EXP text + 4-segment progress bar instead of sparkline)
- "Next actions" section with 2 per-brand action cards (hardcoded content per brand ID)

**Right column** — AI Assistant panel:
- Header with brand dot + "AI Assistant" label
- Chat area with 3 pre-populated static messages (AI/User/AI) using brand-specific content
- Input bar with pill container and send button
- On send: calls `generateContent` server function with brand canon as system prompt, renders response as new AI message
- Maintains local `useState` message array for the conversation

### 2. Per-brand static data

All action items and initial chat messages are defined as lookup objects keyed by brand ID within the component file. The initial AI message references the active brand name dynamically.

### 3. AI chat functionality

- `useState` for messages array, initialized with 3 decorative messages
- On submit: push user message, call `generateContent` with brand canon as system prompt and full conversation as context, push AI response
- Loading state: show a typing indicator bubble while awaiting response
- Uses existing `generateContent` from `src/utils/ai.functions.ts`

## Files touched

Only `src/routes/_app.index.tsx` — the `SingleBrandToday` function is replaced. `TodayPage` routing logic and `AllBrandsOverview` import unchanged.

No new files or dependencies needed.

