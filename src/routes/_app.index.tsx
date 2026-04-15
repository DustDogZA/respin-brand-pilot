import { createFileRoute, Link } from '@tanstack/react-router';
import { useBrand } from '@/context/BrandContext';
import { ActivityItem } from '@/components/ActivityItem';
import { SEED_ACTIVITY, CAMPAIGN_CALENDAR } from '@/data/activity';
import { BRANDS } from '@/data/brands';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CalendarDays, Activity, LayoutGrid } from 'lucide-react';

export const Route = createFileRoute('/_app/')({
  component: TodayPage,
});

function TodayPage() {
  const { brand } = useBrand();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome to respin.hub
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{today} — {brand.name}</p>
      </div>

      {/* Metrics — empty state */}
      <Card className="border-border/50 bg-card/40">
        <CardContent className="py-10 flex flex-col items-center justify-center text-center gap-3">
          <LayoutGrid className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Live metrics will appear here once integrations are connected.
          </p>
        </CardContent>
      </Card>

      {/* Priority Actions — empty state */}
      <div>
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
          Recommended next actions
        </h2>
        <Card className="border-border/50 bg-card/40">
          <CardContent className="py-10 flex flex-col items-center justify-center text-center gap-3">
            <Sparkles className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Your recommended actions will appear here as you use the platform.
            </p>
            <Link to="/content" className="text-xs text-primary hover:underline mt-1">
              Start by creating content →
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-border/50 bg-card/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {SEED_ACTIVITY.length > 0 ? (
              SEED_ACTIVITY.slice(0, 6).map((entry, i) => (
                <ActivityItem key={i} entry={entry} />
              ))
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
                <Activity className="h-6 w-6 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No activity yet — generate your first piece of content.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campaign Calendar */}
        <Card className="border-border/50 bg-card/40">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
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
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: Object.values(BRANDS).find(b => b.short === campaign.brand)?.accent }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm text-foreground truncate">{campaign.activity}</p>
                        <p className="text-xs text-muted-foreground">{campaign.brand} · {campaign.period}</p>
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
                <p className="text-sm text-muted-foreground">No campaigns scheduled.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
