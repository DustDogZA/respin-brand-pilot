import { useBrand } from '@/context/BrandContext';

const ACCENT_MAP: Record<string, string> = {
  kikis: '#c9a84c',
  throne: '#a0192f',
  orions: '#3d8bcd',
  chur: '#6b8f71',
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
  return brand.mode === 'community' ? 'Build community content.' : `Write as ${brand.character}.`;
}

export function PageHero({ page }: { page: 'content' | 'crm' | 'seo' }) {
  const { brand } = useBrand();
  const accent = ACCENT_MAP[brand.id] || ACCENT_MAP.chur;

  return (
    <div
      className="relative overflow-hidden px-6 lg:px-8 pt-8 pb-10"
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 6%, transparent), transparent 70%)`,
      }}
    >
      {/* Decorative accent element */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          right: -40,
          top: -40,
          width: 200,
          height: 200,
          background: `color-mix(in srgb, ${accent} 8%, transparent)`,
        }}
      />
      <p className="text-metadata text-muted-foreground mb-1.5">
        {PAGE_NAMES[page]} — {brand.name}
      </p>
      <h1 className="text-page-title text-foreground">
        {getHeading(page, brand)}
      </h1>
    </div>
  );
}
