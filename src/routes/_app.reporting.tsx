import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useActivityLog, relativeTime, type ActivityLogEntry } from '@/context/ActivityLogContext';
import { getBrandAccent } from '@/data/brands';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Activity } from 'lucide-react';

export const Route = createFileRoute('/_app/reporting')({
  component: ReportingPage,
});

const TYPE_LABELS: Record<string, string> = {
  acq: 'Acquisition',
  ret: 'Retention',
  lore: 'Lore',
  intel: 'Intel',
  content: 'Content',
  crm: 'CRM',
};

const FILTER_TABS = [
  { label: 'All', types: null },
  { label: 'Content', types: ['acq', 'ret', 'lore', 'content'] },
  { label: 'CRM', types: ['crm'] },
  { label: 'SEO', types: ['intel'] },
];

function ReportingPage() {
  const { entries } = useActivityLog();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeFilter = FILTER_TABS.find((t) => t.label === activeTab);

  const filtered = entries.filter((entry) => {
    if (activeFilter?.types && !activeFilter.types.includes(entry.type)) return false;
    if (search && !entry.outputPreview.toLowerCase().includes(search.toLowerCase()) && !entry.brand.toLowerCase().includes(search.toLowerCase()) && !entry.toolName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCopy = (entry: ActivityLogEntry) => {
    navigator.clipboard.writeText(entry.fullOutput);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reporting</h1>
        <p className="text-sm text-muted-foreground mt-1">Activity feed and cross-brand output log</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search activity…"
          className="bg-background/50 max-w-xs"
        />
        <div className="flex gap-1.5">
          {FILTER_TABS.map((tab) => (
            <Badge
              key={tab.label}
              variant="outline"
              className={`cursor-pointer text-[10px] ${activeTab === tab.label ? 'border-primary/50 text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}
              onClick={() => setActiveTab(tab.label)}
            >
              {tab.label}
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
            filtered.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 py-3 border-b border-border/30 last:border-0">
                <span
                  className="mt-1.5 h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: getBrandAccent(entry.brand) }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium" style={{ color: getBrandAccent(entry.brand) }}>
                      {entry.brand}
                    </span>
                    <Badge variant="outline" className="text-[10px] border-border/50 text-muted-foreground">
                      {TYPE_LABELS[entry.type] || entry.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{entry.toolName}</span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{entry.outputPreview}</p>
                  <span className="text-xs text-muted-foreground mt-1 block">{relativeTime(entry.timestamp)}</span>
                </div>
                <button
                  onClick={() => handleCopy(entry)}
                  className="text-muted-foreground hover:text-foreground shrink-0 mt-1"
                  title="Copy full output"
                >
                  {copiedId === entry.id ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            ))
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
              <Activity className="h-6 w-6 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                {entries.length === 0
                  ? 'No activity yet — generate your first piece of content.'
                  : 'No matching activity'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
