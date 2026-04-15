import { createFileRoute, Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/_app/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  const integrations = [
    { name: 'Google Sheets', icon: '📊', status: 'planned', desc: 'Content calendar and data sync' },
    { name: 'GA4', icon: '📈', status: 'planned', desc: 'Traffic analytics and conversion tracking' },
    { name: 'ClickUp', icon: '✅', status: 'planned', desc: 'Task and campaign project management' },
    { name: 'Ahrefs', icon: '🧭', status: 'ready', desc: 'SEO keyword research and competitor intelligence' },
    { name: 'Google Chat', icon: '💬', status: 'planned', desc: 'Notifications and team collaboration' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em]">Settings</h1>
        <p className="text-[13px] text-muted-foreground mt-1">Integrations, preferences, and configuration</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Integrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {integrations.map((int) => (
            <div key={int.name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-xl">{int.icon}</span>
                <div>
                  <p className="text-[13px] font-medium text-foreground">{int.name}</p>
                  <p className="text-[11px] text-muted-foreground">{int.desc}</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  int.status === 'ready'
                    ? 'border-primary/40 text-primary'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {int.status === 'ready' ? 'Ready' : 'Planned'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <Link to="/brands" className="text-[13px] font-medium text-primary hover:underline">
                Manage brand canons →
              </Link>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Edit character canons, brand voice, and campaign frameworks for each brand.
              </p>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground/50 text-center py-4 border-t border-border">
            More preferences coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
