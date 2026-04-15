

# Two Small Fixes

## 1. Settings page — Add "Manage brand canons" link

In `src/routes/_app.settings.tsx`, replace the placeholder text in the Preferences card (line 63-65) with a link to `/brands`:

- Import `Link` from `@tanstack/react-router`
- Replace the empty-state paragraph with a small styled block containing:
  - Link text: **"Manage brand canons →"**
  - Description: "Edit character canons, brand voice, and campaign frameworks for each brand."
  - Styled as a subtle text link with muted description, consistent with the integration items above

## 2. Update copyright year

Three changes from 2025 → 2026:

| File | Line | Change |
|------|------|--------|
| `src/components/AppSidebar.tsx` | 96 | `Respin © 2025` → `Respin © 2026` |
| `src/data/tools.ts` | 105 | Placeholder text `"…winning in 2025…"` → `"…winning in 2026…"` |

No other instances found.

