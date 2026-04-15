import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useBrand } from '@/context/BrandContext';
import { useActivityLog } from '@/context/ActivityLogContext';
import { AllBrandsOverview } from '@/components/AllBrandsOverview';
import { generateContent } from '@/utils/ai.functions';

export const Route = createFileRoute('/_app/')({
  component: TodayPage,
});

function TodayPage() {
  const { activeBrandId } = useBrand();
  if (activeBrandId === 'all') return <AllBrandsOverview />;
  return <SingleBrandToday />;
}

/* ── Per-brand static data ── */

const ACCENT_MAP: Record<string, string> = {
  kikis: '#c9a84c',
  throne: '#a0192f',
  orions: '#3d8bcd',
  chur: '#6b8f71',
};

const BRAND_ACTIONS: Record<string, { dot: string; title: string; desc: string; link: string; linkLabel: string }[]> = {
  kikis: [
    { dot: '#d4a054', title: 'Draft TikTok opener — Phase 1', desc: 'Character post needed before launch', link: '/content', linkLabel: 'Content →' },
    { dot: '#6b9e76', title: 'Complete Veo brief — opening scene', desc: 'Casino floor, midnight, champagne', link: '/content', linkLabel: 'Content →' },
  ],
  throne: [
    { dot: '#d4a054', title: 'Name the Ruler character', desc: 'Lore foundation required before any campaign work', link: '/content', linkLabel: 'Content →' },
    { dot: '#6b9e76', title: 'Build world lore — origins of the Throne', desc: 'Canon-safe blog format', link: '/content', linkLabel: 'Content →' },
  ],
  orions: [
    { dot: '#d4a054', title: 'Segment Builder — at-risk cohort', desc: 'Crypto depositor definition needed', link: '/crm', linkLabel: 'CRM →' },
    { dot: '#6b9e76', title: 'Competitor intel — stake.com', desc: 'Benchmark before X strategy launch', link: '/seo', linkLabel: 'SEO →' },
  ],
  chur: [
    { dot: '#d4a054', title: 'Write first player article', desc: 'Crypto casino landscape overview', link: '/content', linkLabel: 'Content →' },
    { dot: '#6b9e76', title: 'Concept Sandbox — editorial voice', desc: 'Define what CHUR sounds like before publishing', link: '/content', linkLabel: 'Content →' },
  ],
};

const INITIAL_MESSAGES: Record<string, { role: 'ai' | 'user'; text: string }[]> = {
  kikis: [
    { role: 'ai', text: "Good morning. Kiki's Casino Phase 1 launches this week. Want me to draft the opening character post?" },
    { role: 'user', text: "Yes — champagne energy. She's unlocking the doors for the first time." },
    { role: 'ai', text: '"They told me the desert had gone quiet, darling. How dreadfully boring. The doors are open. The chips are heavy. See you at the table."' },
  ],
  throne: [
    { role: 'ai', text: 'Good morning. Throne of Fortune needs its origin lore before any campaign work begins. Shall I draft the founding myth?' },
    { role: 'user', text: 'Yes — make it feel ancient, inevitable. The throne was always waiting.' },
    { role: 'ai', text: '"Before the first coin was struck, before the first wager was placed — there was the Throne. It did not ask to be claimed. It waited. And it waits still."' },
  ],
  orions: [
    { role: 'ai', text: "Good morning. Orion's Fortune needs a competitor benchmark before the X strategy launches. Want me to start with stake.com?" },
    { role: 'user', text: 'Yes — focus on their crypto deposit flow and anonymity positioning.' },
    { role: 'ai', text: '"Stake leads on speed but trades away privacy at scale. Orion\'s edge: no KYC ceiling, no withdrawal theatre. The smart money notices."' },
  ],
  chur: [
    { role: 'ai', text: 'Good morning. CHUR.BET needs its editorial voice defined before the first article drops. Want to workshop it?' },
    { role: 'user', text: "Yes — it should feel like a mate who actually knows what they're talking about." },
    { role: 'ai', text: '"Look, most casino reviews are written by people who\'ve never placed a real bet. We have. That\'s the difference. No fluff, no affiliate bait — just what actually matters when you\'re putting money down."' },
  ],
};

function Sparkline({ color, points }: { color: string; points: string }) {
  return (
    <svg width="100%" height="18" viewBox="0 0 80 18" className="block mt-2">
      <polyline points={points} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function SingleBrandToday() {
  const { brand } = useBrand();
  const { entries } = useActivityLog();

  const accent = ACCENT_MAP[brand.id] || ACCENT_MAP.chur;
  const contentCount = entries.length;
  const intelCount = entries.filter((e) => e.type === 'intel').length;
  const actions = BRAND_ACTIONS[brand.id] || BRAND_ACTIONS.chur;

  const initial = (INITIAL_MESSAGES[brand.id] || INITIAL_MESSAGES.chur).map((m, i) => ({ ...m, id: i }));
  const [messages, setMessages] = useState(initial);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { role: 'user' as const, text, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg]
        .map((m) => `${m.role === 'ai' ? 'Assistant' : 'User'}: ${m.text}`)
        .join('\n');
      const result = await generateContent({
        data: {
          systemPrompt: `You are respin.hub, the AI marketing assistant for ${brand.name}. Stay in character. Be concise (2-3 sentences max). Brand canon:\n${brand.canon}`,
          userPrompt: `Conversation so far:\n${history}\n\nUser: ${text}\n\nRespond as respin.hub:`,
          maxTokens: 300,
        },
      });
      setMessages((prev) => [...prev, { role: 'ai', text: result.text, id: Date.now() + 1 }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', text: 'Something went wrong — please try again.', id: Date.now() + 1 }]);
    } finally {
      setLoading(false);
    }
  };

  const stageLabel = brand.stage === 'Experimental' ? 'EXP' : 'PRE';
  const filledSegments = brand.id === 'chur' ? 1 : 2;

  return (
    <div>
      {/* Hero — light atmospheric */}
      <div
        className="relative overflow-hidden px-5 md:px-8 pt-8 pb-8"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 6%, transparent), transparent 70%)`,
        }}
      >
        <div
          className="absolute pointer-events-none rounded-full"
          style={{ right: -60, top: -60, width: 300, height: 300, background: `color-mix(in srgb, ${accent} 6%, transparent)` }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{ right: 100, bottom: -80, width: 160, height: 160, background: `color-mix(in srgb, ${accent} 3%, transparent)` }}
        />

        <p className="text-metadata text-muted-foreground mb-1.5 relative z-10">
          {brand.name} — {brand.stage}
        </p>
        <h1 className="text-[32px] md:text-[40px] font-semibold tracking-[-0.03em] text-foreground mb-5 relative z-10">
          Good morning.
        </h1>

        {/* Stat chips */}
        <div className="flex flex-wrap gap-2 relative z-10">
          <span className="glass-panel px-3.5 py-1.5 text-[12px] font-medium text-foreground">
            <span className="font-semibold">{contentCount}</span>
            <span className="text-muted-foreground ml-1.5">pieces generated</span>
          </span>
          <span className="glass-panel px-3.5 py-1.5 text-[12px] font-medium text-foreground">
            <span className="font-semibold">0</span>
            <span className="text-muted-foreground ml-1.5">campaigns active</span>
          </span>
          <span
            className="px-3.5 py-1.5 text-[12px] font-semibold rounded-2xl"
            style={{
              background: `color-mix(in srgb, ${accent} 10%, transparent)`,
              border: `1px solid color-mix(in srgb, ${accent} 20%, transparent)`,
              color: accent,
            }}
          >
            {brand.stage}
          </span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] min-h-[400px]">
        {/* Left column */}
        <div className="p-5 md:px-8 md:py-6 md:border-r border-border">
          {/* Metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="glass-panel p-4">
              <p className="text-metadata text-muted-foreground mb-1">Content</p>
              <p className="text-[24px] md:text-[28px] font-bold tracking-[-0.03em] text-foreground leading-none">{contentCount}</p>
              <p className="text-[11px] mt-1" style={{ color: '#6b9e76' }}>+{contentCount} this week</p>
              <Sparkline color="#6b9e76" points="0,15 13,13 26,14 40,9 53,11 66,7 80,5" />
            </div>
            <div className="glass-panel p-4">
              <p className="text-metadata text-muted-foreground mb-1">Campaigns</p>
              <p className="text-[24px] md:text-[28px] font-bold tracking-[-0.03em] text-foreground leading-none">0</p>
              <p className="text-[11px] mt-1" style={{ color: '#d4a054' }}>Launching soon</p>
              <Sparkline color="#d4a054" points="0,15 16,15 32,12 48,12 64,9 80,9" />
            </div>
            <div className="glass-panel p-4">
              <p className="text-metadata text-muted-foreground mb-1">SEO signals</p>
              <p className="text-[24px] md:text-[28px] font-bold tracking-[-0.03em] text-foreground leading-none">{intelCount}</p>
              <p className="text-[11px] mt-1" style={{ color: '#6b9e76' }}>Opportunities</p>
              <Sparkline color="#6b9e76" points="0,16 13,15 26,13 40,12 53,10 66,8 80,6" />
            </div>
            <div className="glass-panel p-4">
              <p className="text-metadata text-muted-foreground mb-1">Stage</p>
              <p className="text-[24px] md:text-[28px] font-bold tracking-[-0.03em] leading-none" style={{ color: accent }}>{stageLabel}</p>
              <p className="text-[11px] mt-1 text-muted-foreground">Phase 1</p>
              <div className="flex gap-1 mt-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex-1 h-1 rounded-full"
                    style={{ background: i < filledSegments ? accent : 'rgba(0,0,0,0.06)' }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Next actions */}
          <p className="text-metadata text-muted-foreground mb-3">Next actions</p>
          <div className="space-y-2">
            {actions.map((action, i) => (
              <div key={i} className="glass-panel p-4 flex items-start gap-3">
                <div className="flex-1 flex items-start gap-2.5">
                  <span className="w-[7px] h-[7px] rounded-full mt-1.5 shrink-0" style={{ background: action.dot }} />
                  <div>
                    <p className="text-[13px] font-semibold text-foreground mb-0.5">{action.title}</p>
                    <p className="text-[11px] text-muted-foreground">{action.desc}</p>
                  </div>
                </div>
                <Link to={action.link} className="text-[12px] font-semibold text-primary shrink-0 no-underline hover:underline">
                  {action.linkLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — AI Assistant */}
        <div className="flex flex-col bg-card/50 backdrop-blur-sm">
          <div className="px-4 py-3.5 border-b border-border flex items-center gap-2">
            <span className="w-[7px] h-[7px] rounded-full" style={{ background: accent }} />
            <span className="text-metadata text-muted-foreground">AI Assistant</span>
          </div>

          <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto max-h-[420px]">
            {messages.map((msg) => (
              <div key={msg.id} style={{ marginLeft: msg.role === 'user' ? 20 : 0 }}>
                {msg.role === 'ai' && (
                  <p className="text-[10px] font-medium text-muted-foreground mb-1">respin.hub</p>
                )}
                <div
                  className="px-3.5 py-2.5 text-[12.5px] leading-relaxed"
                  style={{
                    background: msg.role === 'ai' ? 'var(--color-accent)' : 'var(--color-primary)',
                    color: msg.role === 'ai' ? 'var(--color-foreground)' : 'var(--color-primary-foreground)',
                    borderRadius: msg.role === 'ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div>
                <p className="text-[10px] font-medium text-muted-foreground mb-1">respin.hub</p>
                <div className="px-3.5 py-2.5 text-[12.5px] text-muted-foreground rounded-[4px_14px_14px_14px] bg-accent">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-2 glass-panel rounded-full px-3.5 py-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask respin.hub anything…"
                className="flex-1 bg-transparent border-none outline-none text-[12px] text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="w-7 h-7 rounded-full bg-primary flex items-center justify-center border-none cursor-pointer shrink-0 transition-premium active:scale-95"
              >
                <span className="text-primary-foreground text-[11px]">↑</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
