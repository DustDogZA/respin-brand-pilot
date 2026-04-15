

# Shared Activity Log — Plan

## Summary

Create a React context + localStorage-backed activity log. Every successful AI generation writes an entry. The Today dashboard and Reporting page consume it live.

## New Files

### 1. `src/context/ActivityLogContext.tsx`

React context provider with:
- **State**: `ActivityLogEntry[]` stored in localStorage under key `respin_activity_log`
- **Entry shape**: `{ id: string, brand: string, toolName: string, type: 'acq'|'ret'|'crm'|'intel'|'content'|'lore', outputPreview: string, timestamp: string, fullOutput: string }`
- **`addEntry(entry)`**: prepends entry, caps at 50 (removes oldest), writes to localStorage
- **`entries`**: the current log array
- Hydration-safe: reads localStorage only on mount (client-side), not during SSR
- Generate unique IDs with `crypto.randomUUID()`

### 2. Wire provider into `src/routes/_app.tsx`

Wrap the layout's children with `<ActivityLogProvider>`.

## Modified Files

### 3. `src/routes/_app.content.tsx`

After successful generation (`result.text` is non-empty, no error):
```ts
addEntry({ brand: brand.short, toolName: selectedTool.name, type: selectedTool.acq ? 'acq' : 'content', ... })
```
Import and use `useActivityLog()` from context.

### 4. `src/routes/_app.crm.tsx`

Same pattern, `type: 'crm'`.

### 5. `src/routes/_app.seo.tsx`

Same pattern, `type: 'intel'`.

### 6. `src/routes/_app.index.tsx` (Today dashboard)

- Replace the empty metrics card with 4 `MetricCard` components:
  - Content Velocity = `entries.length`
  - Active Campaigns = entries where type is `acq` or `ret`
  - Brands Active = `4` (hardcoded)
  - SEO Keywords = entries where type is `intel`
- Replace priority actions empty state with 2 most recent entries as cards showing brand accent dot, brand name, tool name, preview text, and "View in Reporting" link
- Recent Activity section: show last 6 entries from the log instead of `SEED_ACTIVITY`

### 7. `src/routes/_app.reporting.tsx`

- Replace `SEED_ACTIVITY` usage with `useActivityLog().entries`
- Filter tabs: All / Content / CRM / SEO (Content = `acq|ret|lore|content`, CRM = `crm`, SEO = `intel`)
- Each entry shows: brand name in accent color, type badge, tool name, output preview, relative timestamp
- "Copy output" button per entry that copies `fullOutput`
- Empty state: "No activity yet — generate your first piece of content"

### 8. `src/components/ActivityItem.tsx`

Update to accept the new `ActivityLogEntry` shape (or create a new `ReportingActivityItem` component). Display tool name, type badge, relative timestamp (computed from ISO string), and copy button.

## Technical Details

- **Relative time**: Simple helper — computes "just now", "X minutes ago", "X hours ago", "X days ago" from ISO timestamp
- **Type mapping for tools**: Content tools use `acq` if `tool.acq === true`, else `content`. CRM tools → `crm`. SEO tools → `intel`.
- **SSR safety**: localStorage reads wrapped in `typeof window !== 'undefined'` check; initial state is `[]` during SSR

