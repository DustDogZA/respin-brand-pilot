

# Remove All Placeholder/Dummy Data

## What's changing

The app currently has hardcoded fake data that simulates activity. This plan removes it all and replaces affected areas with clean empty states that guide the user to take real action.

## Dummy data identified

1. **`SEED_ACTIVITY`** in `src/data/activity.ts` — 10 fake activity log entries ("2h ago", "1d ago", etc.)
2. **`CAMPAIGN_CALENDAR`** in `src/data/activity.ts` — 6 fake campaign entries with hardcoded dates
3. **Hardcoded metrics** on the Today page — "12" content velocity, "4" active campaigns, "38" SEO keywords, "4" brands active
4. **Hardcoded priority cards** on the Today page — 3 fake recommended actions

## What stays (not placeholder)

- Brand definitions in `src/data/brands.ts` — real brand data (canons, accents, channels)
- Tool definitions in `src/data/tools.ts` — real tool configurations
- CRM intelligence metrics on the CRM page — real iGaming domain knowledge
- "Coming Soon" badges on SEO page — roadmap indicators, not fake data
- Integration list on Settings — real planned integrations

## Changes

### 1. `src/data/activity.ts`
- Remove `SEED_ACTIVITY` array contents (keep as empty array `[]`)
- Remove `CAMPAIGN_CALENDAR` array contents (keep as empty array `[]`)
- Keep the interfaces and `TYPE_LABELS` — they're used for real data later

### 2. `src/routes/_app.index.tsx` (Today page)
- Remove the 4 hardcoded `MetricCard` components with fake numbers
- Remove the 3 hardcoded `PriorityCard` components
- Replace metrics section with a subtle "Connect integrations to see live data" prompt
- Replace priority actions with an empty state: "Your recommended actions will appear here as you use the platform"
- Activity feed: show empty state "No activity yet — generate your first piece of content"
- Campaign calendar: show empty state "No campaigns scheduled"

### 3. `src/routes/_app.campaigns.tsx`
- The table will naturally be empty since `CAMPAIGN_CALENDAR` is now `[]`
- Add an empty state message: "No campaigns yet. Create your first campaign to get started."

### 4. `src/routes/_app.reporting.tsx`
- Already handles empty state (line 70: "No matching activity")
- Will naturally show empty since `SEED_ACTIVITY` is now `[]`

### 5. `src/components/MetricCard.tsx` and `src/components/PriorityCard.tsx`
- Keep the components — they'll be used when real data is connected
- No changes needed to the components themselves

## Result

Every screen starts clean. The app feels honest — no fake numbers, no simulated history. Empty states guide the user toward real usage (Content Studio, CRM tools, SEO tools) which are the functional parts of the app.

