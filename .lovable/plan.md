

# respin.hub — Production Rebuild Plan

## Design System

**Dark-mode-first** using the Respin brand palette:
- Background: `#0d1b2a` (navy) / `#1e2a38` (charcoal surfaces)
- Text: `#f5f3ee` (chalk) / muted variants
- Primary accent: `#6b8f71` (sage green from Respin branding)
- Brand accents per-brand (gold, crimson, blue, sage)
- Typography: Inter for body, system font stack for headings with tight tracking

Premium, calm aesthetic — Apple HIG-inspired with generous whitespace, subtle borders, and progressive disclosure. No casino visuals, no neon, no dashboard clutter.

## Information Architecture (Sidebar Navigation)

1. **Today** — Priority-first home screen: key signals, recommended next actions, content velocity, brand health at a glance
2. **Campaigns** — Campaign calendar, active campaigns across brands, timeline view
3. **Content** — Content Studio (all campaign + community tools), generation history, drafts
4. **SEO** — Ahrefs intelligence tools, keyword tracking, competitor intel, SERP snapshots, AI visibility
5. **CRM** — Segment builder, lifecycle mapper, bonus designer, retention calendar, CRM metrics dashboard
6. **Brands** — Brand profiles, canon editor, channel config, brand switching context
7. **Reporting** — Activity feed, cross-brand output log (future: GA4, analytics)
8. **Settings** — Integrations config, user preferences

## Phase 1: Foundation (This Implementation)

### App Shell & Navigation
- Collapsible sidebar with icon-only mini mode using shadcn Sidebar
- Brand context selector in sidebar header (switch active brand globally)
- Each nav item as a separate TanStack route for proper SSR/SEO
- Responsive layout with mobile support

### Design System Setup
- Custom dark theme in Tailwind CSS variables
- Reusable card, tool-card, metric-card, and output-panel components
- Consistent spacing, typography scale, and border treatments
- Brand-aware accent color system that adapts per selected brand

### Today (Home Screen)
- "Good morning" greeting with today's date
- Priority action cards: what to do next across brands
- Quick stats: content velocity, active campaigns, key metrics
- Recent activity timeline (replaces the marquee ticker)
- Campaign calendar summary (next 2 weeks)

### Content Studio (`/content`)
- Tool grid with campaign tools and community tools (adapts per brand mode)
- Tool detail view with form fields and AI generation
- Output panel with markdown rendering and copy functionality
- Generation history sidebar

### SEO Intelligence (`/seo`)
- Ahrefs tool grid: Keyword Compass, Competitor Intel, SERP Snapshot, AI Visibility
- Same tool → form → generate → output pattern
- Deferred integrations shown with "Coming Soon" badges (GSC, GA4, Site Health)

### CRM & Retention (`/crm`)
- CRM knowledge metrics panel (FTD windows, churn signals, etc.)
- Tool grid: Segment Builder, Lifecycle Mapper, Bonus Designer, Retention Calendar
- Cross-link hint to Content Studio for executing CRM strategies

### Brands (`/brands`)
- Brand cards with all metadata (stage, channels, payment, tagline)
- Canon viewer/editor per brand
- Brand detail page with full profile

### Campaigns (`/campaigns`)
- Campaign calendar table (portfolio at a glance)
- Color-coded by activity type (acquisition, retention, lore, CRM, intel, content)

### Reporting (`/reporting`)
- Activity feed with filtering by brand and type
- Output log with search

## Phase 2: Technical Architecture

### Data Layer
- Brand data, tool definitions, and CRM knowledge extracted into typed data modules
- Local state with React context for brand selection (persists across routes)
- Activity logging with localStorage (upgradable to Supabase later)

### AI Integration
- Server functions for AI generation (keeps API keys server-side)
- Streaming output support via server functions
- Lovable AI Gateway for Claude calls (no raw API keys needed)

### Auth Foundation
- Basic authentication setup with Lovable Cloud
- Login page with email/password
- Protected routes via `_authenticated` layout route

### Component Library
- `ToolCard` — reusable tool selection card
- `ToolPanel` — form + generate + output workflow
- `OutputPanel` — markdown-rendered AI output with copy
- `BrandSelector` — global brand context switcher
- `MetricCard` — key stat display
- `PriorityCard` — action recommendation card
- `ActivityItem` — feed item component

## Implementation Order

1. Design system, theme, and core components
2. App shell with sidebar navigation and brand selector
3. Today/home screen
4. Content Studio (largest feature surface)
5. SEO Intelligence
6. CRM & Retention
7. Brands management
8. Campaigns calendar
9. Reporting/activity
10. Auth foundation
11. AI generation via server functions

