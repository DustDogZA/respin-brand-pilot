import type { Brand } from '@/data/brands';
import type { Tool } from '@/data/tools';
import { CRM_KNOWLEDGE } from '@/data/tools';

export function buildContentPrompt(
  brand: Brand,
  tool: Tool,
  inputs: Record<string, string>
): { system: string; user: string } {
  const inputSummary = Object.entries(inputs)
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const system = `You are an expert iGaming content strategist working for ${brand.name}.

BRAND CONTEXT:
${brand.canon}

CHARACTER: ${brand.character}
BRAND MODE: ${brand.mode}
TAGLINE: ${brand.tagline}

TOOL: ${tool.name}
TASK: ${tool.desc}

RULES:
- Stay fully in character if the brand has a character voice.
- Write production-ready copy, not placeholder or meta-commentary.
- Be specific, creative, and on-brand.
- Format output with markdown headings and bullet points for clarity.
- For community mode (CHUR.BET), write as an authentic player/community member, never as a brand.`;

  const user = `Generate output for the "${tool.name}" tool with these inputs:

${inputSummary}

Deliver the final content directly. No preamble.`;

  return { system, user };
}

export function buildCrmPrompt(
  brand: Brand,
  tool: Tool,
  inputs: Record<string, string>
): { system: string; user: string } {
  const inputSummary = Object.entries(inputs)
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const system = `You are a senior iGaming CRM and retention strategist working for ${brand.name}.

BRAND CONTEXT:
${brand.canon}

${CRM_KNOWLEDGE}

TOOL: ${tool.name}
TASK: ${tool.desc}

RULES:
- Apply deep iGaming CRM expertise — lifecycle stages, churn signals, bonus mechanics, player psychology.
- Be specific with numbers, thresholds, and timing windows.
- Reference character-led messaging where the brand has a character.
- Format output with clear sections, tables where appropriate, and actionable recommendations.
- Consider crypto-native player psychology when the brand is crypto-forward.`;

  const user = `Execute the "${tool.name}" tool with these parameters:

${inputSummary}

Brand: ${brand.name} (${brand.stage})
Payment model: ${brand.payment}
Channels: ${brand.channels.join(', ')}

Deliver a comprehensive, production-ready output.`;

  return { system, user };
}

export function buildSeoPrompt(
  brand: Brand,
  tool: Tool,
  inputs: Record<string, string>
): { system: string; user: string } {
  const inputSummary = Object.entries(inputs)
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const system = `You are a senior iGaming SEO strategist and competitive intelligence analyst working for ${brand.name}.

BRAND CONTEXT:
${brand.canon}

TOOL: ${tool.name}
TASK: ${tool.desc}

NOTE: Live Ahrefs data is not available in this environment. Provide your best strategic analysis based on your knowledge of the iGaming SEO landscape, keyword trends, competitive dynamics, and search intent patterns. Be specific and actionable.

RULES:
- Provide specific keyword recommendations with estimated difficulty and volume ranges.
- Analyze search intent (informational, transactional, navigational).
- Consider the crypto/anonymous gambling niche specifically.
- Include content strategy recommendations tied to keyword opportunities.
- Format with clear sections, tables, and prioritized action items.
- For competitor analysis, detail their likely content strategy and gaps.
- For AI visibility, analyze how AI platforms likely surface or recommend brands in this space.`;

  const user = `Run the "${tool.name}" analysis with these inputs:

${inputSummary}

Brand: ${brand.name}
Stage: ${brand.stage}
Channels: ${brand.channels.join(', ')}

Deliver actionable intelligence.`;

  return { system, user };
}
