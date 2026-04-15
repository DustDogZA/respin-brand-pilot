import { useBrand } from '@/context/BrandContext';

const ACCENT_MAP: Record<string, string> = {
  kikis: 'rgba(201,168,76,0.15)',
  throne: 'rgba(160,25,47,0.15)',
  orions: 'rgba(61,139,205,0.15)',
  chur: 'rgba(107,143,113,0.15)',
};

const PAGE_NAMES: Record<string, string> = {
  content: 'Content Studio',
  crm: 'CRM & Retention',
  seo: 'SEO Intelligence',
};

function getHeading(page: string, brand: { mode: string; character: string }) {
  if (page === 'seo') return 'Research the landscape.';
  if (page === 'crm') {
    return brand.mode === 'community' ? 'Design the community machine.' : 'Design the retention machine.';
  }
  // content
  return brand.mode === 'community' ? 'Build community content.' : `Write as ${brand.character}.`;
}

export function PageHero({ page }: { page: 'content' | 'crm' | 'seo' }) {
  const { brand } = useBrand();
  const accentColor = ACCENT_MAP[brand.id] || ACCENT_MAP.chur;

  return (
    <div style={{ background: '#0d1b2a', padding: '24px 24px 28px', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative accent circle */}
      <div
        style={{
          position: 'absolute',
          right: -40,
          top: -40,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: accentColor,
          pointerEvents: 'none',
        }}
      />
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'rgba(245,243,238,0.45)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        {PAGE_NAMES[page]} — {brand.name}
      </p>
      <h1
        style={{
          fontSize: 36,
          fontWeight: 900,
          letterSpacing: '-0.04em',
          color: '#f5f3ee',
          lineHeight: 1.05,
          margin: 0,
        }}
      >
        {getHeading(page, brand)}
      </h1>
    </div>
  );
}
