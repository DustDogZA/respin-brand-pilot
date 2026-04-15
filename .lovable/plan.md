

# Editable Brand Canon — Plan

## Summary

Replace the read-only canon toggle with an inline editor that persists canon overrides to localStorage and updates the brand context so all generation prompts use the edited canon.

## Changes

### 1. `src/context/BrandContext.tsx`

- Add state: `canonOverrides: Record<string, string>` initialized from localStorage keys `respin_canon_[brandId]`
- Add function: `updateCanon(brandId: string, canon: string)` — saves to localStorage and updates state
- Expose a `getBrand(id: string)` helper that returns the brand with canon override applied
- Change `brand` derivation to merge the override: `{ ...BRANDS[activeBrandId], canon: canonOverrides[activeBrandId] ?? BRANDS[activeBrandId].canon }`
- Export `canonOverrides` and `updateCanon` in context type

### 2. `src/routes/_app.brands.tsx`

- Import `useBrand` context and `Textarea` component, `Button`, and `toast` from sonner
- Add local state per card: `editingId: string | null` and `draftCanon: string`
- Replace the `<details>` block with:
  - When not editing: "Edit canon" button
  - When editing: Textarea (min-h-[200px], pre-filled with current canon), Save and Cancel buttons
- Save calls `updateCanon(brand.id, draftCanon)`, shows `toast("Canon saved")`, collapses editor
- Cancel resets draft and collapses
- Display canon text comes from context (with override applied), not raw `BRANDS`

### 3. Prompt propagation

Already works — `useBrand().brand` is used in Content, CRM, and SEO pages to build prompts. Since we're updating the canon in the context's brand object, all prompts automatically get the updated canon. The brands page will also need to read brands through context to show overridden canons.

## Technical Notes

- localStorage keys: `respin_canon_kikis`, `respin_canon_throne`, `respin_canon_orions`, `respin_canon_chur`
- SSR-safe: localStorage reads wrapped in `typeof window !== 'undefined'`
- The Brands page iterates `Object.values(BRANDS)` but applies canon overrides from context for display

