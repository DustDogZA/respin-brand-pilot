

# Remove Dummy Content — AI Assistant, Sparklines, and Placeholder Data

## Summary

Strip out all decorative/placeholder content from the single-brand Today view: the AI Assistant panel, sparkline charts, fake metric sub-labels, and hardcoded stat values. Convert the two-column layout to a single full-width column. Also clean up hardcoded stats in the All Brands overview.

## Changes

### `src/routes/_app.index.tsx`

1. **Remove the AI Assistant panel entirely** — delete the right column (lines 229–282), the `INITIAL_MESSAGES` data object, the `generateContent` import, and all chat-related state (`messages`, `input`, `loading`, `sendMessage`).

2. **Remove the `Sparkline` component** (lines 69–75) and all `<Sparkline>` usages in metric cards.

3. **Remove fake metric sub-labels** — delete the "+N this week", "Launching soon", "Opportunities" lines from each metric card.

4. **Remove the Campaigns metric card** (hardcoded `0`) and the SEO signals metric card (no real data backing it). Keep only Content count (from activity log) and Stage indicator — these have real data behind them.

5. **Convert layout from two-column to single column** — remove `grid grid-cols-1 md:grid-cols-[1fr_320px]` and the border-right divider. The left column content fills full width.

6. **Clean up stat chips in the hero** — remove the "0 campaigns active" chip (hardcoded). Keep "pieces generated" (real data) and the stage badge.

### `src/components/AllBrandsOverview.tsx`

7. **Remove hardcoded stats** — the "3 actions needed" chip uses a hardcoded number. Remove it. Keep "4 brands active" and "pieces this week" which derive from real data.

### Cleanup

8. Remove unused `generateContent` import from `_app.index.tsx` (no longer needed after AI panel removal).

## Files touched

- `src/routes/_app.index.tsx`
- `src/components/AllBrandsOverview.tsx`

No routing, logic, or dependency changes.

