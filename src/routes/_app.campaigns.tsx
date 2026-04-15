import { createFileRoute } from '@tanstack/react-router';
import { CAMPAIGN_CALENDAR } from '@/data/activity';
import { BRANDS } from '@/data/brands';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/_app/campaigns')({
  component: CampaignsPage,
});

const TYPE_LABELS: Record<string, string> = {
  acq: 'Acquisition', ret: 'Retention', lore: 'Lore', intel: 'Intel', content: 'Content', crm: 'CRM',
};

function CampaignsPage() {
  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-page-title text-foreground">Campaigns</h1>
        <p className="text-[13px] text-muted-foreground mt-1">Campaign calendar and active initiatives across brands</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-metadata text-muted-foreground">Portfolio at a Glance</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-metadata text-muted-foreground">Brand</th>
                  <th className="text-left py-3 px-2 text-metadata text-muted-foreground">Activity</th>
                  <th className="text-left py-3 px-2 text-metadata text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-2 text-metadata text-muted-foreground">Period</th>
                  <th className="text-left py-3 px-2 text-metadata text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {CAMPAIGN_CALENDAR.length > 0 ? (
                  CAMPAIGN_CALENDAR.map((campaign, i) => {
                    const brandData = Object.values(BRANDS).find((b) => b.short === campaign.brand);
                    return (
                      <tr key={i} className="border-b border-border hover:bg-accent/40 transition-premium">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: brandData?.accent }} />
                            <span className="text-foreground">{campaign.brand}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-foreground">{campaign.activity}</td>
                        <td className="py-3 px-2"><Badge variant="outline">{TYPE_LABELS[campaign.type] || campaign.type}</Badge></td>
                        <td className="py-3 px-2 text-muted-foreground">{campaign.period}</td>
                        <td className="py-3 px-2">
                          <Badge variant={campaign.status === 'Active' ? 'default' : 'outline'}>
                            {campaign.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={5} className="py-12 text-center text-[13px] text-muted-foreground">No campaigns yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile card layout */}
          <div className="md:hidden space-y-3">
            {CAMPAIGN_CALENDAR.length > 0 ? (
              CAMPAIGN_CALENDAR.map((campaign, i) => {
                const brandData = Object.values(BRANDS).find((b) => b.short === campaign.brand);
                return (
                  <div key={i} className="p-3 rounded-xl bg-accent/40 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: brandData?.accent }} />
                      <span className="text-[13px] font-medium text-foreground">{campaign.brand}</span>
                      <Badge variant={campaign.status === 'Active' ? 'default' : 'outline'} className="ml-auto">{campaign.status}</Badge>
                    </div>
                    <p className="text-[13px] text-foreground mb-1">{campaign.activity}</p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{TYPE_LABELS[campaign.type] || campaign.type}</span>
                      <span>·</span>
                      <span>{campaign.period}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-8 text-center text-[13px] text-muted-foreground">No campaigns yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
