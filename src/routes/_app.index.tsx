import { createFileRoute, Link } from '@tanstack/react-router';
import { useBrand } from '@/context/BrandContext';
import { useActivityLog } from '@/context/ActivityLogContext';
import { AllBrandsOverview } from '@/components/AllBrandsOverview';

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

function SingleBrandToday() {
  const { brand } = useBrand();
  const { entries } = useActivityLog();

  const accent = ACCENT_MAP[brand.id] || ACCENT_MAP.chur;
  const contentCount = entries.length;
  const actions = BRAND_ACTIONS[brand.id] || BRAND_ACTIONS.chur;

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

      {/* Content */}
      <div className="p-5 md:px-8 md:py-6 max-w-5xl">
        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="glass-panel p-4">
            <p className="text-metadata text-muted-foreground mb-1">Content</p>
            <p className="text-[24px] md:text-[28px] font-bold tracking-[-0.03em] text-foreground leading-none">{contentCount}</p>
          </div>
          <div className="glass-panel p-4">
            <p className="text-metadata text-muted-foreground mb-1">Stage</p>
            <p className="text-[24px] md:text-[28px] font-bold tracking-[-0.03em] leading-none" style={{ color: accent }}>{stageLabel}</p>
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
    </div>
  );
}
