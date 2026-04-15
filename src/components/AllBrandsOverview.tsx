import { useBrand } from '@/context/BrandContext';
import { useActivityLog } from '@/context/ActivityLogContext';
import { BRANDS } from '@/data/brands';

const BRAND_CARDS_DATA = [
  {
    id: 'kikis',
    accentCircle: 'rgba(201,168,76,0.20)',
    stageBadge: 'PRELAUNCH',
    channels: 'TikTok · X',
    bodyLabel: 'Needs attention',
    actions: [
      { text: 'Draft TikTok opener — Phase 1 launches this week', dot: '#e8994d' },
      { text: 'Complete Veo brief for opening scene', dot: '#3d5a42' },
    ],
  },
  {
    id: 'throne',
    accentCircle: 'rgba(160,25,47,0.20)',
    stageBadge: 'PRE-LAUNCH',
    channels: 'Channel TBD',
    bodyLabel: 'Needs attention',
    actions: [
      { text: 'Ruler character still unnamed — lore block needed', dot: '#e8994d' },
      { text: 'Run keyword compass — GOT casino terms', dot: '#3d5a42' },
    ],
  },
  {
    id: 'orions',
    accentCircle: 'rgba(61,139,205,0.20)',
    stageBadge: 'PRE-LAUNCH',
    channels: 'X · Telegram',
    bodyLabel: 'Needs attention',
    actions: [
      { text: 'Segment Builder — at-risk crypto player cohort', dot: '#e8994d' },
      { text: 'Competitor intel — stake.com benchmark', dot: '#3d5a42' },
    ],
  },
  {
    id: 'chur',
    accentCircle: 'rgba(107,143,113,0.20)',
    stageBadge: 'EXPERIMENTAL',
    channels: 'Blog · Discord',
    bodyLabel: 'Get started',
    actions: [
      { text: 'Write first player article — crypto casino landscape', dot: '#e8994d' },
      { text: 'Concept Sandbox — define the editorial voice', dot: '#3d5a42' },
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

  const handleCardClick = (brandId: string) => {
    setActiveBrandId(brandId);
  };

  return (
    <div>
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{ background: '#0d1b2a', padding: '28px 24px 32px' }}
      >
        {/* Decorative circles */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 380, height: 380, borderRadius: '50%',
            background: 'rgba(61,139,205,0.08)',
            right: -80, top: -80,
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: 220, height: 220, borderRadius: '50%',
            background: 'rgba(201,168,76,0.06)',
            left: '30%', bottom: -60,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <p style={{
            fontSize: '11px', fontWeight: 600,
            color: 'rgba(245,243,238,0.45)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            marginBottom: '5px',
          }}>
            {today} — Portfolio view
          </p>
          <h1 style={{
            fontSize: '42px', fontWeight: 900,
            letterSpacing: '-0.04em',
            color: '#f5f3ee',
            lineHeight: 1.05,
            marginBottom: '16px',
          }}>
            All brands.
          </h1>

          {/* Stat chips */}
          <div className="flex flex-wrap gap-2">
            <StatChip number="4" label="brands active" />
            <StatChip number={String(totalPieces)} label="pieces this week" />
            <StatChip number="3" label="actions needed today" />
          </div>
        </div>
      </div>

      {/* Brand cards grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
        style={{ padding: '20px 24px' }}
      >
        {BRAND_CARDS_DATA.map((card) => {
          const brand = BRANDS[card.id];
          const count = brandEntryCount(brand.short);

          return (
            <div
              key={card.id}
              className="cursor-pointer transition-transform hover:scale-[1.01]"
              style={{
                borderRadius: '18px',
                overflow: 'hidden',
                border: '0.5px solid #e0ddd5',
                background: '#ffffff',
              }}
              onClick={() => handleCardClick(card.id)}
            >
              {/* Card header (dark) */}
              <div
                className="relative overflow-hidden"
                style={{ background: '#0d1b2a', padding: '18px 20px 20px' }}
              >
                {/* Accent circle */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    right: -30, top: -30,
                    width: 140, height: 140,
                    borderRadius: '50%',
                    background: card.accentCircle,
                  }}
                />

                <div className="relative z-10">
                  {/* Brand row */}
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="shrink-0"
                      style={{
                        width: 7, height: 7,
                        borderRadius: '50%',
                        background: brand.accent,
                        display: 'inline-block',
                      }}
                    />
                    <span style={{
                      fontSize: '16px', fontWeight: 800,
                      color: '#f5f3ee',
                      letterSpacing: '-0.02em',
                      flex: 1,
                    }}>
                      {brand.name}
                    </span>
                    <span style={{
                      fontSize: '9px', fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '100px',
                      background: `color-mix(in srgb, ${brand.accent} 20%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${brand.accent} 35%, transparent)`,
                      color: brand.accent,
                      marginLeft: 'auto',
                    }}>
                      {card.stageBadge}
                    </span>
                  </div>

                  {/* Tagline */}
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(245,243,238,0.45)',
                    fontStyle: 'italic',
                  }}>
                    "{brand.tagline}"
                  </p>

                  {/* Mini stats row */}
                  <div className="flex gap-1.5" style={{ marginTop: '14px' }}>
                    <div style={{
                      background: 'rgba(245,243,238,0.08)',
                      backdropFilter: 'blur(6px)',
                      WebkitBackdropFilter: 'blur(6px)',
                      border: '1px solid rgba(245,243,238,0.12)',
                      borderRadius: '8px',
                      padding: '6px 10px',
                    }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#f5f3ee', lineHeight: 1 }}>
                        {count}
                      </span>
                      <span style={{ fontSize: '10px', color: 'rgba(245,243,238,0.45)', display: 'block', marginTop: '2px' }}>
                        content
                      </span>
                    </div>
                    <div style={{
                      background: 'rgba(245,243,238,0.08)',
                      backdropFilter: 'blur(6px)',
                      WebkitBackdropFilter: 'blur(6px)',
                      border: '1px solid rgba(245,243,238,0.12)',
                      borderRadius: '8px',
                      padding: '6px 10px',
                    }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#f5f3ee', lineHeight: 1 }}>
                        {card.actions.length}
                      </span>
                      <span style={{ fontSize: '10px', color: 'rgba(245,243,238,0.45)', display: 'block', marginTop: '2px' }}>
                        actions
                      </span>
                    </div>
                    <div style={{
                      flex: 1,
                      background: `color-mix(in srgb, ${brand.accent} 15%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${brand.accent} 25%, transparent)`,
                      borderRadius: '8px',
                      padding: '6px 10px',
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: brand.accent }}>
                        {card.channels}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card body (white) */}
              <div style={{ padding: '14px 20px' }}>
                <p style={{
                  fontSize: '11px', fontWeight: 600,
                  color: '#9b9690',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.08em',
                  marginBottom: '8px',
                }}>
                  {card.bodyLabel}
                </p>
                {card.actions.map((action, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2"
                    style={{
                      padding: '8px 0',
                      borderBottom: i < card.actions.length - 1 ? '0.5px solid #f0ede6' : 'none',
                    }}
                  >
                    <span
                      className="shrink-0"
                      style={{
                        width: 5, height: 5,
                        borderRadius: '50%',
                        background: action.dot,
                        display: 'inline-block',
                      }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#0d1b2a' }}>
                      {action.text}
                    </span>
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

function StatChip({ number, label }: { number: string; label: string }) {
  return (
    <div
      className="flex items-center gap-[7px]"
      style={{
        background: 'rgba(245,243,238,0.08)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(245,243,238,0.12)',
        borderRadius: '100px',
        padding: '6px 14px',
      }}
    >
      <span style={{ fontSize: '14px', fontWeight: 800, color: '#f5f3ee' }}>{number}</span>
      <span style={{ fontSize: '11px', color: 'rgba(245,243,238,0.5)' }}>{label}</span>
    </div>
  );
}
