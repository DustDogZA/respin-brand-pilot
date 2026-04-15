

# Refined Campaign Workflow — Unified Campaign Overview

## Summary

Transform the campaigns page from a static table into a full campaign management system where every campaign has a detail page showing objective, audience, offer, channels, owners, dates, status, blockers, and results — with Content briefs, CRM journeys, and SEO briefs all rolling up as tabs under the campaign. Add task dependencies and approval/handoff tracking.

## Database Changes (Migration)

### Add `depends_on_task_id` to tasks table
- New nullable UUID column on `tasks` referencing another task's `id`
- Enables dependency chains (e.g., "SEO brief must be done before content draft")

### Add `handoff_status` enum and column to tasks
- New enum: `not_started`, `ready_for_handoff`, `handed_off`, `accepted`
- New column `handoff_status` on `tasks` table, default `not_started`

### Seed realistic dependency data
- Update existing seed tasks to have `depends_on_task_id` links (e.g., content brief depends on SEO keyword research)

## Server Functions (`data.functions.ts`)

### New: `updateCampaign`
- Update campaign fields (objective, audience, offer_angle, channels, dates, status)

### New: `updateTask`
- Update full task (title, description, priority, status, due_date, blocker_note, handoff_status, depends_on_task_id)

### New: `createApproval` / `updateApproval`
- Insert approval record for any approvable (content_brief, crm_journey, campaign)
- Update approval status with comment

### Enhance `getCampaign`
- Also fetch owner profile (join profiles on owner_id)
- Fetch approvals for all linked content_briefs and crm_journeys (not just campaign-level)

## Route Changes

### New: `src/routes/_app.campaigns.$campaignId.tsx` — Campaign Detail Page

Single overview page with:

**Header section:**
- Campaign name, brand dot, status badge with progression stepper (strategy → planning → production → review → published → learning)
- Owner name, start/end dates, action to advance status

**Strategy card:**
- Objective, audience, offer/angle, channel mix, content pillars, CRM segments, SEO targets
- Inline-editable or read-only based on role

**Tabs: Tasks | Content | CRM | SEO | Approvals**

- **Tasks tab:** All tasks grouped by workflow_type (content/crm/seo/general), showing priority, assignee, status, due date, blocker notes, dependency arrows (shows "Blocked by: [task title]" when depends_on_task_id is set and that task is not done), handoff status badge
- **Content tab:** Content briefs linked to this campaign with their pipeline status (idea → measured)
- **CRM tab:** CRM journeys linked to this campaign with their pipeline status
- **SEO tab:** SEO briefs linked to this campaign with their pipeline status
- **Approvals tab:** All approval requests across campaign + linked briefs/journeys, with approve/reject/request changes actions

### Updated: `src/routes/_app.campaigns.tsx` — Campaign List

- Replace static CAMPAIGN_CALENDAR with real DB data via `listCampaigns`
- Each row is a `<Link>` to `/campaigns/$campaignId`
- Add "Create Campaign" button (slide-out form)
- Filter by brand (uses BrandContext), status
- Show task completion progress per campaign (X/Y tasks done)

### Updated: `src/routes/_app.content.tsx`
- Add a "Campaign Context" banner at top when content briefs exist for the active brand
- Link to campaign detail page

### Updated: `src/routes/_app.crm.tsx`
- Same campaign context banner pattern

## New Components

### `CampaignStatusStepper`
- Horizontal stepper showing campaign lifecycle: strategy → planning → production → review → published → learning
- Current step highlighted, past steps checked

### `TaskDependencyBadge`
- Shows "Blocked by: [task]" or "Ready" based on dependency status

### `ApprovalActions`
- Approve / Reject / Request Changes buttons with comment field

### `CampaignCreateForm`
- Sheet/dialog with fields: name, brand, objective, audience, offer_angle, channels, dates

## Technical Details

### Files Created
| File | Purpose |
|------|---------|
| `src/routes/_app.campaigns.$campaignId.tsx` | Campaign detail page |
| `src/components/CampaignStatusStepper.tsx` | Lifecycle stepper |
| `src/components/CampaignCreateForm.tsx` | Create campaign form |
| Migration file | `depends_on_task_id`, `handoff_status` |

### Files Modified
| File | Change |
|------|--------|
| `src/routes/_app.campaigns.tsx` | DB-backed list, links to detail, create button |
| `src/utils/data.functions.ts` | New server fns: updateCampaign, updateTask, createApproval, updateApproval |
| `src/routes/_app.content.tsx` | Campaign context banner |
| `src/routes/_app.crm.tsx` | Campaign context banner |

### No Changes To
- Visual design system, sidebar, nav structure
- AI tools, prompts, generation logic
- Login/auth flow

