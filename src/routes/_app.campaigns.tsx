import { createFileRoute } from '@tanstack/react-router';
import { CAMPAIGN_CALENDAR } from '@/data/activity';
import { BRANDS } from '@/data/brands';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/_app/campaigns')({
  component: CampaignsPage,
});

const TYPE_LABELS: Record<string, string> = {
  acq: 'Acquisition',
  ret: 'Retention',
  lore: 'Lore',
  intel: 'Intel',
  content: 'Content',
  crm: 'CRM',
};

function CampaignsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
        <p className="text-sm text-muted-foreground mt-1">Campaign calendar and active initiatives across brands</p>
      </div>

      <Card className="border-border/50 bg-card/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Portfolio at a Glance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-2 text-xs uppercase tracking-wider text-muted-foreground font-medium">Brand</th>
                  <th className="text-left py-3 px-2 text-xs uppercase tracking-wider text-muted-foreground font-medium">Activity</th>
                  <th className="text-left py-3 px-2 text-xs uppercase tracking-wider text-muted-foreground font-medium">Type</th>
                  <th className="text-left py-3 px-2 text-xs uppercase tracking-wider text-muted-foreground font-medium">Period</th>
                  <th className="text-left py-3 px-2 text-xs uppercase tracking-wider text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {CAMPAIGN_CALENDAR.map((campaign, i) => {
                  const brandData = Object.values(BRANDS).find((b) => b.short === campaign.brand);
                  return (
                    <tr key={i} className="border-b border-border/20 hover:bg-accent/20 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: brandData?.accent }} />
                          <span className="text-foreground">{campaign.brand}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-foreground">{campaign.activity}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className="text-[10px] border-border/50 text-muted-foreground">
                          {TYPE_LABELS[campaign.type] || campaign.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">{campaign.period}</td>
                      <td className="py-3 px-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            campaign.status === 'Active'
                              ? 'border-primary/40 text-primary'
                              : campaign.status === 'Upcoming'
                                ? 'border-brand-blue/40 text-brand-blue'
                                : 'border-border text-muted-foreground'
                          }`}
                        >
                          {campaign.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
