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
  kikis: 'rgba(201,168,76,',
  throne: 'rgba(160,25,47,',
  orions: 'rgba(61,139,205,',
  chur: 'rgba(107,143,113,',
};

const BRAND_ACTIONS: Record<string, { dot: string; title: string; desc: string; link: string; linkLabel: string }[]> = {
  kikis: [
    { dot: '#e8994d', title: 'Draft TikTok opener — Phase 1', desc: 'Character post needed before launch', link: '/content', linkLabel: 'Content →' },
    { dot: '#3d5a42', title: 'Complete Veo brief — opening scene', desc: 'Casino floor, midnight, champagne', link: '/content', linkLabel: 'Content →' },
  ],
  throne: [
    { dot: '#e8994d', title: 'Name the Ruler character', desc: 'Lore foundation required before any campaign work', link: '/content', linkLabel: 'Content →' },
    { dot: '#3d5a42', title: 'Build world lore — origins of the Throne', desc: 'Canon-safe blog format', link: '/content', linkLabel: 'Content →' },
  ],
  orions: [
    { dot: '#e8994d', title: 'Segment Builder — at-risk cohort', desc: 'Crypto depositor definition needed', link: '/crm', linkLabel: 'CRM →' },
    { dot: '#3d5a42', title: 'Competitor intel — stake.com', desc: 'Benchmark before X strategy launch', link: '/seo', linkLabel: 'SEO →' },
  ],
  chur: [
    { dot: '#e8994d', title: 'Write first player article', desc: 'Crypto casino landscape overview', link: '/content', linkLabel: 'Content →' },
    { dot: '#3d5a42', title: 'Concept Sandbox — editorial voice', desc: 'Define what CHUR sounds like before publishing', link: '/content', linkLabel: 'Content →' },
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

/* ── Sparkline SVGs ── */

function Sparkline({ color, points }: { color: string; points: string }) {
  return (
    <svg width="100%" height="18" viewBox="0 0 80 18" style={{ display: 'block', marginTop: 8 }}>
      <polyline points={points} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ── Main Component ── */

function SingleBrandToday() {
  const { brand } = useBrand();
  const { entries } = useActivityLog();

  const accentBase = ACCENT_MAP[brand.id] || ACCENT_MAP.chur;
  const contentCount = entries.length;
  const intelCount = entries.filter((e) => e.type === 'intel').length;
  const actions = BRAND_ACTIONS[brand.id] || BRAND_ACTIONS.chur;

  // AI chat state
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
      {/* ── Hero ── */}
      <div style={{ background: '#0d1b2a', padding: '26px 24px 30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -60, top: -60, width: 300, height: 300, borderRadius: '50%', background: `${accentBase}0.18)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 100, bottom: -80, width: 160, height: 160, borderRadius: '50%', background: `${accentBase}0.09)`, pointerEvents: 'none' }} />

        <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(245,243,238,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
          {brand.name} — {brand.stage}
        </p>
        <h1 style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-0.04em', color: '#f5f3ee', lineHeight: 1.05, margin: '0 0 16px' }}>
          Good morning.
        </h1>

        {/* Glassmorphic stat chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: 'pieces generated', value: contentCount },
            { label: 'campaigns active', value: 0 },
          ].map((chip) => (
            <span
              key={chip.label}
              style={{
                background: 'rgba(245,243,238,0.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(245,243,238,0.12)',
                borderRadius: 100,
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: 600,
                color: '#f5f3ee',
              }}
            >
              {chip.value} {chip.label}
            </span>
          ))}
          <span
            style={{
              background: `${accentBase}0.15)`,
              border: `1px solid ${accentBase}0.30)`,
              borderRadius: 100,
              padding: '6px 14px',
              fontSize: 11,
              fontWeight: 600,
              color: brand.accent,
            }}
          >
            {brand.stage}
          </span>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', minHeight: 400 }}>
        {/* Left column */}
        <div style={{ padding: '20px 24px', borderRight: '0.5px solid #e0ddd5' }}>
          {/* Metric cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
            {/* Content */}
            <div style={{ background: '#ffffff', borderRadius: 14, border: '0.5px solid #e0ddd5', padding: 16 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#9b9690', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Content</p>
              <p style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.04em', color: '#0d1b2a', margin: '4px 0 0', lineHeight: 1 }}>{contentCount}</p>
              <p style={{ fontSize: 11, color: '#3d5a42', margin: '4px 0 0' }}>+{contentCount} this week</p>
              <Sparkline color="#3d5a42" points="0,15 13,13 26,14 40,9 53,11 66,7 80,5" />
            </div>
            {/* Campaigns */}
            <div style={{ background: '#ffffff', borderRadius: 14, border: '0.5px solid #e0ddd5', padding: 16 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#9b9690', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Campaigns</p>
              <p style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.04em', color: '#0d1b2a', margin: '4px 0 0', lineHeight: 1 }}>0</p>
              <p style={{ fontSize: 11, color: '#e8994d', margin: '4px 0 0' }}>Launching soon</p>
              <Sparkline color="#e8994d" points="0,15 16,15 32,12 48,12 64,9 80,9" />
            </div>
            {/* SEO signals */}
            <div style={{ background: '#ffffff', borderRadius: 14, border: '0.5px solid #e0ddd5', padding: 16 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#9b9690', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>SEO signals</p>
              <p style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.04em', color: '#0d1b2a', margin: '4px 0 0', lineHeight: 1 }}>{intelCount}</p>
              <p style={{ fontSize: 11, color: '#3d5a42', margin: '4px 0 0' }}>Opportunities</p>
              <Sparkline color="#3d5a42" points="0,16 13,15 26,13 40,12 53,10 66,8 80,6" />
            </div>
            {/* Stage */}
            <div style={{ background: '#ffffff', borderRadius: 14, border: '0.5px solid #e0ddd5', padding: 16 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#9b9690', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Stage</p>
              <p style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.04em', color: brand.accent, margin: '4px 0 0', lineHeight: 1 }}>{stageLabel}</p>
              <p style={{ fontSize: 11, color: '#9b9690', margin: '4px 0 0' }}>Phase 1</p>
              {/* Progress bar */}
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < filledSegments ? brand.accent : '#e0ddd5' }} />
                ))}
              </div>
            </div>
          </div>

          {/* Next actions */}
          <p style={{ fontSize: 10, fontWeight: 700, color: '#9b9690', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Next actions</p>
          {actions.map((action, i) => (
            <div key={i} style={{ background: '#ffffff', borderRadius: 14, border: '0.5px solid #e0ddd5', padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: action.dot, marginTop: 5, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#0d1b2a', margin: '0 0 2px' }}>{action.title}</p>
                  <p style={{ fontSize: 11, color: '#9b9690', margin: 0 }}>{action.desc}</p>
                </div>
              </div>
              <Link to={action.link} style={{ fontSize: 12, fontWeight: 600, color: '#3d5a42', flexShrink: 0, textDecoration: 'none' }}>
                {action.linkLabel}
              </Link>
            </div>
          ))}
        </div>

        {/* Right column — AI Assistant */}
        <div style={{ background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '0.5px solid #e0ddd5', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: brand.accent }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#9b9690', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI Assistant</span>
          </div>

          {/* Chat area */}
          <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', maxHeight: 420 }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ marginLeft: msg.role === 'user' ? 20 : 0 }}>
                {msg.role === 'ai' && (
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#9b9690', margin: '0 0 3px' }}>respin.hub</p>
                )}
                <div
                  style={{
                    background: msg.role === 'ai' ? '#f5f3ee' : '#0d1b2a',
                    borderRadius: msg.role === 'ai' ? '3px 12px 12px 12px' : '12px 3px 12px 12px',
                    padding: '11px 13px',
                    fontSize: 12.5,
                    color: msg.role === 'ai' ? '#0d1b2a' : '#f5f3ee',
                    lineHeight: 1.55,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, color: '#9b9690', margin: '0 0 3px' }}>respin.hub</p>
                <div style={{ background: '#f5f3ee', borderRadius: '3px 12px 12px 12px', padding: '11px 13px', fontSize: 12.5, color: '#9b9690' }}>
                  Thinking…
                </div>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div style={{ padding: '12px 14px', borderTop: '0.5px solid #e0ddd5' }}>
            <div style={{ background: '#f5f3ee', borderRadius: 100, border: '0.5px solid #e0ddd5', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask respin.hub anything…"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: '#0d1b2a' }}
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                style={{
                  width: 26, height: 26, borderRadius: '50%', background: '#0d1b2a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none', cursor: 'pointer', flexShrink: 0,
                }}
              >
                <span style={{ color: '#f5f3ee', fontSize: 11 }}>↑</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
