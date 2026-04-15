

# Branded Hero Sections for Content, CRM, SEO Pages

## Summary

Create a shared `PageHero` component and add it to the top of the Content, CRM, and SEO tool-list views (not the tool-detail views). Each hero adapts its heading and accent color based on the active brand.

## New File

### `src/components/PageHero.tsx`

Reusable component accepting `page` prop (`'content' | 'crm' | 'seo'`).

Reads `brand` from `useBrand()` context. Renders:

- Dark band (`#0d1b2a`, padding `24px 24px 28px`, relative, overflow hidden)
- Decorative accent circle (absolute, right -40px, top -40px, 200x200, brand-colored at 15% opacity)
- Eyebrow: `"Content Studio — Kiki's Casino"` etc.
- Heading logic:
  - Content + campaign mode: `"Write as {character}."`
  - Content + community mode: `"Build community content."`
  - CRM + campaign: `"Design the retention machine."`
  - CRM + community: `"Design the community machine."`
  - SEO: `"Research the landscape."`

Brand accent map: `{ kikis: 'rgba(201,168,76,0.15)', throne: 'rgba(160,25,47,0.15)', orions: 'rgba(61,139,205,0.15)', chur: 'rgba(107,143,113,0.15)' }`

Page name map: `{ content: 'Content Studio', crm: 'CRM & Retention', seo: 'SEO Intelligence' }`

## Modified Files

### `src/routes/_app.content.tsx`

In the tool-list return (line 159-168), replace the heading `<div>` with `<PageHero page="content" />`. Remove the old `<h1>` and `<p>` block.

### `src/routes/_app.crm.tsx`

In the tool-list return (line 126-133), replace the heading `<div>` with `<PageHero page="crm" />`. Remove the old `<h1>` and `<p>`.

### `src/routes/_app.seo.tsx`

In the tool-list return (line 144-149), replace the heading `<div>` with `<PageHero page="seo" />`. Remove the old `<h1>` and `<p>`.

For all three pages, the hero sits outside the padded content container — the outer wrapper changes from `<div className="p-6 lg:p-8 ...">` to a wrapper with no top padding, where the hero is first, followed by the existing content in a padded div.

## No other changes

All content below the hero on each page remains untouched. Tool-detail views (when `selectedTool` is set) are not affected.

