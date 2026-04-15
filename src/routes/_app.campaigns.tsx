import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { useBrand } from '@/context/BrandContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { BRANDS } from '@/data/brands';
import { listCampaigns, getCampaignTaskCounts } from '@/utils/data.functions';
import { CampaignCreateForm } from '@/components/CampaignCreateForm';

export const Route = createFileRoute('/_app/campaigns')({
  component: CampaignsPage,
});

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'strategy', label: 'Strategy' },
  { value: 'planning', label: 'Planning' },
  { value: 'production', label: 'Production' },
  { value: 'review', label: 'Review' },
  { value: 'published', label: 'Published' },
  { value: 'learning', label: 'Learning' },
];

function CampaignsPage() {
  const { activeBrandId } = useBrand();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [taskCounts, setTaskCounts] = useState<Record<string, { total: number; done: number }>>({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);

  const listFn = useServerFn(listCampaigns);
  const countsFn = useServerFn(getCampaignTaskCounts);

  const load = async () => {
    setLoading(true);
    try {
      const result = await listFn({
        data: {
          brandId: activeBrandId !== 'all' ? activeBrandId : undefined,
          status: statusFilter !== 'all' ? statusFilter as any : undefined,
        },
      });
      setCampaigns(result.campaigns);

      if (result.campaigns.length > 0) {
        const countsResult = await countsFn({
          data: { campaignIds: result.campaigns.map((c: any) => c.id) },
        });
        setTaskCounts(countsResult.counts);
      } else {
        setTaskCounts({});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [activeBrandId, statusFilter]);

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-page-title text-foreground">Campaigns</h1>
          <p className="text-[13px] text-muted-foreground mt-1">Manage campaign workflows across brands</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-8 text-[12px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-[12px]">{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> New Campaign
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : campaigns.length === 0 ? (
            <p className="py-16 text-center text-[13px] text-muted-foreground">
              No campaigns yet. Create one to get started.
            </p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-metadata text-muted-foreground">Campaign</th>
                      <th className="text-left py-3 px-4 text-metadata text-muted-foreground">Brand</th>
                      <th className="text-left py-3 px-4 text-metadata text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-metadata text-muted-foreground">Tasks</th>
                      <th className="text-left py-3 px-4 text-metadata text-muted-foreground">Dates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c: any) => {
                      const brand = BRANDS[c.brand_id];
                      const counts = taskCounts[c.id];
                      return (
                        <tr key={c.id} className="border-b border-border hover:bg-accent/40 transition-premium">
                          <td className="py-3 px-4">
                            <Link
                              to="/campaigns/$campaignId"
                              params={{ campaignId: c.id }}
                              className="text-foreground hover:text-primary transition-premium font-medium"
                            >
                              {c.name}
                            </Link>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: brand?.accent }} />
                              <span className="text-foreground">{brand?.short || c.brand_id}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={c.status === 'published' ? 'default' : 'outline'} className="text-[10px]">
                              {c.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {counts ? `${counts.done}/${counts.total}` : '—'}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {c.start_date || '—'}{c.end_date ? ` → ${c.end_date}` : ''}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3 p-4">
                {campaigns.map((c: any) => {
                  const brand = BRANDS[c.brand_id];
                  const counts = taskCounts[c.id];
                  return (
                    <Link
                      key={c.id}
                      to="/campaigns/$campaignId"
                      params={{ campaignId: c.id }}
                      className="block p-3 rounded-xl bg-accent/40 border border-border"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: brand?.accent }} />
                        <span className="text-[13px] font-medium text-foreground">{c.name}</span>
                        <Badge variant={c.status === 'published' ? 'default' : 'outline'} className="ml-auto text-[10px]">
                          {c.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span>{brand?.short}</span>
                        {counts && <span>{counts.done}/{counts.total} tasks</span>}
                        {c.start_date && <span>{c.start_date}</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <CampaignCreateForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultBrandId={activeBrandId !== 'all' ? activeBrandId : undefined}
        onCreated={load}
      />
    </div>
  );
}
