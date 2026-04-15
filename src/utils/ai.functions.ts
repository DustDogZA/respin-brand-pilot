import { createServerFn } from '@tanstack/react-start';

export const generateContent = createServerFn({ method: 'POST' })
  .inputValidator((input: { systemPrompt: string; userPrompt: string; maxTokens: number }) => {
    if (!input.systemPrompt || !input.userPrompt) {
      throw new Error('systemPrompt and userPrompt are required');
    }
    return {
      systemPrompt: input.systemPrompt,
      userPrompt: input.userPrompt,
      maxTokens: Math.min(input.maxTokens || 1200, 4000),
    };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { text: 'Error: AI service is not configured. Please ensure Lovable Cloud is enabled.', error: true };
    }

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
            { role: 'system', content: data.systemPrompt },
            { role: 'user', content: data.userPrompt },
          ],
          max_tokens: data.maxTokens,
        }),
      });

      if (res.status === 429) {
        return { text: 'Rate limit reached — please wait a moment and try again.', error: true };
      }
      if (res.status === 402) {
        return { text: 'AI credits exhausted. Add funds at Settings → Workspace → Usage.', error: true };
      }
      if (!res.ok) {
        console.error('AI gateway error:', res.status, await res.text());
        return { text: `AI generation failed (${res.status}). Please try again.`, error: true };
      }

      const json = await res.json();
      const text = json.choices?.[0]?.message?.content || '';
      if (!text) {
        return { text: 'No output returned — check your inputs and try again.', error: true };
      }
      return { text, error: false };
    } catch (e) {
      console.error('AI generation error:', e);
      return { text: `Something went wrong: ${e instanceof Error ? e.message : 'Unknown error'}`, error: true };
    }
  });
