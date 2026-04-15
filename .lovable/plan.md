

# Wire Up AI Generation — Plan

## Summary

Replace the placeholder `handleGenerate` functions in Content, CRM, and SEO pages with real AI generation via the Lovable AI Gateway, using a server function as the backend.

## Architecture

```text
Route Page (client)
  → createServerFn (server-side, holds LOVABLE_API_KEY)
    → Lovable AI Gateway (https://ai.gateway.lovable.dev/v1/chat/completions)
  ← returns generated text
  → displayed in output panel
```

Non-streaming for simplicity (matches the user's request). The server function reads `LOVABLE_API_KEY` from environment — already provisioned.

## Files to Create/Modify

### 1. Create `src/utils/ai.functions.ts` — shared server function

A single `generateContent` server function that accepts:
- `systemPrompt: string` — tool-specific system prompt with brand canon and CRM knowledge
- `userPrompt: string` — the user's configured inputs
- `maxTokens: number` — varies by tool type (1200 for content, 1800 for CRM/SEO)

Uses `createServerFn({ method: "POST" })` with input validation. Calls the Lovable AI Gateway with `google/gemini-3-flash-preview`. Returns the text content or an error message string.

### 2. Create `src/utils/prompts.ts` — prompt builders

Three prompt builder functions, one per tool category:

- **`buildContentPrompt(brand, tool, inputs)`** — System prompt includes the brand canon, character voice rules, and tool-specific instructions (e.g. "Write a character post for TikTok"). User prompt assembles the field inputs.

- **`buildCrmPrompt(brand, tool, inputs)`** — System prompt includes brand canon + `CRM_KNOWLEDGE` constant. Tool-specific instructions for segment building, lifecycle mapping, bonus design, or retention calendars.

- **`buildSeoPrompt(brand, tool, inputs)`** — System prompt positions the AI as an iGaming SEO strategist. Includes brand context. Note that Ahrefs live data is not available — AI provides strategic analysis from training knowledge.

Each returns `{ system: string, user: string }`.

### 3. Modify `src/routes/_app.content.tsx`

- Import `generateContent` server function and `buildContentPrompt`
- Add `loading` state (`useState<boolean>(false)`)
- Replace `handleGenerate` placeholder with async function that:
  1. Builds prompts via `buildContentPrompt(brand, selectedTool, inputs)`
  2. Calls `generateContent({ data: { systemPrompt, userPrompt, maxTokens: 1200 } })`
  3. Sets output from response
- Update button to show "Generating..." state and disable while loading
- Use `useServerFn` hook for the server function call

### 4. Modify `src/routes/_app.crm.tsx`

Same pattern as content but uses `buildCrmPrompt` and `maxTokens: 1800`.

### 5. Modify `src/routes/_app.seo.tsx`

Same pattern as content but uses `buildSeoPrompt` and `maxTokens: 1800`. Button says "Analyzing..." while loading.

## Prompt Design (Key Details)

**Content tools** — System prompt example for "Character Post":
> You are {character} from {brand.name}. {brand.canon}. Write a {platform} post about {topic}. Stay fully in character. {tone_note if provided}.

**CRM tools** — System prompt includes full CRM_KNOWLEDGE block plus brand context. Tool-specific instructions vary (e.g. Segment Builder asks for cohort definition with psychology, triggers, offer sensitivity).

**SEO tools** — System prompt positions as iGaming SEO strategist with brand context. Notes that live Ahrefs data is unavailable; provide strategic analysis from knowledge.

## Error Handling

- Server function catches fetch errors and returns descriptive error strings
- 429 (rate limit) and 402 (payment required) are caught and surfaced as user-friendly messages
- Client shows error text in the output panel (no blank screens)

