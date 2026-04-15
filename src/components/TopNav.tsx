import { Link, useLocation } from '@tanstack/react-router';
import { useState } from 'react';
import { useBrand } from '@/context/BrandContext';
import { MoreHorizontal, X } from 'lucide-react';

const BRAND_TABS = [
  { id: 'all', label: 'All brands', accent: '#9ca3af', badge: null },
  { id: 'kikis', label: "Kiki's", accent: '#c9a84c', badge: 'PRE' },
  { id: 'throne', label: 'Throne', accent: '#a0192f', badge: 'PRE' },
  { id: 'orions', label: "Orion's", accent: '#3d8bcd', badge: 'PRE' },
  { id: 'chur', label: 'CHUR', accent: '#6b8f71', badge: 'EXP' },
];

const PRIMARY_SECTIONS = [
  { label: 'Today', to: '/' as const },
  { label: 'Content', to: '/content' as const },
  { label: 'CRM', to: '/crm' as const },
  { label: 'SEO', to: '/seo' as const },
];

const SECONDARY_SECTIONS = [
  { label: 'Campaigns', to: '/campaigns' as const },
  { label: 'Reporting', to: '/reporting' as const },
  { label: 'Brands', to: '/brands' as const },
  { label: 'Settings', to: '/settings' as const },
];

export function TopNav() {
  const { activeBrandId, setActiveBrandId } = useBrand();
  const location = useLocation();
  const currentPath = location.pathname;
  const [moreOpen, setMoreOpen] = useState(false);

  const isActiveSection = (to: string) => {
    if (to === '/') return currentPath === '/';
    return currentPath.startsWith(to);
  };

  return (
    <>
      {/* Desktop nav */}
      <nav className="sticky top-0 z-50 hidden md:flex items-center h-14 px-5 glass-panel rounded-none border-x-0 border-t-0">
        {/* Logo */}
        <div className="shrink-0 pr-4 mr-4 flex items-baseline border-r border-border">
          <span className="text-foreground font-bold text-[15px] tracking-[-0.035em]">respin</span>
          <span className="text-primary font-bold text-[15px]">.</span>
          <span className="text-muted-foreground font-normal text-[11px]">hub</span>
        </div>

        {/* Brand pills */}
        <div className="flex items-center gap-1">
          {BRAND_TABS.map((tab) => {
            const isActive = activeBrandId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveBrandId(tab.id)}
                className="flex items-center border-none cursor-pointer transition-premium rounded-lg px-3 py-1.5 text-[12px]"
                style={{
                  background: isActive ? `color-mix(in srgb, ${tab.accent} 12%, transparent)` : 'transparent',
                  color: isActive ? tab.accent : '#9ca3af',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                <span
                  className="inline-block rounded-full mr-1.5 shrink-0"
                  style={{ width: 6, height: 6, backgroundColor: tab.accent, opacity: isActive ? 1 : 0.5 }}
                />
                {tab.label}
                {tab.badge && (
                  <span
                    className="ml-1 text-[9px] font-semibold px-1.5 py-px rounded-full"
                    style={{
                      background: isActive ? `color-mix(in srgb, ${tab.accent} 15%, transparent)` : 'rgba(0,0,0,0.04)',
                      color: isActive ? tab.accent : '#9ca3af',
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* Section nav */}
        <div className="flex items-center gap-0.5 pl-4 border-l border-border">
          {PRIMARY_SECTIONS.map((tab) => {
            const active = isActiveSection(tab.to);
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className="text-nav transition-premium rounded-lg px-3 py-1.5 no-underline"
                style={{
                  background: active ? 'var(--color-accent)' : 'transparent',
                  color: active ? 'var(--color-foreground)' : '#9ca3af',
                  fontWeight: active ? 600 : 500,
                }}
              >
                {tab.label}
              </Link>
            );
          })}

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="text-nav transition-premium rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/60 border-none cursor-pointer bg-transparent"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {moreOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-50 glass-panel-strong p-1.5 min-w-[160px]">
                  {SECONDARY_SECTIONS.map((tab) => {
                    const active = isActiveSection(tab.to);
                    return (
                      <Link
                        key={tab.to}
                        to={tab.to}
                        onClick={() => setMoreOpen(false)}
                        className="block text-nav rounded-lg px-3 py-2 no-underline transition-premium hover:bg-accent/60"
                        style={{
                          color: active ? 'var(--color-foreground)' : '#6b7280',
                          fontWeight: active ? 600 : 400,
                        }}
                      >
                        {tab.label}
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile top bar */}
      <nav className="sticky top-0 z-50 flex md:hidden items-center h-12 px-4 glass-panel rounded-none border-x-0 border-t-0">
        <span className="text-foreground font-bold text-[15px] tracking-[-0.035em]">respin</span>
        <span className="text-primary font-bold text-[15px]">.</span>
        <span className="text-muted-foreground font-normal text-[11px]">hub</span>

        <div className="flex-1" />

        {/* Active brand indicator */}
        <button
          onClick={() => {
            const el = document.getElementById('mobile-brand-sheet');
            el?.classList.toggle('translate-y-full');
            el?.classList.toggle('translate-y-0');
          }}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 bg-accent/60 border-none cursor-pointer text-[12px] font-medium text-foreground"
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: BRAND_TABS.find(b => b.id === activeBrandId)?.accent }}
          />
          {BRAND_TABS.find(b => b.id === activeBrandId)?.label}
        </button>
      </nav>

      {/* Mobile bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-stretch h-14 glass-panel rounded-none border-x-0 border-b-0 safe-area-pb">
        {PRIMARY_SECTIONS.map((tab) => {
          const active = isActiveSection(tab.to);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 no-underline transition-premium"
              style={{
                color: active ? 'var(--color-primary)' : '#9ca3af',
                fontWeight: active ? 600 : 500,
                fontSize: '10px',
              }}
            >
              <span className="text-[13px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
        <div className="relative flex-1 flex flex-col items-center justify-center">
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className="flex flex-col items-center justify-center gap-0.5 border-none cursor-pointer bg-transparent"
            style={{ color: moreOpen ? 'var(--color-primary)' : '#9ca3af', fontSize: '10px' }}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="text-[10px] font-medium">More</span>
          </button>
          {moreOpen && (
            <>
              <div className="fixed inset-0 z-40 bg-black/10" onClick={() => setMoreOpen(false)} />
              <div className="absolute bottom-full right-0 mb-2 z-50 glass-panel-strong p-1.5 min-w-[160px]">
                {SECONDARY_SECTIONS.map((tab) => (
                  <Link
                    key={tab.to}
                    to={tab.to}
                    onClick={() => setMoreOpen(false)}
                    className="block text-nav rounded-lg px-3 py-2.5 no-underline transition-premium hover:bg-accent/60"
                    style={{ color: isActiveSection(tab.to) ? 'var(--color-foreground)' : '#6b7280' }}
                  >
                    {tab.label}
                  </Link>
                ))}
                {/* Brand selector in more menu on mobile */}
                <div className="border-t border-border mt-1 pt-1">
                  {BRAND_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveBrandId(tab.id); setMoreOpen(false); }}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2.5 border-none cursor-pointer bg-transparent transition-premium hover:bg-accent/60"
                      style={{
                        color: activeBrandId === tab.id ? tab.accent : '#6b7280',
                        fontWeight: activeBrandId === tab.id ? 600 : 400,
                        fontSize: '13px',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: tab.accent }} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
