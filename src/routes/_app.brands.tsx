import { createFileRoute } from '@tanstack/react-router';
import { BRANDS } from '@/data/brands';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/_app/brands')({
  component: BrandsPage,
});

function BrandsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Brands</h1>
        <p className="text-sm text-muted-foreground mt-1">Respin portfolio — brand profiles, character canons, and channel configuration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(BRANDS).map((brand) => (
          <Card key={brand.id} className="border-border/50 bg-card/40 hover:border-border/80 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: brand.accent }} />
                  <CardTitle className="text-base font-semibold">{brand.name}</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">{brand.stage}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground italic">"{brand.tagline}"</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Character</p>
                  <p className="text-sm text-foreground">{brand.character}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Mode</p>
                  <p className="text-sm text-foreground capitalize">{brand.mode}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Channels</p>
                  <p className="text-sm text-foreground">{brand.channels.join(', ')}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Payment</p>
                  <p className="text-sm text-foreground">{brand.payment}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Framework</p>
                <p className="text-sm text-foreground/80">{brand.framework}</p>
              </div>

              <details className="group">
                <summary className="text-xs text-primary cursor-pointer hover:underline">View character canon</summary>
                <pre className="mt-3 p-3 rounded-lg bg-background/40 border border-border/30 text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed max-h-60 overflow-auto">
                  {brand.canon}
                </pre>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
