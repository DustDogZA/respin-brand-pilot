import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { BRANDS, BRAND_IDS } from '@/data/brands';
import { createCampaign } from '@/utils/data.functions';

interface CampaignCreateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultBrandId?: string;
  onCreated?: () => void;
}

export function CampaignCreateForm({ open, onOpenChange, defaultBrandId, onCreated }: CampaignCreateFormProps) {
  const [name, setName] = useState('');
  const [brandId, setBrandId] = useState(defaultBrandId || '');
  const [objective, setObjective] = useState('');
  const [audience, setAudience] = useState('');
  const [offerAngle, setOfferAngle] = useState('');
  const [channels, setChannels] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saving, setSaving] = useState(false);

  const createFn = useServerFn(createCampaign);

  const handleSubmit = async () => {
    if (!name || !brandId) return;
    setSaving(true);
    try {
      await createFn({
        data: {
          brand_id: brandId,
          name,
          objective: objective || undefined,
          audience: audience || undefined,
          offer_angle: offerAngle || undefined,
          channels: channels ? channels.split(',').map((c) => c.trim()) : undefined,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
        },
      });
      onOpenChange(false);
      setName(''); setObjective(''); setAudience(''); setOfferAngle(''); setChannels(''); setStartDate(''); setEndDate('');
      onCreated?.();
    } catch (e) {
      console.error('Failed to create campaign:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create Campaign</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground">Brand *</Label>
            <Select value={brandId} onValueChange={setBrandId}>
              <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
              <SelectContent>
                {BRAND_IDS.map((id) => (
                  <SelectItem key={id} value={id}>{BRANDS[id].name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground">Campaign Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Summer FTD Push" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground">Objective</Label>
            <Textarea value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="What are we trying to achieve?" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground">Audience</Label>
            <Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. Lapsed 30d+ players" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground">Offer / Angle</Label>
            <Input value={offerAngle} onChange={(e) => setOfferAngle(e.target.value)} placeholder="e.g. 100% deposit match" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground">Channels (comma-separated)</Label>
            <Input value={channels} onChange={(e) => setChannels(e.target.value)} placeholder="e.g. Email, Push, Social" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={!name || !brandId || saving}>
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating…</> : 'Create Campaign'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
