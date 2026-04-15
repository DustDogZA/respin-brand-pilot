

# Functional AI Assistant on the Today Dashboard

## Summary

Add a conversational AI assistant panel to the single-brand Today view that can detect tool intent from natural language, collect required inputs inline, execute generation using the existing `generateContent` server function + prompt builders, and display results — all without leaving the dashboard. Generated outputs are saved to the activity log.

## How It Works

The user types something like "Write a TikTok post about the casino opening" or "Build a segment for at-risk crypto depositors." The assistant:

1. Recognizes which tool maps to the request (Character Post, Segment Builder, Keyword Compass, etc.)
2. Uses the existing prompt builders (`buildContentPrompt`, `buildCrmPrompt`, `buildSeoPrompt`) to construct the AI call
3. Calls `generateContent` server function
4. Renders the output as a chat message with markdown formatting
5. Saves to the activity log via `addEntry`

## Architecture

### Tool Intent Detection

A lightweight server function (`detectToolIntent`) that takes the user's message + brand context and returns structured JSON via tool calling: which tool ID to use + extracted field values. This uses the existing `generateContent` infrastructure but with a structured output approach — the system prompt lists the available tools and their fields, and the model returns a JSON object with `toolId` and `inputs`.

### Chat Flow

```text
User types message
  → detectToolIntent (server fn) → { toolId, inputs }
  → Build prompt using existing buildContentPrompt / buildCrmPrompt / buildSeoPrompt
  → generateContent (server fn) → markdown output
  → Render in chat + save to activity log
```

If the model can't identify a tool, it falls back to a general brand-aware conversation using the brand canon as system context.

## UI Design

The AI panel returns to the right column of the Today view (restoring the two-column layout removed earlier), styled with the current glass design system:

- **Header**: Brand accent dot + "AI Assistant" label
- **Chat area**: Scrollable message list with glass-styled bubbles. AI messages use `glass-panel` background. User messages use a soft primary-tinted background.
- **Input bar**: Glass pill input with send button
- **Tool execution indicator**: When a tool is detected, show a small chip above the response ("Used: Character Post" or "Used: Segment Builder")
- **Copy button** on AI responses
- **Loading state**: Typing indicator dots while generating
- **Mobile**: Panel stacks below the dashboard content on screens < 768px

## New Files

### `src/utils/assistant.functions.ts`

Server function `detectToolIntent` that:
- Takes user message + brand ID
- System prompt lists all available tools (content, CRM, SEO) with their IDs, names, and field schemas
- Returns `{ toolId: string | null, inputs: Record<string, string>, fallbackResponse?: string }`
- Uses the existing `generateContent` infrastructure internally

### `src/components/AiAssistant.tsx`

Self-contained chat component accepting `brand` prop. Manages:
- `messages` state (array of `{ role, content, toolUsed? }`)
- `sendMessage` handler that orchestrates: detect intent → build prompt → generate → display
- Markdown rendering for AI responses (using simple regex-based formatting or a `prose` class)
- Activity log integration via `useActivityLog`
- Loading/error states

## Modified Files

### `src/routes/_app.index.tsx`

- Import `AiAssistant` component
- Restore two-column grid layout: `grid-cols-1 md:grid-cols-[1fr_320px]`
- Place `<AiAssistant brand={brand} />` in the right column
- AI panel stacks below on mobile

## No Other Changes

All existing tool pages, prompts, data models, and navigation remain untouched. The assistant reuses all existing infrastructure.

