import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { SEED_ACTIVITY, TYPE_LABELS, type ActivityEntry } from '@/data/activity';
import { ActivityItem } from '@/components/ActivityItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/_app/reporting')({
  component: ReportingPage,
});

function ReportingPage() {
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const filtered = SEED_ACTIVITY.filter((entry) => {
    if (typeFilter && entry.type !== typeFilter) return false;
    if (filter && !entry.text.toLowerCase().includes(filter.toLowerCase()) && !entry.brand.toLowerCase().includes(filter.toLowerCase())) return false;
    return true;
  });

  const types = [...new Set(SEED_ACTIVITY.map((e) => e.type))];

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reporting</h1>
        <p className="text-sm text-muted-foreground mt-1">Activity feed and cross-brand output log</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search activity…"
          className="bg-background/50 max-w-xs"
        />
        <div className="flex gap-1.5">
          <Badge
            variant="outline"
            className={`cursor-pointer text-[10px] ${!typeFilter ? 'border-primary/50 text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}
            onClick={() => setTypeFilter(null)}
          >
            All
          </Badge>
          {types.map((type) => (
            <Badge
              key={type}
              variant="outline"
              className={`cursor-pointer text-[10px] ${typeFilter === type ? 'border-primary/50 text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}
              onClick={() => setTypeFilter(typeFilter === type ? null : type)}
            >
              {TYPE_LABELS[type] || type}
            </Badge>
          ))}
        </div>
      </div>

      <Card className="border-border/50 bg-card/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Activity Feed ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length > 0 ? (
            filtered.map((entry, i) => <ActivityItem key={i} entry={entry} />)
          ) : (
            <p className="text-sm text-muted-foreground/60 text-center py-8">No matching activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
