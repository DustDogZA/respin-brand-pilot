import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { BRANDS } from '@/data/brands';
import { useBrand } from '@/context/BrandContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export const Route = createFileRoute('/_app/brands')({
  component: BrandsPage,
});

function BrandsPage() {
  const { updateCanon, getBrand } = useBrand();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftCanon, setDraftCanon] = useState('');

  const startEdit = (brandId: string, currentCanon: string) => { setEditingId(brandId); setDraftCanon(currentCanon); };
  const cancelEdit = () => { setEditingId(null); setDraftCanon(''); };
  const saveCanon = (brandId: string) => { updateCanon(brandId, draftCanon); setEditingId(null); setDraftCanon(''); toast('Canon saved'); };

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-page-title text-foreground">Brands</h1>
        <p className="text-[13px] text-muted-foreground mt-1">Brand profiles, character canons, and channel configuration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(BRANDS).map((baseBrand) => {
          const brand = getBrand(baseBrand.id);
          const isEditing = editingId === brand.id;

          return (
            <Card key={brand.id} className="hover:border-primary/15">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: brand.accent }} />
                    <CardTitle className="text-[15px] font-semibold tracking-[-0.01em]">{brand.name}</CardTitle>
                  </div>
                  <Badge variant="outline">{brand.stage}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[13px] text-foreground italic">"{brand.tagline}"</p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Character', value: brand.character },
                    { label: 'Mode', value: brand.mode },
                    { label: 'Channels', value: brand.channels.join(', ') },
                    { label: 'Payment', value: brand.payment },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-metadata text-muted-foreground mb-1">{item.label}</p>
                      <p className="text-[13px] text-foreground capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-metadata text-muted-foreground mb-1">Framework</p>
                  <p className="text-[13px] text-foreground/80">{brand.framework}</p>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <Textarea value={draftCanon} onChange={(e) => setDraftCanon(e.target.value)} className="min-h-[200px] text-[13px] leading-relaxed rounded-xl" />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => saveCanon(brand.id)}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(brand.id, brand.canon)}>Edit canon</Button>
                    <pre className="p-3 rounded-xl bg-accent/60 border border-border text-[11px] text-foreground/80 whitespace-pre-wrap leading-relaxed max-h-60 overflow-auto">
                      {brand.canon}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
