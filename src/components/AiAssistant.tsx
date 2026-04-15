import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Copy, Check, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useActivityLog } from '@/context/ActivityLogContext';
import { detectToolIntent, getToolById, getToolCategory } from '@/utils/assistant.functions';
import { generateContent } from '@/utils/ai.functions';
import { buildContentPrompt, buildCrmPrompt, buildSeoPrompt } from '@/utils/prompts';
import type { Brand } from '@/data/brands';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolUsed?: string;
}

function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 text-[13px] leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('### ')) return <h4 key={i} className="font-semibold text-foreground mt-3 mb-1">{line.slice(4)}</h4>;
        if (line.startsWith('## ')) return <h3 key={i} className="font-semibold text-foreground mt-3 mb-1">{line.slice(3)}</h3>;
        if (line.startsWith('# ')) return <h3 key={i} className="font-bold text-foreground mt-3 mb-1">{line.slice(2)}</h3>;
        if (line.startsWith('- ') || line.startsWith('* ')) return <p key={i} className="pl-3">• {line.slice(2)}</p>;
        if (line.match(/^\d+\.\s/)) return <p key={i} className="pl-3">{line}</p>;
        if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold">{line.slice(2, -2)}</p>;
        if (line.trim() === '') return <div key={i} className="h-1" />;
        // Inline bold
        const formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        return <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
      })}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-accent/40"
      title="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
    </button>
  );
}

export function AiAssistant({ brand }: { brand: Brand }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addEntry } = useActivityLog();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      // Step 1: Detect tool intent
      const intent = await detectToolIntent({ data: { message: text, brandId: brand.id } });

      if (!intent.toolId) {
        // Fallback — general conversation
        const fallback = intent.fallbackResponse || "I can help you write posts, build segments, or analyze keywords. Just ask!";
        setMessages((prev) => [...prev, { role: 'assistant', content: fallback }]);
        setLoading(false);
        return;
      }

      // Step 2: Build prompt using existing builders
      const tool = getToolById(intent.toolId);
      if (!tool) {
        setMessages((prev) => [...prev, { role: 'assistant', content: "I found a tool match but couldn't load it. Try again?" }]);
        setLoading(false);
        return;
      }

      const category = getToolCategory(intent.toolId);
      let prompt: { system: string; user: string };

      if (category === 'crm') {
        prompt = buildCrmPrompt(brand, tool, intent.inputs);
      } else if (category === 'seo') {
        prompt = buildSeoPrompt(brand, tool, intent.inputs);
      } else {
        prompt = buildContentPrompt(brand, tool, intent.inputs);
      }

      // Step 3: Generate content
      const result = await generateContent({
        data: { systemPrompt: prompt.system, userPrompt: prompt.user, maxTokens: 2000 },
      });

      const output = result.text || 'No output generated.';

      setMessages((prev) => [...prev, { role: 'assistant', content: output, toolUsed: tool.name }]);

      // Step 4: Save to activity log
      if (!result.error) {
        const typeMap: Record<string, 'content' | 'crm' | 'intel' | 'acq' | 'ret' | 'lore'> = {
          content: 'content',
          crm: 'crm',
          seo: 'intel',
        };
        addEntry({
          brand: brand.id,
          toolName: tool.name,
          type: typeMap[category || 'content'] || 'content',
          fullOutput: output,
        });
      }
    } catch (e) {
      console.error('Assistant error:', e);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, brand, addEntry]);

  return (
    <div className="glass-panel flex flex-col h-[calc(100vh-220px)] min-h-[400px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2.5 shrink-0">
        <span className="w-2 h-2 rounded-full" style={{ background: brand.accent }} />
        <span className="text-[13px] font-semibold text-foreground">AI Assistant</span>
        <Sparkles className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <Sparkles className="w-8 h-8 text-muted-foreground/40 mb-3" />
            <p className="text-[13px] text-muted-foreground mb-1">Ask me anything about {brand.short}</p>
            <p className="text-[11px] text-muted-foreground/70">
              "Write a TikTok post" · "Build a segment" · "Analyze keywords"
            </p>
          </div>
        )}

        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] group ${msg.role === 'user' ? '' : ''}`}>
                {msg.toolUsed && (
                  <Badge variant="outline" className="mb-1.5 text-[10px]">
                    Used: {msg.toolUsed}
                  </Badge>
                )}
                <div
                  className={`rounded-2xl px-3.5 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-primary/10 text-foreground'
                      : 'glass-panel'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <SimpleMarkdown content={msg.content} />
                  ) : (
                    <p className="text-[13px]">{msg.content}</p>
                  )}
                </div>
                {msg.role === 'assistant' && (
                  <div className="flex justify-end mt-1">
                    <CopyButton text={msg.content} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="glass-panel rounded-2xl px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="px-3 py-3 border-t border-border/50 shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${brand.short} assistant…`}
            disabled={loading}
            className="flex-1 h-9 text-[13px]"
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()} className="h-9 w-9 shrink-0">
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
