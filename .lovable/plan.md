

# Global Design System Update — Light Theme

## Summary

Switch the entire app from a dark navy theme to a warm light theme. Changes are purely visual — no functionality, routing, or logic changes. The core work is updating CSS variables, removing the `dark` class, and adjusting component-level styles.

## Changes

### 1. `src/styles.css` — New color system and radii

Replace all CSS custom property values in `:root` and `.dark` with the new light palette:

| Token | New Value |
|-------|-----------|
| `--background` | `#f0ede6` |
| `--foreground` | `#0d1b2a` |
| `--card` | `#ffffff` |
| `--card-foreground` | `#0d1b2a` |
| `--popover` | `#ffffff` |
| `--popover-foreground` | `#0d1b2a` |
| `--primary` | `#0d1b2a` |
| `--primary-foreground` | `#f5f3ee` |
| `--secondary` | `#f0ede6` |
| `--secondary-foreground` | `#0d1b2a` |
| `--muted` | `#f0ede6` |
| `--muted-foreground` | `#9b9690` |
| `--accent` | `#f0ede6` |
| `--accent-foreground` | `#0d1b2a` |
| `--destructive` | `#e8994d` |
| `--destructive-foreground` | `#ffffff` |
| `--border` | `#e0ddd5` |
| `--input` | `#e0ddd5` |
| `--ring` | `#0d1b2a` |
| `--sidebar` | `#ffffff` |
| `--sidebar-foreground` | `#0d1b2a` |
| `--sidebar-primary` | `#0d1b2a` |
| `--sidebar-primary-foreground` | `#f5f3ee` |
| `--sidebar-accent` | `#f0ede6` |
| `--sidebar-accent-foreground` | `#0d1b2a` |
| `--sidebar-border` | `#e0ddd5` |
| `--sidebar-ring` | `#0d1b2a` |
| Brand colors unchanged |

Set `--radius: 1rem` (16px base for large cards).

Remove the duplicate `.dark { }` block (or make it identical to `:root` since we're light-only now).

Update Google Fonts link to include weights 400, 500, 600, 700, 800, 900.

### 2. `src/routes/__root.tsx`

- Remove `className="dark"` from `<html>` tag
- Update Google Fonts URL to `Inter:wght@400;500;600;700;800;900`

### 3. `src/components/ui/card.tsx`

- Change base class from `rounded-xl border bg-card text-card-foreground shadow` to `rounded-[16px] border-[0.5px] border-[#e0ddd5] bg-card text-card-foreground` (no shadow)

### 4. `src/components/ui/button.tsx`

- Remove all `shadow` and `shadow-sm` classes from variants
- Update `rounded-md` to `rounded-full` for pill shape on default/sm/lg sizes

### 5. `src/components/ui/badge.tsx`

- Change `rounded-md` to `rounded-full` for pill badges
- Remove `shadow` from default variant

### 6. `src/components/MetricCard.tsx`

- Update to use new typography: value text `text-[32px] font-black tracking-[-0.04em]`, label `text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground`
- Remove `backdrop-blur-sm`

### 7. `src/components/ToolCard.tsx`

- Adjust border and hover styles to use `border-[0.5px] border-[#e0ddd5]`
- Update icon background to `rounded-[10px]`

### 8. `src/components/PriorityCard.tsx`

- Remove translucent card classes, use standard card styling

### 9. `src/components/AppSidebar.tsx`

- Sidebar now white background (via CSS vars), no visual changes needed in code

### 10. `src/components/AppLayout.tsx`

- Update header border to `border-[0.5px] border-[#e0ddd5]`

### 11. `src/routes/_app.index.tsx`

- Update heading typography: `text-[30px] font-extrabold tracking-[-0.03em]`
- Section labels: `text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground`

### 12. All route pages (`_app.content.tsx`, `_app.crm.tsx`, `_app.seo.tsx`, `_app.brands.tsx`, `_app.campaigns.tsx`, `_app.reporting.tsx`, `_app.settings.tsx`)

- Update page headings to use `font-extrabold tracking-[-0.03em]`
- Update section labels to use eyebrow style
- Remove any translucent card references (`bg-card/40`, `bg-card/60`) → use plain `bg-card`
- Remove any `shadow` usage

### 13. `src/components/BrandSelector.tsx`

- Update select trigger to `rounded-full` for pill shape

## Files touched (13)

`src/styles.css`, `src/routes/__root.tsx`, `src/components/ui/card.tsx`, `src/components/ui/button.tsx`, `src/components/ui/badge.tsx`, `src/components/MetricCard.tsx`, `src/components/ToolCard.tsx`, `src/components/PriorityCard.tsx`, `src/components/AppLayout.tsx`, `src/components/BrandSelector.tsx`, `src/routes/_app.index.tsx`, and all `_app.*.tsx` route files for heading/label typography.

No new dependencies. No logic or routing changes.

