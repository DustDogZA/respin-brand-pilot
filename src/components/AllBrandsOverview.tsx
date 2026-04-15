import { useBrand } from '@/context/BrandContext';
import { useActivityLog } from '@/context/ActivityLogContext';
import { BRANDS } from '@/data/brands';

const BRAND_CARDS_DATA = [
  {
    id: 'kikis',
    stageBadge: 'PRELAUNCH',
    channels: 'TikTok · X',
    bodyLabel: 'Needs attention',
    actions: [
      { text: 'Draft TikTok opener — Phase 1 launches this week', dot: '#d4a054' },
      { text: 'Complete Veo brief for opening scene', dot: '#6b9e76' },
    ],
  },
  {
    id: 'throne',
    stageBadge: 'PRE-LAUNCH',
    channels: 'Channel TBD',
    bodyLabel: 'Needs attention',
    actions: [
      { text: 'Ruler character still unnamed — lore block needed', dot: '#d4a054' },
      { text: 'Run keyword compass — GOT casino terms', dot: '#6b9e76' },
    ],
  },
  {
    id: 'orions',
    stageBadge: 'PRE-LAUNCH',
    channels: 'X · Telegram',
    bodyLabel: 'Needs attention',
    actions: [
      { text: 'Segment Builder — at-risk crypto player cohort', dot: '#d4a054' },
      { text: 'Competitor intel — stake.com benchmark', dot: '#6b9e76' },
    ],
  },
  {
    id: 'chur',
    stageBadge: 'EXPERIMENTAL',
    channels: 'Blog · Discord',
    bodyLabel: 'Get started',
    actions: [
      { text: 'Write first player article — crypto casino landscape', dot: '#d4a054' },
      { text: 'Concept Sandbox — define the editorial voice', dot: '#6b9e76' },
    ],
  },
];

export function AllBrandsOverview() {
  const { setActiveBrandId } = useBrand();
  const { entries } = useActivityLog();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const totalPieces = entries.length;
  const brandEntryCount = (brandShort: string) =>
    entries.filter((e) => e.brand === brandShort).length;

  return (
    <div className="px-5 md:px-8 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-metadata text-muted-foreground mb-2">{today} — Portfolio view</p>
        <h1 className="text-page-title text-foreground mb-5">All brands.</h1>
        <div className="flex flex-wrap gap-2">
          <span className="glass-panel px-3.5 py-1.5 text-[12px] font-medium text-foreground">
            <span className="font-semibold">4</span>
            <span className="text-muted-foreground ml-1.5">brands active</span>
          </span>
          <span className="glass-panel px-3.5 py-1.5 text-[12px] font-medium text-foreground">
            <span className="font-semibold">{totalPieces}</span>
            <span className="text-muted-foreground ml-1.5">pieces this week</span>
          </span>
          <span className="glass-panel px-3.5 py-1.5 text-[12px] font-medium text-foreground">
            <span className="font-semibold">3</span>
            <span className="text-muted-foreground ml-1.5">actions needed</span>
          </span>
        </div>
      </div>

      {/* Brand cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BRAND_CARDS_DATA.map((card) => {
          const brand = BRANDS[card.id];
          const count = brandEntryCount(brand.short);

          return (
            <div
              key={card.id}
              className="glass-panel cursor-pointer transition-premium hover:scale-[1.005] overflow-hidden"
              style={{ borderColor: `color-mix(in srgb, ${brand.accent} 15%, transparent)` }}
              onClick={() => setActiveBrandId(card.id)}
            >
              {/* Card header — light, brand-tinted */}
              <div
                className="px-5 pt-5 pb-4 relative"
                style={{
                  background: `linear-gradient(135deg, color-mix(in srgb, ${brand.accent} 5%, transparent), transparent)`,
                }}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: brand.accent }}
                  />
                  <span className="text-[15px] font-semibold text-foreground tracking-[-0.01em] flex-1">
                    {brand.name}
                  </span>
                  <span
                    className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: `color-mix(in srgb, ${brand.accent} 12%, transparent)`,
                      color: brand.accent,
                    }}
                  >
                    {card.stageBadge}
                  </span>
                </div>

                <p className="text-[12px] text-muted-foreground italic mb-3">
                  "{brand.tagline}"
                </p>

                {/* Mini stats */}
                <div className="flex gap-2">
                  <div className="glass-panel px-2.5 py-1.5 rounded-lg">
                    <span className="text-[16px] font-bold text-foreground">{count}</span>
                    <span className="text-[10px] text-muted-foreground block">content</span>
                  </div>
                  <div className="glass-panel px-2.5 py-1.5 rounded-lg">
                    <span className="text-[16px] font-bold text-foreground">{card.actions.length}</span>
                    <span className="text-[10px] text-muted-foreground block">actions</span>
                  </div>
                  <div
                    className="flex-1 flex items-center px-2.5 py-1.5 rounded-lg"
                    style={{
                      background: `color-mix(in srgb, ${brand.accent} 8%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${brand.accent} 12%, transparent)`,
                    }}
                  >
                    <span className="text-[11px] font-medium" style={{ color: brand.accent }}>
                      {card.channels}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action items */}
              <div className="px-5 py-3.5">
                <p className="text-metadata text-muted-foreground mb-2">{card.bodyLabel}</p>
                {card.actions.map((action, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 py-2"
                    style={{ borderBottom: i < card.actions.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
                  >
                    <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: action.dot }} />
                    <span className="text-[12px] font-medium text-foreground">{action.text}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
