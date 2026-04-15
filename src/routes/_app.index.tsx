import { createFileRoute, Link } from '@tanstack/react-router';
import { useBrand } from '@/context/BrandContext';
import { useActivityLog, relativeTime } from '@/context/ActivityLogContext';
import { getBrandAccent } from '@/data/brands';
import { MetricCard } from '@/components/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Activity, FileText, Target, Globe, Layers } from 'lucide-react';
import { CAMPAIGN_CALENDAR } from '@/data/activity';
import { BRANDS } from '@/data/brands';
import { Badge } from '@/components/ui/badge';
import { AllBrandsOverview } from '@/components/AllBrandsOverview';

export const Route = createFileRoute('/_app/')({
  component: TodayPage,
});

function TodayPage() {
  const { activeBrandId } = useBrand();
  if (activeBrandId === 'all') return <AllBrandsOverview />;
  return <SingleBrandToday />;
}


function TodayPage() {
  const { brand } = useBrand();
  const { entries } = useActivityLog();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const contentVelocity = entries.length;
  const activeCampaigns = entries.filter((e) => e.type === 'acq' || e.type === 'ret').length;
  const seoKeywords = entries.filter((e) => e.type === 'intel').length;
  const recentTwo = entries.slice(0, 2);
  const recentSix = entries.slice(0, 6);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-foreground">
          Welcome to respin.hub
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1">{today} — {brand.name}</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Content Velocity" value={String(contentVelocity)} icon={<FileText className="h-4 w-4" />} />
        <MetricCard label="Active Campaigns" value={String(activeCampaigns)} icon={<Target className="h-4 w-4" />} />
        <MetricCard label="Brands Active" value="4" icon={<Layers className="h-4 w-4" />} />
        <MetricCard label="SEO Keywords" value={String(seoKeywords)} icon={<Globe className="h-4 w-4" />} />
      </div>

      {/* Recommended Next Actions */}
      <div>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-4">
          Recommended next actions
        </h2>
        {recentTwo.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentTwo.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-1.5 h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: getBrandAccent(entry.brand) }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-muted-foreground">{entry.brand} · {entry.toolName}</p>
                      <p className="text-[13px] text-foreground mt-1 line-clamp-2">{entry.outputPreview}</p>
                      <Link to="/reporting" className="text-xs text-primary hover:underline mt-2 inline-block">
                        View in Reporting →
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 flex flex-col items-center justify-center text-center gap-3">
              <Activity className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-[13px] text-muted-foreground">
                Your recommended actions will appear here as you use the platform.
              </p>
              <Link to="/content" className="text-xs text-primary hover:underline mt-1">
                Start by creating content →
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {recentSix.length > 0 ? (
              recentSix.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                  <span
                    className="mt-1.5 h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: getBrandAccent(entry.brand) }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-foreground leading-relaxed line-clamp-1">{entry.outputPreview}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">{entry.brand}</span>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="text-[11px] text-muted-foreground">{entry.toolName}</span>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="text-[11px] text-muted-foreground">{relativeTime(entry.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
                <Activity className="h-6 w-6 text-muted-foreground/40" />
                <p className="text-[13px] text-muted-foreground">
                  No activity yet — generate your first piece of content.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campaign Calendar */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Campaign Calendar
              </CardTitle>
              <Link to="/campaigns" className="text-xs text-primary hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {CAMPAIGN_CALENDAR.length > 0 ? (
              <div className="space-y-3">
                {CAMPAIGN_CALENDAR.slice(0, 4).map((campaign, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: Object.values(BRANDS).find(b => b.short === campaign.brand)?.accent }}
                      />
                      <div className="min-w-0">
                        <p className="text-[13px] text-foreground truncate">{campaign.activity}</p>
                        <p className="text-[11px] text-muted-foreground">{campaign.brand} · {campaign.period}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] shrink-0 ${
                        campaign.status === 'Active'
                          ? 'border-primary/40 text-primary'
                          : 'border-border text-muted-foreground'
                      }`}
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
                <CalendarDays className="h-6 w-6 text-muted-foreground/40" />
                <p className="text-[13px] text-muted-foreground">No campaigns scheduled.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
