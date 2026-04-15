import { createServerFn } from '@tanstack/react-start';
import { CAMPAIGN_TOOLS, COMMUNITY_TOOLS, INTEL_TOOLS, CRM_TOOLS, type Tool } from '@/data/tools';

const ALL_TOOLS = [...CAMPAIGN_TOOLS, ...COMMUNITY_TOOLS, ...INTEL_TOOLS, ...CRM_TOOLS];

function buildToolCatalog(): string {
  return ALL_TOOLS.map((t) => {
    const fields = t.fields.map((f) => {
      let desc = `${f.id} (${f.type})`;
      if (f.options) desc += ` — options: ${f.options.join(', ')}`;
      if (f.placeholder) desc += ` — hint: ${f.placeholder}`;
      return `    - ${desc}`;
    }).join('\n');
    return `  ${t.id}: "${t.name}" — ${t.desc}\n${fields}`;
  }).join('\n\n');
}

const TOOL_CATALOG = buildToolCatalog();

export const detectToolIntent = createServerFn({ method: 'POST' })
  .inputValidator((input: { message: string; brandId: string }) => {
    if (!input.message) throw new Error('message is required');
    return { message: input.message, brandId: input.brandId };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { toolId: null, inputs: {}, fallbackResponse: 'AI service not configured.' };
    }

    const systemPrompt = `You are a tool-routing assistant. Given a user message, determine which tool (if any) they want to use and extract the field values.

AVAILABLE TOOLS:
${TOOL_CATALOG}

Respond with ONLY valid JSON (no markdown, no code fences):
{
  "toolId": "tool_id_here or null if no tool matches",
  "inputs": { "field_id": "extracted value", ... },
  "fallbackResponse": "only if toolId is null — a helpful reply"
}

Rules:
- Match the user's intent to the closest tool
- Extract as many field values as you can from the message
- For select fields, pick the closest matching option
- If the message is general conversation (greeting, question about the brand, etc.), set toolId to null and provide a helpful fallbackResponse
- Always return valid JSON`;

    try {
      const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-3-flash-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: data.message },
          ],
          max_tokens: 500,
        }),
      });

      if (!res.ok) {
        return { toolId: null, inputs: {}, fallbackResponse: 'I had trouble understanding that. Could you rephrase?' };
      }

      const json = await res.json();
      let text = json.choices?.[0]?.message?.content || '';
      
      // Strip markdown code fences if present
      text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

      const parsed = JSON.parse(text);
      return {
        toolId: parsed.toolId || null,
        inputs: parsed.inputs || {},
        fallbackResponse: parsed.fallbackResponse || undefined,
      };
    } catch (e) {
      console.error('Tool intent detection error:', e);
      return { toolId: null, inputs: {}, fallbackResponse: "I'm here to help — try asking me to write a post, build a segment, or analyze keywords." };
    }
  });

export function getToolById(id: string): Tool | undefined {
  return ALL_TOOLS.find((t) => t.id === id);
}

export function getToolCategory(id: string): 'content' | 'crm' | 'seo' | null {
  if (CAMPAIGN_TOOLS.find((t) => t.id === id) || COMMUNITY_TOOLS.find((t) => t.id === id)) return 'content';
  if (CRM_TOOLS.find((t) => t.id === id)) return 'crm';
  if (INTEL_TOOLS.find((t) => t.id === id)) return 'seo';
  return null;
}
