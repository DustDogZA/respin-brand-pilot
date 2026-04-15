import { Link, useLocation } from '@tanstack/react-router';
import { useBrand } from '@/context/BrandContext';
import { BRANDS } from '@/data/brands';

const BRAND_TABS = [
  { id: 'all', label: 'All brands', accent: 'rgba(0,0,0,0.25)', activeAccent: 'rgba(255,255,255,0.5)', badge: null, badgeBg: '', badgeColor: '' },
  { id: 'kikis', label: "Kiki's", accent: '#c9a84c', activeAccent: '#c9a84c', badge: 'PRE', badgeBg: 'rgba(201,168,76,0.15)', badgeColor: '#c9a84c' },
  { id: 'throne', label: 'Throne', accent: '#a0192f', activeAccent: '#a0192f', badge: 'PRE', badgeBg: 'rgba(160,25,47,0.12)', badgeColor: '#a0192f' },
  { id: 'orions', label: "Orion's", accent: '#3d8bcd', activeAccent: '#3d8bcd', badge: 'PRE', badgeBg: 'rgba(61,139,205,0.12)', badgeColor: '#3d8bcd' },
  { id: 'chur', label: 'CHUR', accent: '#6b8f71', activeAccent: '#6b8f71', badge: 'EXP', badgeBg: 'rgba(107,143,113,0.12)', badgeColor: '#6b8f71' },
];

const SECTION_TABS = [
  { label: 'Today', to: '/' as const },
  { label: 'Content', to: '/content' as const },
  { label: 'CRM', to: '/crm' as const },
  { label: 'SEO', to: '/seo' as const },
];

export function TopNav() {
  const { activeBrandId, setActiveBrandId } = useBrand();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActiveSection = (to: string) => {
    if (to === '/') return currentPath === '/';
    return currentPath.startsWith(to);
  };

  return (
    <nav
      className="sticky top-0 z-50 flex items-center h-[52px] px-5 bg-white"
      style={{ borderBottom: '0.5px solid #e0ddd5' }}
    >
      {/* Logo */}
      <div
        className="shrink-0 pr-4 mr-3 flex items-baseline"
        style={{ borderRight: '1px solid #e0ddd5' }}
      >
        <span style={{ color: '#0d1b2a', fontWeight: 900, fontSize: '15px', letterSpacing: '-0.035em' }}>
          respin
        </span>
        <span style={{ color: '#3d5a42', fontWeight: 900, fontSize: '15px' }}>.</span>
        <span style={{ color: '#bbb', fontWeight: 400, fontSize: '11px' }}>hub</span>
      </div>

      {/* Brand tabs */}
      <div className="flex items-center gap-[3px]">
        {BRAND_TABS.map((tab) => {
          const isActive = activeBrandId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveBrandId(tab.id)}
              className="flex items-center border-none cursor-pointer transition-colors"
              style={{
                background: isActive ? '#0d1b2a' : 'transparent',
                color: isActive ? '#ffffff' : '#9b9690',
                fontWeight: isActive ? 600 : 500,
                borderRadius: '100px',
                padding: '5px 13px',
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <span
                className="inline-block rounded-full mr-[6px] shrink-0"
                style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: isActive ? (tab.activeAccent) : tab.accent,
                }}
              />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className="ml-[4px] inline-flex"
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '100px',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : tab.badgeBg,
                    color: isActive ? '#ffffff' : tab.badgeColor,
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Section nav */}
      <div
        className="flex items-center gap-[2px] pl-3 ml-2"
        style={{ borderLeft: '1px solid #e0ddd5' }}
      >
        {SECTION_TABS.map((tab) => {
          const active = isActiveSection(tab.to);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className="border-none cursor-pointer transition-colors"
              style={{
                background: active ? '#f0ede6' : 'transparent',
                fontWeight: active ? 600 : 400,
                color: active ? '#0d1b2a' : '#9b9690',
                fontSize: '12px',
                padding: '5px 11px',
                borderRadius: '8px',
                fontFamily: 'Inter, sans-serif',
                textDecoration: 'none',
              }}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
