import { createFileRoute, Link } from '@tanstack/react-router';
import { useBrand } from '@/context/BrandContext';
import { MetricCard } from '@/components/MetricCard';
import { PriorityCard } from '@/components/PriorityCard';
import { ActivityItem } from '@/components/ActivityItem';
import { SEED_ACTIVITY, CAMPAIGN_CALENDAR } from '@/data/activity';
import { BRANDS } from '@/data/brands';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, Target, FileText } from 'lucide-react';

export const Route = createFileRoute('/_app/')({
  component: TodayPage,
});

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

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
          {getGreeting()}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{today} — {brand.name}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Content Velocity"
          value="12"
          change="+3 this week"
          icon={<FileText className="h-5 w-5" />}
        />
        <MetricCard
          label="Active Campaigns"
          value="4"
          change="2 launching soon"
          icon={<Target className="h-5 w-5" />}
        />
        <MetricCard
          label="SEO Keywords"
          value="38"
          change="5 new opportunities"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          label="Brands Active"
          value="4"
          change="All on track"
          icon={<Zap className="h-5 w-5" />}
        />
      </div>

      {/* Priority Actions */}
      <div>
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
          Recommended next actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PriorityCard
            title="Draft Kiki's TikTok teaser"
            description="Phase 1 launches this week. Character post needed for the opening salvo."
            brand="Kiki's Casino"
            brandAccent={BRANDS.kikis.accent}
            action="Open Content Studio"
          />
          <PriorityCard
            title="Review SEO keyword gaps"
            description="3 high-volume keywords with low competition identified for Orion's."
            brand="Orion's Fortune"
            brandAccent={BRANDS.orions.accent}
            action="View SEO Intel"
          />
          <PriorityCard
            title="Build FTD welcome flow"
            description="72-hour critical window. Retention calendar needs crypto FTD sequence."
            brand="Kiki's Casino"
            brandAccent={BRANDS.kikis.accent}
            action="Open CRM"
          />
        </div>
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
            {SEED_ACTIVITY.slice(0, 6).map((entry, i) => (
              <ActivityItem key={i} entry={entry} />
            ))}
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
          <CardContent className="pt-0 space-y-3">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
