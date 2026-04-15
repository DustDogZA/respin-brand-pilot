

# respin.hub — Production Architecture Build

## Overview

Transform respin.hub from a client-side-only AI tool launcher into a full-stack marketing operating system with a real database, authentication, campaign lifecycle management, task ownership, and role-based views — all within the existing premium UI shell.

**Prerequisite:** Enable Lovable Cloud database before implementation begins.

---

## Phase 1: Database Schema (Migrations)

### Core Tables

**`brands`** — migrates static BRANDS data
- id, name, short, url, stage, mode, character, tagline, accent, channels[], payment, framework, canon, `is_experiment` (true for CHUR), created_at

**`profiles`** — extends auth.users
- id (FK auth.users), full_name, avatar_url, created_at
- Auto-created via DB trigger on signup

**`user_roles`** — separate table per security rules
- user_id (FK auth.users), role (enum: admin, head_of_marketing, brand_manager, content_lead, crm_lead, seo_lead, contributor, approver)

**`campaigns`** — the central entity everything connects to
- id, brand_id, name, objective, audience, offer_angle, channels[], content_pillars[], seo_targets[], crm_segments[], owner_id, status (enum: strategy / planning / production / review / published / learning), start_date, end_date, created_at, updated_at

**`tasks`** — linked to campaigns
- id, campaign_id, brand_id, title, description, assignee_id, priority (critical/high/medium/low), status (todo/in_progress/in_review/blocked/done), blocker_note, due_date, workflow_type (content/crm/seo/general), created_at, updated_at

**`content_briefs`** — content workflow pipeline
- id, campaign_id, brand_id, task_id, title, content_type, platform, brief_text, draft_text, status (idea → briefed → drafting → in_review → approved → scheduled → published → measured), author_id, reviewer_id

**`crm_journeys`** — CRM workflow pipeline
- id, campaign_id, brand_id, task_id, name, segment, journey_type, message_draft, status (segment_defined → journey_mapped → message_drafted → in_review → approved → sending → sent → measured), owner_id

**`seo_briefs`** — SEO workflow pipeline
- id, campaign_id, brand_id, task_id, keyword_cluster, target_page, brief_text, status (research → briefed → optimizing → in_review → published → tracking), owner_id

**`approvals`** — cross-workflow review system
- id, approvable_type (content_brief / crm_journey / campaign), approvable_id, reviewer_id, status (pending / approved / rejected / changes_requested), comment

**`ai_outputs`** — replaces localStorage activity log
- id, brand_id, campaign_id (nullable), task_id (nullable), tool_name, output_type, content, preview, created_by, created_at

### RLS
- All authenticated users can SELECT (internal team tool)
- Write policies by role via `has_role()` security definer function
- Admins/head_of_marketing write everything; specialists write within their workflow type

### Seed Data (migration)
- 2–3 campaigns per brand at different lifecycle stages
- 5–8 tasks per brand with varied statuses, priorities, assignees
- Content briefs, CRM journeys, SEO briefs linked to campaigns
- 3–4 team member profiles with role assignments
- CHUR.BET campaigns marked as experiments

---

## Phase 2: Authentication

- `src/integrations/supabase/client.ts` — browser client
- `src/integrations/supabase/client.server.ts` — admin client (service role)
- `src/integrations/supabase/auth-middleware.ts` — `requireSupabaseAuth` middleware
- `src/routes/login.tsx` — email/password login page
- `src/routes/_authenticated.tsx` — pathless layout guard via `beforeLoad`
- All `_app.*` routes move under `_authenticated._app.*` prefix
- Default role on signup: `contributor`

---

## Phase 3: Server Functions (Data Layer)

All use `requireSupabaseAuth` middleware. Replace localStorage with DB operations.

- **`campaigns.functions.ts`** — listCampaigns, getCampaign (with tasks/briefs/approvals), createCampaign, updateCampaignStatus
- **`tasks.functions.ts`** — listTasks (filterable by brand/campaign/assignee/status), createTask, updateTask, updateTaskStatus
- **`briefs.functions.ts`** — CRUD for content_briefs, crm_journeys, seo_briefs
- **`approvals.functions.ts`** — listPendingApprovals, submitApproval
- **`ai-outputs.functions.ts`** — saveAiOutput, listAiOutputs (replaces ActivityLogContext)
- **`team.functions.ts`** — listTeamMembers, getUserRole

---

## Phase 4: Page Updates (Inside Existing UI Shell)

### Today (`_app.index.tsx`)
- **Portfolio view**: Real campaign counts, blocked tasks, team workload from DB
- **Brand view**: Next actions from real tasks (highest priority, nearest due date). Metrics from real campaign/task counts. AI Assistant unchanged.

### Campaigns (`_app.campaigns.tsx`) — Major expansion
- Campaign list with filters (brand, status, owner)
- Campaign detail: full lifecycle tracker with linked tasks, briefs, approvals
- Create campaign slide-out panel
- Status progression visualization (strategy → learning)

### Content (`_app.content.tsx`)
- Keep AI tool launcher
- Add content brief pipeline (list by status, link to campaigns)
- Link AI outputs to briefs

### CRM (`_app.crm.tsx`)
- Keep CRM tools
- Add CRM journey pipeline (list by status, linked to campaigns)

### SEO (`_app.seo.tsx`)
- Keep intel tools
- Add SEO brief pipeline (keyword clusters, optimization tasks)

### Reporting (`_app.reporting.tsx`)
- DB-backed AI output feed (replaces localStorage)
- Campaign performance summary (status distribution, completion rates)

### Settings (`_app.settings.tsx`)
- Team management section (list members, assign roles)
- Keep integrations section

### Navigation (`TopNav.tsx`)
- Active campaign count badge
- Pending approvals indicator for reviewers

---

## Phase 5: CHUR.BET Experiment Layer

- `is_experiment` flag on brands table separates CHUR from core brands
- Portfolio view toggle: "Core brands" vs "Experiments"
- CHUR campaigns can link to other brand campaigns via `linked_campaign_id`
- Experiment-specific status labels

---

## Phase 6: Cross-Workflow Connections

- Content/CRM/SEO pages show campaign context header when items are linked
- Campaign detail aggregates tasks across all workflow types
- "Today" pulls most urgent items across all workflows for active brand
- Reporting shows cross-brand throughput

---

## Technical Details

### Files Created
| File | Purpose |
|------|---------|
| ~10 migration files | Schema, RLS, seed data |
| `src/integrations/supabase/` (3 files) | Client, admin, auth middleware |
| `src/routes/login.tsx` | Auth page |
| `src/routes/_authenticated.tsx` | Route guard |
| `src/utils/campaigns.functions.ts` | Campaign CRUD |
| `src/utils/tasks.functions.ts` | Task CRUD |
| `src/utils/briefs.functions.ts` | Brief/journey CRUD |
| `src/utils/approvals.functions.ts` | Approval system |
| `src/utils/ai-outputs.functions.ts` | DB-backed AI log |
| `src/utils/team.functions.ts` | Team operations |

### Files Modified
| File | Change |
|------|--------|
| All `_app.*` route files | DB-backed data, pipeline views |
| `TopNav.tsx` | Count badges |
| `AppLayout.tsx` | Auth wrapper |
| `BrandContext.tsx` | DB-backed brands |
| `AllBrandsOverview.tsx` | Real data |
| `AiAssistant.tsx` | Save to DB instead of localStorage |

### No Changes To
- Visual design system / CSS
- Component styling
- Navigation structure
- Responsive behavior
- AI generation logic (prompts, server functions)

No new npm dependencies required.

